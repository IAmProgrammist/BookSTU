from django.db import models


class PublishingHouse(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)
