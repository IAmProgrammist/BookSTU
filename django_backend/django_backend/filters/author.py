from rest_framework import generics
from django_filters import rest_framework as filters
from django_backend.models import Author
from django.db.models import Q

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass

class AuthorFilter(filters.FilterSet):
    id = NumberInFilter(field_name="id", lookup_expr="in")
    q = filters.CharFilter(method='q_author_custom_filter')

    def q_author_custom_filter(self, queryset, name, value):
        return queryset.filter(
            Q(surname__icontains=value) |
            Q(name__icontains=value) |
            Q(patronymics__icontains=value)
        )

    class Meta:
        model = Author
        fields = []
