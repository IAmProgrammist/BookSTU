from django.http import JsonResponse, HttpResponse
from django_backend.forms.file import FileForm
from django.urls import re_path as url
from django.urls import path
import json

from django.views.decorators.http import require_http_methods

from django_backend.models import FileModel


@require_http_methods(["POST"])
def upload_file(request):
    form = FileForm(request.POST, request.FILES)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    saved_file = form.save()

    return JsonResponse({"id": saved_file.id}, status=200)


@require_http_methods(["GET"])
def display_file(request, file_id=None):
    if not request.user.is_authenticated:
        return JsonResponse({'is_authenticated': False}, status=401)

    file_return = FileModel.objects.get(id=file_id)

    if not file_return:
        return JsonResponse({"message": "Unable to find file with such id"}, status=400)

    try:
        with file_return.file.open() as f:
           file_data = f.read()

        # sending response 
        response = HttpResponse(file_data, content_type=file_return.content_type)

    except IOError:
        # handle file not exist case here
        response = JsonResponse({"message": "Unable to find file with such id"}, status=400)

    return response


urlpatterns = [
    path('api/files/<int:file_id>/', display_file, name='display_file'),
    url(r'^api/files/$', upload_file, name='upload_file'),
]
