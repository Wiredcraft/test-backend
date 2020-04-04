
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from users.models import Userdata
from users.serializers import UserdataSerializer


class UserdataViewSet(viewsets.ModelViewSet):
	"""
	API endpoint for CRUD actions over user data.
	"""

	serializer_class = UserdataSerializer
	queryset = Userdata.objects.all()
