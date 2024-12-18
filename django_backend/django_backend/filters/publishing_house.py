from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import PublishingHouse

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass

class PublishingHouseFilter(filters.FilterSet):
    id = NumberInFilter(field_name="id", lookup_expr="in")
    q = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = PublishingHouse
        fields = []

