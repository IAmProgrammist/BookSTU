from django_backend.models import Book
from django_backend.serializers import BookSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import BookFilter
from rest_framework.filters import OrderingFilter
from django_backend.permissions import BookPermission


class BookModelViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = CustomPagination
    filterset_class = BookFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (BookPermission,)
    ordering_fields = ('inventory_number', 'state')
