from django.core.exceptions import ValidationError
import re

ISBN_REGEX = r"^\d{13}$"


def validate_isbn(value):
    if not re.match(ISBN_REGEX, value):
        raise ValidationError(
        "Имя должно состоять только из букв русского, латинского алфавитов и дефиса"
        )