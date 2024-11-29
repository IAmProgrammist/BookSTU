from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from . import validators_backend


class SignUpForm(UserCreationForm):
    name = forms.CharField(max_length=40, validators=[validators_backend.validate_name])
    surname = forms.CharField(max_length=40, validators=[validators_backend.validate_surname])
    patronimycs = forms.CharField(max_length=40, required=False, validators=[validators_backend.validate_patronimycs])
    email = forms.EmailField(max_length=64)
    phone_number = forms.CharField(max_length=10, min_length=10, validators=[validators_backend.validate_phone_number])
    pasport_series = forms.CharField(max_length=4, min_length=4, validators=[validators_backend.validate_pasport_series])
    pasport_number = forms.CharField(max_length=6, min_length=6, validators=[validators_backend.validate_pasport_number])

    class Meta:
        model = User
        fields = ('name', 'surname', 'patronimycs', 'email', 'phone_number', 'password1', 'password2', )