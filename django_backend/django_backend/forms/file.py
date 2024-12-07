from django import forms
from django_backend.models.file import FileModel


class FileForm(forms.ModelForm):
    
    class Meta:
        model = FileModel
        fields = ('file')