from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from userapp.models import *

class AccountTests(APITestCase):
    def setUp(self):
        data = {"Name":"test111","Dob":"1991-05-08","Address":"Beijing","Description":"Who knows"}
        self.client.post('/users/', data, format='json')
        self.client.post('/users/', data, format='json')

    def test_post_normal(self):
        # normal value
        data = {"Name":"test","Dob":"1991-05-08","Address":"Beijing","Description":"Who knows"}
        response = self.client.post('/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_default(self):
        # default value
        data = {"Name":"test","Dob":"1991-05-08","Address":"","Description":""}
        response = self.client.post('/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_wrongName(self):
        # wrong date
        data = {"Name":"","Dob":"1991-05-08","Address":"","Description":""}
        response = self.client.post('/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_wrongDate(self):
        # wrong date
        data = {"Name":"test","Dob":"19year","Address":"","Description":""}
        response = self.client.post('/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_get_all(self):
        response = self.client.get('/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_nothing(self):
        response = self.client.get('/users/1/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_one(self):
        response = self.client.get('/users/9/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put(self):
        data = {"Name":"Charlie","Dob":"1991-05-08","Address":"Beijing","Description":"Who knows"}
        response = self.client.put('/users/22/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_nothing(self):
        response = self.client.delete('/users/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete(self):
        response = self.client.delete('/users/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        

