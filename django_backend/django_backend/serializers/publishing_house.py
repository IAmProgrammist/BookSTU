from rest_framework import serializers
from django_backend.models import PublishingHouse


class PublishingHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublishingHouse
        fields = ('name', 'description', 'id')


class PublishingHouseShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublishingHouse
        fields = ('name', 'id')
