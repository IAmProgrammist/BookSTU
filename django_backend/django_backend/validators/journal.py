from django.core.exceptions import ValidationError
from datetime import datetime


def validate_returned_date(date):
    now = datetime.now()

    if now < date:
        raise ValidationError("Пользователь не может вернуть книгу в будущем")
