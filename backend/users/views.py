
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.response import Response

from users.models import Userdata
from users.serializers import UserdataSerializer

import logging


class UserdataViewSet(viewsets.ModelViewSet):
	"""
	API endpoint for CRUD actions over user data.

	list:
	Returns a list of all the existing users.

	retrieve:
	Returns the given user.

	create:
	Creates a new user instance.

	update:
	Update a given user instance.

	partial_update:
	Updates a given user instance.

	destroy:
	Deletes a given user instance.
	"""

	serializer_class = UserdataSerializer
	queryset = Userdata.objects.all()

	def _audit_trail(self, user=None, action=None, model='default', pk=None):
		logger = logging.getLogger(f'audit.{model}.{action}')
		logger.info(f'{timezone.now().isoformat()} {user} {action} {model} pk:{pk}')

	def initial(self, request, *args, **kwargs):
		self._audit_trail(user=request.user, action=self.action, model='userdata', pk=kwargs.get('pk'))
		return super().initial(request, *args, **kwargs)
