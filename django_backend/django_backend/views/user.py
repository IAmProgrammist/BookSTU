from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from django_backend.forms.user import SignUpForm, LoginForm
from django.urls import re_path as url
from django.contrib.auth.models import User, Group
import json

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token

from django_backend.models import Profile

from django_backend.serializers import ProfileSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import ProfileFilter
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, mixins
from django_backend.permissions import ProfilePermission
from rest_framework.decorators import action


@require_http_methods(["POST"])
def user_signup(request):
    form = SignUpForm(request.POST)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    email = form.cleaned_data.get('email')
    raw_password = form.cleaned_data.get('password1')

    user = User.objects.create_user(username=email,
                                    password=raw_password)

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

    # Дефолтная группа читателя, нужна чтобы вручную не проставлять всем юзерам права вручную
    reader, created = Group.objects.get_or_create(name='reader')
    reader.user_set.add(user)

    return JsonResponse({}, status=200)


@require_http_methods(["POST"])
def user_login(request):
    form = LoginForm(request.POST)
    if not form.is_valid():
        return JsonResponse(json.loads(form.errors.as_json()), status=400)

    raw_login = form.cleaned_data.get('login')
    raw_password = form.cleaned_data.get('password')

    single_profile = Profile.objects.filter(phone_number=raw_login).first()

    if not single_profile:
        single_user = User.objects.filter(username=raw_login).first()

        if not single_user:
            return JsonResponse({"message": "User doesn't exists"}, status=400)

        raw_email = single_user.username
    else:
        raw_email = single_profile.user.username

    user = authenticate(request=request, username=raw_email, password=raw_password)

    if user:
        login(request, user)
        return JsonResponse({}, status=200)

    return JsonResponse({"message": "User doesn't exists"}, status=400) 


def csrf_ensure(request):
    token = get_token(request)
    return JsonResponse({"csrf": token}, status=200)


def user_logout(request):
    logout(request)
    return JsonResponse({})


class ProfileModelViewSet(mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin,
                          mixins.ListModelMixin,
                          viewsets.GenericViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    pagination_class = CustomPagination
    filterset_class = ProfileFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter,)
    permission_classes = (ProfilePermission,)
    ordering_fields = ('surname', 'banned', 'user__username')

    @action(detail=False, methods=['GET'])
    def me(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'is_authenticated': False})

        this_profile = Profile.objects.get(user=request.user)
        if not this_profile:
            return JsonResponse({"message": "Unable to find profile"}, status=400)

        permissions = request.user.get_all_permissions()

        return JsonResponse({
            'is_authenticated': True,
            'username': this_profile.name,
            'surname': this_profile.surname,
            'patronymics': this_profile.patronymics,
            'passport_data': this_profile.passport_data,
            'phone_number': this_profile.phone_number,
            'banned': this_profile.banned,
            'user_id': this_profile.id,
            'email': request.user.username,
            'permissions': [str(permission) for permission in permissions]
        }, status=200)


urlpatterns = [
    url(r'^api/signup/$', user_signup, name='signup'),
    url(r'^api/login/$', user_login, name='login'),
    url(r'^api/logout/$', user_logout, name='logout'),
    url(r'^api/csrf/$', csrf_ensure, name='csrf_ensure'),
]
