from django.core.exceptions import ValidationError

def validate_file(file):
    if file._size > 5 * 1025 * 1024:
        raise ValidationError(
        "Размер файла не должен превышать 5 мегабайт"
        )