from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import Profile
from django_backend.filters.base import NumberInFilter
from django.db.models import Q


class ProfileFilter(filters.FilterSet):
    id = NumberInFilter(field_name="user__id", lookup_expr="in")
    q = filters.CharFilter(method='q_profile_custom_filter')
    banned = filters.BooleanFilter(field_name="banned", lookup_expr="exact")

    def q_profile_custom_filter(self, queryset, name, value):
        return queryset.filter(
            Q(surname__icontains=value) |
            Q(name__icontains=value) |
            Q(patronymics__icontains=value)
        )

    class Meta:
        model = Profile
        fields = []
