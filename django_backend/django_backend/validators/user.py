from django.core.exceptions import ValidationError
import re

PASSPORT_DATA_REGEX = r"^\d{10}$"
NAME_SURNAME_REGEX = r"^[А-Яа-яA-Za-z-]+$"
PATRONYMICS_REGEX = r"^[А-Яа-яA-Za-z-]*$"
PHONE_REGEX = r"^\d{10}$"


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


def validate_passport_data(passport_data):
    if not re.match(PASSPORT_DATA_REGEX, passport_data):
        raise ValidationError(
        "Паспортные данные должны содержать 10 цифр: серию и номер")


def validate_phone_number(phone_nubmer):
    if not re.match(PHONE_REGEX, phone_nubmer):
        raise ValidationError(
        "Номер телефона должен содержать 10 цифр")
