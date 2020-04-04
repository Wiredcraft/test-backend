from django.db import models

import uuid

class Userdata(models.Model):

	# use non-enumerable UUID to prevent competition analysis and user enum
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=250)
	dob = models.DateField(null=True)
	address = models.CharField(max_length=250, null=True)
	description = models.TextField(null=True)
	createdAt = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['createdAt']
