from rest_framework import serializers
from django_backend.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'id',
            'username',
            'phone_number',
            'surname',
            'name',
            'patronymics',
            'passport_data',
            'banned',
            )
        depth = 1
