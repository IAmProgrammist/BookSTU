from django.http import JsonResponse
from django_backend.forms.file import FileForm
from django.urls import re_path as url
from django.urls import path
import json

from django.views.decorators.http import require_http_methods

from django_backend.models.file import FileModel
from django.shortcuts import render


@require_http_methods(["POST"])
def upload_file(request):
    form = FileForm(request.POST, request.FILES)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    form.save()

    return JsonResponse({}, status=200)


@require_http_methods(["GET"])
def display_file(request, file_ID):
    if not request.user.is_authenticated:
        return JsonResponse({'is_authenticated': False}, status=400)

    file_return = FileModel.objects.get(id = file_ID)

    if not file_return:
        return JsonResponse({"message": "Unable to find file with such id"}, status=400)

    return file_return

urlpatterns = [
    url(r'^api/files/', upload_file, name='upload file'),
    path('api/products/<int:file_ID>/', display_file, name='display_file'),
]