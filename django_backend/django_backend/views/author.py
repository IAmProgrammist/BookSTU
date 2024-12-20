from django_backend.models import Author
from django_backend.serializers import AuthorSerializer, AuthorShortSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import AuthorFilter
from rest_framework.filters import OrderingFilter
from django_backend.permissions import AuthorPermission


class AuthorModelViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    pagination_class = CustomPagination
    filterset_class = AuthorFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (AuthorPermission,)
    ordering_fields = ('id', 'surname')


class AuthorShortModelViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorShortSerializer
    pagination_class = CustomPagination
    filterset_class = AuthorFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (AuthorPermission,)
    ordering_fields = ('id', 'surname')
