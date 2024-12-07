from django.db import models
from django_backend.validators.file import validate_file

class FileModel(models.Model):
    file = models.FileField(upload_to='files/', validators=[validate_file], blank=False, null=False)