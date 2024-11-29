from django import forms
from django.contrib.auth.forms import UserCreationForm
from django_backend.validators.user import validate_name, validate_passport_data, validate_patronymics, validate_surname, validate_phone_number
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    name = forms.CharField(max_length=40, validators=[validate_name])
    surname = forms.CharField(max_length=40, validators=[validate_surname])
    patronymics = forms.CharField(max_length=40, validators=[validate_patronymics])
    email = forms.EmailField(max_length=64)
    phone_number = forms.CharField(max_length=10, min_length=10, validators=[validate_phone_number])
    passport_data = forms.CharField(validators=[validate_passport_data])

    class Meta:
        model = User
        fields = ('name', 'surname', 'patronymics',
                  'email', 'phone_number', 'password1',
                  'password2', 'passport_data' )
