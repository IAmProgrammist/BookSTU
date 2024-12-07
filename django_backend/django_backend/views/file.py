from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from django_backend.forms.file import FileForm
from django.urls import re_path as url
from django.contrib.auth.models import User
import json

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from django_backend.models.file import FileModel


@require_http_methods(["POST"])
def upload_file(request):
    form = FileForm(request.POST, request.FILES)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    form.save()

    return JsonResponse({}, status=200)

# @require_http_methods(["GET"])
# def display_file(request):

    



urlpatterns = [
     url(r'^api/file/', upload_file, name='upload file'),
]