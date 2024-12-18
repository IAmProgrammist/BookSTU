from django_backend.models import BookDescription
from django_backend.serializers import BookDescriptionSerializer, BookDescriptionShortSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import BookDescriptionFilter
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, mixins


class BookDescriptionModelViewSet(viewsets.ModelViewSet):
    queryset = BookDescription.objects.all()
    serializer_class = BookDescriptionSerializer
    pagination_class = CustomPagination
    filterset_class = BookDescriptionFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    ordering_fields = ('id',
                       'name',
                       'isbn',
                       'publishing_house__name')


class BookDescriptionShortModelViewSet(mixins.RetrieveModelMixin,
                                       mixins.ListModelMixin,
                                       viewsets.GenericViewSet):
    queryset = BookDescription.objects.all()
    serializer_class = BookDescriptionShortSerializer
    pagination_class = CustomPagination
    filterset_class = BookDescriptionFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    ordering_fields = ('id',
                       'name',
                       'isbn',
                       'publishing_house__name')
