from rest_framework import serializers
from django_backend.models import BookDescription, Genre, Author


class BookDescriptionSerializer(serializers.ModelSerializer):
    genres = serializers.PrimaryKeyRelatedField(many=True, queryset=Genre.objects.all())
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())

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
    genres = serializers.PrimaryKeyRelatedField(many=True, queryset=Genre.objects.all())
    authors = serializers.PrimaryKeyRelatedField(many=True, queryset=Author.objects.all())

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
