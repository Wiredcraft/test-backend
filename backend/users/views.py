
from django.shortcuts import get_object_or_404
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import IntegerField

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.decorators import action

from users.models import Userdata, Friendship
from users.serializers import UserdataSerializer, NearbyFriendSerializer
from utils.mixins import AuditTrailMixin


class UserdataViewSet(AuditTrailMixin, viewsets.ModelViewSet):
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


class FriendshipViewSet(
	AuditTrailMixin,
	mixins.CreateModelMixin,
	mixins.ListModelMixin,
	mixins.RetrieveModelMixin,
	mixins.DestroyModelMixin,
	viewsets.GenericViewSet,
):
	"""
	API endpoint for CRUD actions over given user's friends.

	list:
	Returns a list of all user's friends.

	retrieve:
	Returns the given friend.

	create:
	Creates a new friendship connection.

	destroy:
	Deletes a given friendship connection.

	nearby:
	Finds nearby friends. Please use `distance` GET parameter to limit distance. Defaults to 10000m (10km).
	Returns an additional field `distance` representing the distance in meters in WGS84 projection.
	"""

	serializer_class = UserdataSerializer
	audit_trail_label = 'friendship'

	def get_audit_trail_context(self, request, **kwargs):
		# returns additional data for audit log
		return {
			'user_pk': kwargs.get('user_pk'),
			'pk': request.data.get('id'),
		}

	def get_queryset(self):
		if self.action == 'list':
			return Userdata.objects.get(pk=self.kwargs['user_pk']).friends.all()
		if self.action == 'retrieve':
			return Userdata.objects.get(pk=self.kwargs['user_pk']).friends.filter(pk=self.kwargs['pk'])

	def create(self, request, **kwargs):
		friend = Userdata.objects.get(pk=request.data['id'])
		Userdata.objects.get(pk=kwargs['user_pk']).friends.add(friend)
		return Response(self.serializer_class(friend).data, status=201)

	def destroy(self, request, **kwargs):
		friend = Userdata.objects.get(pk=kwargs['pk'])
		Userdata.objects.get(pk=kwargs['user_pk']).friends.remove(friend)
		return Response({}, status=204)

	@action(detail=False, methods=['GET'])
	def nearby(self, request, **kwargs):
		me = Userdata.objects.get(pk=self.kwargs['user_pk'])
		if not me.coords:
			return Response({'success': False, 'error': 'Can only lookup nearby friends if coords are given.'}, status=400)
		distance = int(request.GET.get('distance') or 10000)
		# using PostGIS ST_DWithin and ST_Distance for efficient index-based lookup
		nearby_friends = me.friends\
			.filter(coords__dwithin=(me.coords, D(m=distance)))\
			.annotate(distance=Distance('coords', me.coords, output_field=IntegerField()))\
			.order_by('distance')
		return Response(NearbyFriendSerializer(nearby_friends, many=True).data)
