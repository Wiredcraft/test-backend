from django.http import HttpResponse, JsonResponse
# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .models import Appuser
from .serializers import AppuserSerializer


@api_view(['GET', 'PUT', 'DELETE'])
def appuser_detail(request, id):
    """
    Retrieve, update or delete a app user.
    """
    try:
        appuser = Appuser.objects.get(id=id)
    except Appuser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AppuserSerializer(appuser)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AppuserSerializer(appuser, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        appuser.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def appuser_list(request, format=None):
    """
    List all app users, or create a new app user.
    """
    if request.method == 'GET':
        appusers = Appuser.objects.all()
        serializer = AppuserSerializer(appusers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AppuserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)