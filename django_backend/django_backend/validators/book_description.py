from django.core.exceptions import ValidationError
import re

ISBN_REGEX = r"^\d{13}$"


def validate_isbn(value):
    if not re.match(ISBN_REGEX, value):
        raise ValidationError(
        "ISBN должен содержать 13 цифр"
        )