from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import BookDescription
from django_backend.filters.base import NumberInFilter


class BookDescriptionFilter(filters.FilterSet):
    id = NumberInFilter(field_name="id", lookup_expr="in")
    q = filters.CharFilter(field_name="name", lookup_expr="icontains")
    isbn = filters.CharFilter(field_name="isbn", lookup_expr="icontains")
    genres = NumberInFilter(field_name="genres__id", lookup_expr="in")
    publishing_house = NumberInFilter(field_name="publishing_house__id", lookup_expr="in")
    authors = NumberInFilter(field_name="authors__id", lookup_expr="in")

    class Meta:
        model = BookDescription
        fields = []
