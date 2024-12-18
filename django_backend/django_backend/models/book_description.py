from django.db import models
from django_backend.models import Genre, PublishingHouse, Author


class BookDescription(models.Model):
    id = models.IntegerField(primary_key=True)
    isbn = models.TextField(blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    genres = models.ManyToManyField(Genre)
    publishing_house = models.ForeignKey(PublishingHouse, null=False, on_delete=models.PROTECT)
    authors = models.ManyToManyField(Author)
