from django_filters import rest_framework as filters


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class TextInFilter(filters.BaseInFilter, filters.CharFilter):
    pass
