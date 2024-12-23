from rest_framework import serializers
from django_backend.models import Book


class BookSerializer(serializers.ModelSerializer):
    state = serializers.ChoiceField(choices=Book.BookState)

    class Meta:
        model = Book
        fields = (
            'id',
            'inventory_number',
            'description',
            'state',
            )
