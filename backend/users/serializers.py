
from rest_framework import serializers

from users.models import Userdata


class UserdataSerializer(serializers.ModelSerializer):

	class Meta:
		model = Userdata
		fields = [
			'id',
			'name',
			'dob',
			'address',
			'description',
			'createdAt',
		]
