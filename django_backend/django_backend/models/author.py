from django.db import models
from django_backend.models import FileModel
from django_backend.validators.author import (
    validate_name,
    validate_surname,
    validate_patronymics,
)


class Author(models.Model):
    id = models.AutoField(primary_key=True)
    surname = models.TextField(blank=False, null=False, validators=[validate_surname], db_index=True)
    name = models.TextField(blank=False, null=False, validators=[validate_name], db_index=True)
    patronymics = models.TextField(blank=True, null=False, validators=[validate_patronymics], db_index=True)
    description = models.TextField(blank=False, null=False)
    icon = models.ForeignKey(FileModel, null=True, on_delete=models.SET_NULL)
