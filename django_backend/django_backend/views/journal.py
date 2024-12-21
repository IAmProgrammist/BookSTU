from django_backend.models import Journal
from django_backend.serializers import JournalSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from rest_framework.filters import OrderingFilter
from django_backend.permissions import JournalPermission
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404


class JournalModelViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
    pagination_class = CustomPagination
    filter_backends = (
        filters.DjangoFilterBackend,
        OrderingFilter,
    )
    permission_classes = (JournalPermission,)
    ordering_fields = "begin_date"

    def perform_create(self, serializer):
        # Здесь проверим, что последняя запись либо отсутствует и не null
        null_last_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.data["book"])
            .filter(returned_date__is_null=True)
        )[0]

        if null_last_journal_record is not None:
            raise ValidationError("Книгу ещё не вернули")

        # Теперь проверим, чтобы дата начала была больше
        # чем дата возврата
        last_journal = (
            Journal.objects.all()
            .filter(book=serializer.data["book"])
            .order_by("-id")
        )[0]

        if last_journal is not None:
            if last_journal.returned_date > serializer.data["begin_date"]:
                raise ValidationError(
                    "Нельзя взять книгу раньше, чем её вернули"
                )

        serializer.save()

    # Здесь проверим, чтобы обновлённые даты соответствовали соседним записям
    def perform_update(self, serializer):
        current_object = get_object_or_404(Journal, pk=serializer.data["id"])

        left_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.data["book"])
            .filter(id__lt=current_object.id)
            .order_by("-id")
        )[0]

        right_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.data["book"])
            .filter(id__gt=current_object.id)
            .order_by("id")
        )

        if left_journal_record is None and right_journal_record is None:
            # Единственная запись
            serializer.save()
        elif left_journal_record is not None and right_journal_record is None:
            # Последняя запись
            # Сохраняем если дата начала больше дата возврата предыдущей книги
            # и дата возврата не установлена или больше дата возврата предыдущей книги
            if left_journal_record.returned_date > serializer.data[
                "begin_date"
            ] and (
                serializer.data["returned_date"] is None
                or left_journal_record.returned_date
                < serializer.data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError(
                    "Дата возврата и дата выдачи книги должны быть"
                    "больше даты даты возврата предыдущей книги"
                )
        elif left_journal_record is None and right_journal_record is not None:
            # Первая запись
            if serializer.data["returned_date"] is None:
                raise ValidationError(
                    "Книга не может быть не возвращена - "
                    "её уже брали читатели в будущем"
                )

            if (
                right_journal_record.begin_date
                > serializer.data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError(
                    "Дата возврата и дата выдачи книги должны быть"
                    "меньше даты даты взятия следующей книги"
                )
        else:
            # Книга находится посередине
            if serializer.data["returned_date"] is None:
                raise ValidationError(
                    "Книга не может быть не возвращена - "
                    "её уже брали читатели в будущем"
                )
            if (
                left_journal_record.returned_date
                < serializer.data["begin_date"]
                and right_journal_record.begin_date
                > serializer.data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError(
                    "Дата возврата и дата выдачи книги должны быть "
                    "больше даты даты возврата предыдущей книги, но меньше "
                    "даты взятия книги следующей книги"
                )
