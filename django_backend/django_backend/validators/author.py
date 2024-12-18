from django.core.exceptions import ValidationError
import re

NAME_SURNAME_REGEX = r"^[А-Яа-яA-Za-z-]+$"
PATRONYMICS_REGEX = r"^[А-Яа-яA-Za-z-]*$"

def validate_name(name):
    if not re.match(NAME_SURNAME_REGEX, name):
        raise ValidationError(
        "Имя должно состоять только из букв русского, латинского алфавитов и дефиса"
        )


def validate_surname(surname):
    if not re.match(NAME_SURNAME_REGEX, surname):
        raise ValidationError(
        "Фамилия должна состоять только из букв русского, латинского алфавитов и дефиса"
        )


def validate_patronymics(patronymic):
    if not re.match(PATRONYMICS_REGEX, patronymic):
        raise ValidationError(
        "Отчество должно состоять только из букв русского, латинского алфавитов и дефиса")
