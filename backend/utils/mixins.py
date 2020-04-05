
from django.utils import timezone

import logging


class AuditTrailMixin:
	"""
	Add this mixin to ViewSet-s for logging a complete API audit trail.

	Please set either `audit_trail_model` or `queryset` param for model resolution.
	"""

	def _audit_trail(self, user=None, action=None, model='default', pk=None):
		logger = logging.getLogger(f'audit.{model}.{action}')
		logger.info(f'{timezone.now().isoformat()} {user} {action} {model} pk:{pk}')

	def _get_model(self):
		return getattr(self, 'audit_trail_model', self.get_queryset().model.__name__)

	def _log_change(self, data=None):
		if not data:
			return
		model = self._get_model()
		# FIXME: should we use pk/id consistently? django's opinion is "pk" but
		# I keep "id" for compliance with the initial API spec
		pk = data.get('id')
		if pk:
			self._audit_trail(
				user=self.request.user,
				action=self.action,
				model=model,
				pk=pk,
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
		self._log_change({'id': pk})

	def initial(self, request, *args, **kwargs):
		# idempotent actions are safe to pre-log
		# writing actions are logged separately
		if self.action in ['list', 'retrieve']:
			model = self._get_model()
			pk = kwargs.get(self.lookup_url_kwarg or self.lookup_field)
			self._audit_trail(
				user=request.user,
				action=self.action,
				model=model,
				pk=pk,
			)
		return super().initial(request, *args, **kwargs)
