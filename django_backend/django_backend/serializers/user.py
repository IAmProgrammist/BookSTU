from rest_framework import serializers
from django_backend.models import Profile
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id',)


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = (
            'id',
            'phone_number',
            'surname',
            'name',
            'patronymics',
            'passport_data',
            'banned',
            'user',
            )
        depth = 1
