from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import Journal
from django_backend.filters.base import NumberInFilter


class JournalFilter(filters.FilterSet):
    book = NumberInFilter(field_name="book__id", lookup_expr="in")
    user = NumberInFilter(field_name="user__id", lookup_expr="in")

    class Meta:
        model = Journal
        fields = []
