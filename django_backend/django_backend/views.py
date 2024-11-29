from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse
from . import forms_user

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        form = forms_user.SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return HttpResponse("<h4>Valid sucsess</h4>")
            return redirect('home')
        else:
           print (form.errors)
           return HttpResponse("<h4>Valid failed</h4>")
    else:
        return HttpResponse("<h4>Test123</h4>")