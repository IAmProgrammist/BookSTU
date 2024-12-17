from django.core.exceptions import ValidationError

def validate_file(file):
    if file.size > 5 * 8 * 1024 * 1024:
        raise ValidationError(
            "Размер файла не должен превышать 5 мегабайт"
        )