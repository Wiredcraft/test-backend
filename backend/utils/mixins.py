
from django.utils import timezone

import logging


class AuditTrailMixin:
	"""
	Add this mixin to ViewSet-s for logging a complete API audit trail.

	Please set either `audit_trail_label` or `queryset` param for model resolution.
	"""

	def _audit_trail(self, user=None, action=None, model='default', context=None):
		logger = logging.getLogger(f'audit.{model}.{action}')
		logger.info(f'{timezone.now().isoformat()} {user} {action} {model} context:{context}')

	def get_audit_trail_context(self, request, **kwargs):
		return {}

	def _get_model(self):
		return getattr(self, 'audit_trail_label', None) or self.get_queryset().model.__name__

	def _log_change(self, data=None):
		if not data:
			return
		model = self._get_model()
		context = self.get_audit_trail_context(self.request, **self.kwargs)
		# FIXME: should we use pk/id consistently? django's opinion is "pk" but
		# I keep "id" for compliance with the initial API spec
		context['pk'] = data.get('id')
		if context['pk']:
			self._audit_trail(
				user=self.request.user,
				action=self.action,
				model=model,
				context=context,
			)

	def perform_create(self, serializer):
		super().perform_create(serializer)
		self._log_change(serializer.data)

	def perform_update(self, serializer):
		super().perform_update(serializer)
		self._log_change(serializer.data)

	def perform_destroy(self, instance):
		pk = instance.pk
		super().perform_destroy(instance)
		self._log_change({'id': str(pk)})

	def initial(self, request, *args, **kwargs):
		# idempotent actions are safe to pre-log
		# writing actions are logged separately
		if self.action not in ['create', 'update', 'partial_update', 'destroy']:
			model = self._get_model()
			context = self.get_audit_trail_context(request, **kwargs)
			context['pk'] = kwargs.get(self.lookup_url_kwarg or self.lookup_field)
			self._audit_trail(
				user=request.user,
				action=self.action,
				model=model,
				context=context,
			)
		return super().initial(request, *args, **kwargs)
