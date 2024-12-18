from rest_framework import serializers
from django_backend.models import Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('name', 'description', 'id')


class GenreShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('name', 'id')
