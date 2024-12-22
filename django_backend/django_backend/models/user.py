from django.contrib.auth.models import User
from django.db import models
import django_backend.validators.user as user_validators

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_number = models.TextField(blank=False, null=False)
    surname = models.TextField(blank=False, null=False)
    name = models.TextField(blank=False, null=False)
    patronymics = models.TextField(blank=True, null=False)
    passport_data = models.TextField(blank=False, null=False)
    banned = models.BooleanField(null=False, default=False)
