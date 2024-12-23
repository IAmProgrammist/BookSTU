from django.db import models
from django_backend.models import (
    Genre, 
    PublishingHouse, 
    Author,
    FileModel
)
from django_backend.validators.book_description import validate_isbn


class BookDescription(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(blank=False, null=False, max_length=40, default="Дефолтное имя")
    isbn = models.TextField(blank=False, null=False,
                            validators=[validate_isbn], db_index=True)
    description = models.TextField(blank=False, null=False, max_length=2048)
    genres = models.ManyToManyField(Genre)
    publishing_house = models.ForeignKey(PublishingHouse, null=False, on_delete=models.PROTECT)
    authors = models.ManyToManyField(Author)
    icon = models.ForeignKey(FileModel, null=True, on_delete=models.SET_NULL)
