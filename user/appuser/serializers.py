from rest_framework import serializers

from .models import Appuser


class AppuserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Appuser
        fields = ('id', 'name', 'dob', 'address', 'description')
