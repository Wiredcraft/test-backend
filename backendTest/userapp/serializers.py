from rest_framework import serializers
from userapp.models import *

class AppuserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Appuser
        fields = ('id','Name','Dob','Address','Description','Created_at')