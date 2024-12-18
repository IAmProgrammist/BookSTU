from django.db import models
from django_backend.models import FileModel


class Author(models.Model):
    id = models.AutoField(primary_key=True)
    surname = models.TextField(blank=False, null=False)
    name = models.TextField(blank=False, null=False)
    patronymics = models.TextField(blank=True, null=False)
    description = models.TextField(blank=False, null=False)
    icon = models.ForeignKey(FileModel, null=True, on_delete=models.CASCADE)
