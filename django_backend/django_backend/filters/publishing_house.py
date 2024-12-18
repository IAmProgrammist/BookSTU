from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import PublishingHouse
from django_backend.filters.base import NumberInFilter


class PublishingHouseFilter(filters.FilterSet):
    id = NumberInFilter(field_name="id", lookup_expr="in")
    q = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = PublishingHouse
        fields = []
