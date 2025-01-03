from django_backend.models import PublishingHouse
from django_backend.serializers import PublishingHouseSerializer, PublishingHouseShortSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import PublishingHouseFilter
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, mixins
from django_backend.permissions import PublishingHousePermission


class PublishingHouseModelViewSet(viewsets.ModelViewSet):
    queryset = PublishingHouse.objects.all()
    serializer_class = PublishingHouseSerializer
    pagination_class = CustomPagination
    filterset_class = PublishingHouseFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (PublishingHousePermission,)
    ordering_fields = ('id', 'name')


class PublishingHouseShortModelViewSet(mixins.RetrieveModelMixin,
                                       mixins.ListModelMixin,
                                       viewsets.GenericViewSet):
    queryset = PublishingHouse.objects.all()
    serializer_class = PublishingHouseShortSerializer
    pagination_class = CustomPagination
    filterset_class = PublishingHouseFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (PublishingHousePermission,)
    ordering_fields = ('id', 'name')
