from rest_framework import serializers
from django_backend.models import BookDescription


class BookDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDescription
        fields = (
            'id',
            'name',
            'isbn',
            'description',
            'genres',
            'publishing_house',
            'authors',
            'icon',
            )


class BookDescriptionShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDescription
        fields = (
            'id',
            'name',
            'isbn',
            'genres',
            'publishing_house',
            'authors',
            'icon',
            )
