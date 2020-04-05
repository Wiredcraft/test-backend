
from rest_framework import serializers
from rest_framework_gis.fields import GeometryField

from users.models import Userdata


class UserdataSerializer(serializers.ModelSerializer):

	coords = GeometryField(required=False)

	class Meta:
		model = Userdata
		fields = [
			'id',
			'name',
			'dob',
			'address',
			'coords',
			'description',
			'createdAt',
		]


class NearbyFriendSerializer(UserdataSerializer):

	distance = serializers.IntegerField(default=0, read_only=True)

	class Meta(UserdataSerializer.Meta):
		fields = UserdataSerializer.Meta.fields + ['distance']
