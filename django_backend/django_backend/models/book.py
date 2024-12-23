from django.db import models
from django_backend.models import (
    BookDescription
)


class Book(models.Model):
    class BookState(models.TextChoices):
        NEW = "0", "Новая"
        GOOD = "1", "Хорошая"
        WORN = "2", "Поношенная"
        UNDER_REPAIR = "3", "В ремонте"
        WRITTEN_OFF = "4", "Списана"
        LOST = "5", "Утеряна"

    id = models.AutoField(primary_key=True)
    inventory_number = models.CharField(unique=True, blank=False, null=False, db_index=True)
    description = models.ForeignKey(
        BookDescription,
        null=False,
        on_delete=models.PROTECT,
        related_name="books"
    )
    state = models.CharField(
        max_length=1,
        choices=BookState.choices,
        default=BookState.GOOD, 
        db_index=True
    )
