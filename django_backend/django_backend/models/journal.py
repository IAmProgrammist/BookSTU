from django.db import models
from django_backend.models import Book, Profile
from django.core.exceptions import ValidationError
from django_backend.validators.journal import validate_returned_date


class Journal(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.ForeignKey(
        Book, null=False, on_delete=models.PROTECT
    )
    begin_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    returned_date = models.DateTimeField(null=True, validators=[validate_returned_date])
    user = models.ForeignKey(
        Profile, null=False, on_delete=models.CASCADE
    )

    def clean(self):
        cleaned_data = super().clean()
        begin_date = cleaned_data.get("begin_date")
        end_date = cleaned_data.get("end_date")
        returned_date = cleaned_data.get("returned_date")
        if end_date < begin_date:
            raise ValidationError("Дата возврата должна быть больше даты выдачи")
        
        if returned_date is not None and returned_date < begin_date:
            raise ValidationError("Дата возврата должна быть больше даты выдачи")
