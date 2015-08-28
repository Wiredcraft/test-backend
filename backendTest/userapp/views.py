from django.shortcuts import render
from rest_framework import viewsets
from userapp.models import *
from userapp.serializers import *


#################  REST viewset  ######################
class AppuserViewSet(viewsets.ModelViewSet):
    queryset = Appuser.objects.all()
    serializer_class = AppuserSerializer