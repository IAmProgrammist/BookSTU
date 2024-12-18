from django.db import models


class Genre(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(blank=False, null=False, max_length=40)
    description = models.TextField(blank=False, null=False, max_length=2048)
