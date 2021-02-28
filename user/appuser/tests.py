from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Appuser


class AppuserTests(APITestCase):
    def test_create_appuser(self):
        """
        Ensure we can create a new appuser object.
        """
        url = reverse('appusers-list')
        data = {'id': 'aaron', 'dob': '1985-08-09', 'description': 'test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appuser.objects.count(), 1)
        self.assertEqual(Appuser.objects.get().id, 'aaron')

