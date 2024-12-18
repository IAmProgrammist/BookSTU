from django import forms
from django_backend.models import FileModel


class FileForm(forms.ModelForm):
    file = forms.FileField()

    class Meta:
        model = FileModel
        fields = ('file',)