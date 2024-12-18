from django.db import models


class Genre(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)
