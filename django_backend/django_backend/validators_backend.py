from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy

def validate_name(value):
    name = value
    for c in name:
        if((c < 'а' or c > 'я') and (c < 'А' or c > 'Я')):
            raise ValidationError(
            gettext_lazy("Имя должно состоять только из букв русского алфавита"))
        
def validate_surname(value):
    surname = value
    for c in surname:
        if((c < 'а' or c > 'я') and (c < 'А' or c > 'Я')):
            raise ValidationError(
            gettext_lazy("Фамилия должна состоять только из букв русского алфавита"))
        
def validate_patronimycs(value):
    patronimycs = value
    for c in patronimycs:
        if((c < 'а' or c > 'я') and (c < 'А' or c > 'Я')):
            raise ValidationError(
            gettext_lazy("Отчество должно состоять только из букв русского алфавита"))

def validate_phone_number(value):
    phone_number = value
    for c in phone_number:
        if(c < '0' or c > '9'):
            raise ValidationError(
            gettext_lazy("Телефон должен содержать только цифры"))
        
def validate_pasport_series(value):
    pasport_series = value
    for c in pasport_series:
        if(c < '0' or c > '9'):
            raise ValidationError(
            gettext_lazy("Серия паспорта должна содержать только цифры"))
        
def validate_pasport_number(value):
    pasport_number = value
    for c in pasport_number:
        if(c < '0' or c > '9'):
            raise ValidationError(
            gettext_lazy("Номер паспорта должен содержать только цифры"))