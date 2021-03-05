from datetime import timedelta

from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from oauth2_provider.models import Application, AccessToken
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Appuser


class APITestBase(APITestCase):
    def setUp(self) -> None:
        self.test_user = User.objects.create_user(
            username="test_user",
            email="test@example.com",
            password="123456",
        )
        self.application = Application.objects.create(
            name="Test Application",
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
        )
        self.access_token = AccessToken.objects.create(
            user=self.test_user,
            scope="read write",
            expires=timezone.now() + timedelta(seconds=300),
            token="secret-access-token-key",
            application=self.application,
        )

    def tearDown(self):
        self.access_token.delete()
        self.application.delete()
        self.test_user.delete()

    def login(self):
        self.client.credentials(Authorization='Bearer {}'.format(self.access_token))

    def logout(self):
        self.access_token = None


class AppuserTests(APITestBase):
    def test_create_appuser(self):
        """
        Ensure we can create a new appuser object.
        """
        url = reverse('appusers-list')
        data = {'dob': '1985-08-09', 'description': 'test'}
        self.login()
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appuser.objects.count(), 1)
        self.assertEqual(Appuser.objects.get().id, 1)

    def test_authentication_denied(self):
        url = reverse('appusers-list')
        data = {'dob': '1985-08-09', 'description': 'test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def _add_user_in_db(self):
        appuser = Appuser(name='Aaron Wang', dob='1985-08-09')
        appuser.save()

    def test_appusers_list(self):
        url = reverse('appusers-list')
        self._add_user_in_db()
        self.login()
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Aaron Wang')

    def test_get_appuser(self):
        self._add_user_in_db()
        self.login()
        response = self.client.get('/appusers/1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Aaron Wang')

        # user not found
        response = self.client.get('/appusers/2/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_appuser(self):
        self._add_user_in_db()
        self.login()
        data = {'dob': '1985-08-11', 'description': 'test'}
        response = self.client.put('/appusers/1/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'test')
        self.assertEqual(response.data['dob'], '1985-08-11')

    def test_delete_appuser(self):
        self._add_user_in_db()
        self.login()
        response = self.client.delete('/appusers/1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Appuser.objects.count(), 0)