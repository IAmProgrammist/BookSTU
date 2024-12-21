from rest_framework import serializers
from django_backend.models import Journal


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = (
            'id',
            'book',
            'begin_date',
            'end_date',
            'user',
            )
