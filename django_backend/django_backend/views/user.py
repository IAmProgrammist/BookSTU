from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from django_backend.forms.user import SignUpForm
from django.urls import re_path as url
from django.contrib.auth.models import User
import json

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from django_backend.models.user import Profile

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    form = SignUpForm(request.POST)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    email = form.cleaned_data.get('email')
    raw_password = form.cleaned_data.get('password1')

    user = User(username=email, 
                password=raw_password)
    user.save()

    authenticate(username=email, password=raw_password)
    login(request, user)

    user_profile = Profile(
        user=user,
        phone_number=form.cleaned_data.get('phone_number'),
        surname=form.cleaned_data.get('surname'),
        name=form.cleaned_data.get('name'),
        patronymics=form.cleaned_data.get('patronymics'),
        passport_data=form.cleaned_data.get('passport_data')
    )
    user_profile.save()

    return JsonResponse({}, status=200)


urlpatterns = [
    url(r'^api/signup/$', signup, name='signup'),
]
