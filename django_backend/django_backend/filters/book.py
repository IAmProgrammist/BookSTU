from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import Book
from django_backend.filters.base import TextInFilter, NumberInFilter


class BookFilter(filters.FilterSet):
    id = NumberInFilter(field_name="id", lookup_expr="in")
    q = filters.CharFilter(field_name="inventory_number", lookup_expr="contains")
    state = TextInFilter(field_name="state", lookup_expr="in")
    description = filters.NumberFilter(field_name="description__id", lookup_expr="exact")

    class Meta:
        model = Book
        fields = []
