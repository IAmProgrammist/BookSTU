from rest_framework import serializers
from django_backend.models import Author


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('name', 'surname', 'patronymics', 'description', 'icon', 'id')


class AuthorShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('name', 'surname', 'patronymics', 'icon', 'id')
