from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import Journal


class JournalFilter(filters.FilterSet):
    book = filters.NumberFilter(field_name="book__id", lookup_expr="exact")
    user = filters.NumberFilter(field_name="user__id", lookup_expr="exact")

    class Meta:
        model = Journal
        fields = []
