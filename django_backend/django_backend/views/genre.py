from django_backend.models import Genre
from django_backend.serializers import GenreSerializer, GenreShortSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from django_backend.pagintaion import CustomPagination
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_backend.filters import GenreFilter
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, mixins


class GenreModelViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    pagination_class = CustomPagination
    filterset_class = GenreFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    ordering_fields = ('id', 'name')


class GenreShortModelViewSet(mixins.RetrieveModelMixin,
                             mixins.ListModelMixin,
                             viewsets.GenericViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreShortSerializer
    pagination_class = CustomPagination
    filterset_class = GenreFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    ordering_fields = ('id', 'name')
