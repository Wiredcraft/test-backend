from django.contrib.gis.db import models

import uuid


class Userdata(models.Model):

	# use non-enumerable UUID to prevent competition analysis and user enum
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	# FIXME: python naming convention is kebab_case, consider renaming?
	createdAt = models.DateTimeField(auto_now_add=True)

	name = models.CharField(max_length=250)
	dob = models.DateField(null=True)
	address = models.CharField(max_length=250, null=True)
	# FIXME: chose SRID 4326 (WGS 84), but for China-compatible coordinates it would be 4555
	coords = models.PointField(null=True, srid=4326, spatial_index=True, geography=True)
	description = models.TextField(null=True)

	friends = models.ManyToManyField('self', blank=True, symmetrical=True, through='users.Friendship')

	class Meta:
		ordering = ['createdAt']


class Friendship(models.Model):

	# FIXME: python naming convention is kebab_case, consider renaming?
	createdAt = models.DateTimeField(auto_now_add=True)

	initiator = models.ForeignKey('users.Userdata', related_name='initiated', on_delete=models.CASCADE)
	addressee = models.ForeignKey('users.Userdata', related_name='addressed_to', on_delete=models.CASCADE)
	# TODO: add other friendship-related fields, like "status": pending, rejected, accepted, etc.
