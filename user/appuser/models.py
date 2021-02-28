from django.db import models

# Create your models here.
class Appuser(models.Model):
    id = models.CharField(max_length=60, primary_key=True)
    name = models.CharField(max_length=80, blank=True, default='')
    dob = models.DateField()
    address = models.CharField(max_length=120, blank=True, default='')
    description = models.TextField()
    createdAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['createdAt']