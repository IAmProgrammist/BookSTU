"""
from django.urls import re_path as url

from django_backend.models import Genre
from rest_framework.decorators import api_view
from django_backend.serializers.genre import GenreSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from django.urls import path
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination


@api_view(['POST'])
def add_genre(request):
    item = GenreSerializer(data=request.data)

    if item.is_valid():
        item.save()
        return Response(item.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_genres(request):
    if request.query_params:
        items = Genre.objects.filter(**request.query_params.dict())
    else:
        items = Genre.objects.all()

    serializer = GenreSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def view_genre(request, id):
    item = get_object_or_404(Genre, id=id)

    serializer = GenreSerializer(instance=item)
    return Response(serializer.data)


@api_view(['POST'])
def update_genres(request, id):
    item = Genre.objects.get(id=id)
    data = GenreSerializer(instance=item, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_genres(request, id):
    item = get_object_or_404(Genre, id=id)
    item.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


urlpatterns = [
    url(r'^api/genres/create/', add_genre, name='add_genre'),
    url(r'api/genres/resources/', view_genres, name='view_genres'),
    path('api/genres/update/<int:id>/', update_genres, name='update_genres'),
    path('api/genres/delete/<int:id>/', delete_genres, name='delete_genres'),
    path('api/genres/resource/<int:id>/', view_genre, name='view_genre'),
]
"""

from django_backend.models import Genre
from django_backend.serializers import GenreSerializer, GenreShortSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from django_backend.pagintaion import CustomPagination
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_backend.filters import GenreFilter


class GenreModelViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    pagination_class = CustomPagination
    filterset_class = GenreFilter
    filter_backends = (filters.DjangoFilterBackend,)

    @action(detail=False, methods=["get"])
    def list_short(self, request):
        genres = self.get_queryset()
        serializer = GenreShortSerializer(genres, many=True)
        return Response(serializer.data)
