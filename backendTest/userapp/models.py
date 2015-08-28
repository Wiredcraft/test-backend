from __future__ import unicode_literals

from django.db import models

#######   USER MODEL
#{
#  "id": "xxx",                  // int,              			 provided by database, not here in the code
#  "name": "test",               // str(test),         			 user name
#  "dob": "",                    // date,             			 date of birth
#  "address": "",                // str,                         user address
#  "description": "",            // str(null is allowed),        user description
#  "created_at": ""              // date,             			 user created date
#}

class Appuser(models.Model):
	Name = models.CharField(default="test",max_length=20)
	Dob = models.DateField()
	Address = models.CharField(default="",max_length=50,blank=True)
	Description = models.TextField(default="",blank=True)
	Created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.Name
	class Meta:
		ordering = ['id']  #organized by id when read from db