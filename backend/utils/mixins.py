
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

	def initial(self, request, *args, **kwargs):
		if hasattr(self, 'audit_trail_model'):
			model = self.audit_trail_model
		elif self.get_queryset():
			model = self.get_queryset().model.__name__
		else:
			model = 'default'
		self._audit_trail(user=request.user, action=self.action, model=model, pk=kwargs.get('pk'))
		return super().initial(request, *args, **kwargs)
