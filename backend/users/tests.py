from django.contrib.auth.models import AnonymousUser
from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APIClient, APITestCase

from users.models import Userdata

class UserdataCRUDTest(APITestCase):

	@classmethod
	def setUpTestData(cls):
		cls.USER_ID_1 = '25ee08b2-7cad-4407-bfd4-257b051d1b1d'
		cls.USER_ID_2 = 'deadbeef-7cad-4407-bfd4-257b051d1b1d'

	def test_user_list(self):
		# empty user list by default
		response = self.client.get(reverse('users-list'))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, [])
		# create one user and get it back
		Userdata.objects.create(id=self.USER_ID_1)
		response = self.client.get(reverse('users-list'))
		self.assertEqual(len(response.data), 1)
		self.assertTrue(response.data[0].items() >= {'id': self.USER_ID_1}.items())
		# create one more, it should be after the first one
		Userdata.objects.create(id=self.USER_ID_2)
		response = self.client.get(reverse('users-list'))
		self.assertEqual(len(response.data), 2)
		self.assertTrue(response.data[0].items() >= {'id': self.USER_ID_1}.items())
		self.assertTrue(response.data[1].items() >= {'id': self.USER_ID_2}.items())

	def test_user_creation(self):
		# name is required
		response = self.client.post(reverse('users-list'), {})
		self.assertEqual(response.status_code, 400)
		# ok, provide a name
		response = self.client.post(reverse('users-list'), {'name': 'Bob'})
		self.assertEqual(response.status_code, 201)
		# returns new instance
		self.assertTrue(response.data.items() >= {
			'name': 'Bob',
			'address': None,
			'dob': None,
			'description': None,
		}.items())
		# try to provide some erroneous fields
		response = self.client.post(reverse('users-list'), {'name': 'Alice', 'dob': '1980-21-34'})
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['dob'][0].code, 'invalid')
		# ok, provide normal dob
		response = self.client.post(reverse('users-list'), {'name': 'Alice', 'dob': '1980-10-10'})
		self.assertEqual(response.status_code, 201)
		# so altogether we've created 2 users
		response = self.client.get(reverse('users-list'))
		self.assertEqual(len(response.data), 2)
		self.assertEqual(response.data[0]['name'], 'Bob')
		self.assertEqual(response.data[1]['name'], 'Alice')

	def test_user_retrieval(self):
		Userdata.objects.create(id=self.USER_ID_1, name='Alice')
		Userdata.objects.create(id=self.USER_ID_2, name='Bob')
		response = self.client.get(reverse('users-detail', args=(self.USER_ID_1,)))
		self.assertEqual(response.data['name'], 'Alice')
		response = self.client.get(reverse('users-detail', args=(self.USER_ID_2,)))
		self.assertEqual(response.data['name'], 'Bob')
		# try a bogus user
		response = self.client.get(reverse('users-detail', args=('00000000-7cad-4407-bfd4-257b051d1b1d',)))
		self.assertEqual(response.status_code, 404)

	def test_user_updating(self):
		user1 = Userdata.objects.create(id=self.USER_ID_1, name='Alice')
		user2 = Userdata.objects.create(id=self.USER_ID_2, name='Bob')
		response = self.client.put(reverse('users-detail', args=(self.USER_ID_1,)), {'name': 'Alice Smith'})
		self.assertEqual(response.data['name'], 'Alice Smith')
		user1.refresh_from_db()
		self.assertEqual(user1.name, 'Alice Smith')
		# try some whitespace and crazily formatted date
		response = self.client.put(
			reverse('users-detail', args=(self.USER_ID_2,)),
			{'name': ' Bob Snow ', 'dob': '1984-1-1'},
		)
		self.assertEqual(response.data['name'], 'Bob Snow')
		user2.refresh_from_db()
		self.assertEqual(user2.name, 'Bob Snow')
		self.assertEqual(str(user2.dob), '1984-01-01')
		# createdAt field is read only and cannot be changed
		response = self.client.patch(reverse('users-detail', args=(self.USER_ID_1,)), {'createdAt': '2020-01-01'})
		user1.refresh_from_db()
		self.assertEqual(response.data['createdAt'], timezone.localtime(user1.createdAt).isoformat())

	def test_user_deleting(self):
		Userdata.objects.create(id=self.USER_ID_1, name='Alice')
		Userdata.objects.create(id=self.USER_ID_2, name='Bob')
		response = self.client.delete(reverse('users-detail', args=(self.USER_ID_1,)))
		self.assertEqual(response.status_code, 204)
		self.assertEqual(Userdata.objects.count(), 1)
		response = self.client.delete(reverse('users-detail', args=(self.USER_ID_2,)))
		self.assertEqual(Userdata.objects.count(), 0)


class FriendshipTest(APITestCase):

	@classmethod
	def setUpTestData(cls):
		cls.user1 = Userdata.objects.create(name='Alice')
		cls.user2 = Userdata.objects.create(name='Bob')
		cls.user3 = Userdata.objects.create(name='Jon')

	def test_friendship_list(self):
		# empty list by default
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, [])
		# add some friends and check list
		self.user1.friends.add(self.user2)
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['id'], str(self.user2.pk))
		# check if user is in friends
		response = self.client.get(reverse('friends-detail', kwargs={'user_pk': self.user1.pk, 'pk': self.user2.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['id'], str(self.user2.pk))
		# backwards
		response = self.client.get(reverse('friends-detail', kwargs={'user_pk': self.user2.pk, 'pk': self.user1.pk}))
		self.assertEqual(response.data['id'], str(self.user1.pk))

	def test_friendship_creation(self):
		# create a friend
		response = self.client.post(reverse('friends-list', kwargs={'user_pk': self.user1.pk}), {'id': self.user2.pk})
		self.assertEqual(response.status_code, 201)
		# and list it
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['id'], str(self.user2.pk))
		# check the other side
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user2.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['id'], str(self.user1.pk))
		# create one more time, no problem but silently ignore
		# FIXME: is this the desired behavior?
		response = self.client.post(reverse('friends-list', kwargs={'user_pk': self.user1.pk}), {'id': self.user2.pk})
		self.assertEqual(response.status_code, 201)

	def test_friendship_removal(self):
		self.user1.friends.add(self.user2)
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(len(response.data), 1)
		response = self.client.delete(reverse('friends-detail', kwargs={'user_pk': self.user1.pk, 'pk': self.user2.pk}))
		self.assertEqual(response.status_code, 204)
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, [])
		# test removal from the other side
		self.user1.friends.add(self.user2)
		response = self.client.delete(reverse('friends-detail', kwargs={'user_pk': self.user2.pk, 'pk': self.user1.pk}))
		self.assertEqual(response.status_code, 204)
		response = self.client.get(reverse('friends-list', kwargs={'user_pk': self.user1.pk}))
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, [])
