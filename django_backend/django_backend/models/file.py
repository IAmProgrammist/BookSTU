from django.db import models
from django_backend.validators.file import validate_file

class FileModel(models.Model):
    file = models.FileField(upload_to='files', validators=[validate_file], blank=False, null=False)
    content_type = models.CharField(null=True, blank=True, max_length=100)
    
    def save(self, *args, **kwargs):
        self.content_type = self.file.file.content_type
        super().save(*args, **kwargs)
