from django_backend.models import Journal
from django_backend.serializers import JournalSerializer
from rest_framework import viewsets
from django_backend.pagintaion import CustomPagination
from django_filters import rest_framework as filters
from django_backend.filters import JournalFilter
from rest_framework.filters import OrderingFilter
from django_backend.permissions import JournalPermission
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework import status
from rest_framework.decorators import action
from django.http import HttpResponse
import csv


class JournalModelViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
    pagination_class = CustomPagination
    filterset_class = JournalFilter
    filter_backends = (
        filters.DjangoFilterBackend,
        OrderingFilter,
    )
    permission_classes = (JournalPermission,)
    ordering_fields = ["begin_date"]

    @action(detail=False, methods=['get'])
    def export(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="journal.csv"'

        writer = csv.writer(response)
        writer.writerow(['Дата начала', 'Дата возврата', 'Возвращено',
                         'Инвентарный номер', 'Состояние книги', 'ISBN',
                         'Имя книги', 'Фамилия читателя', 'Имя читателя',
                         'Отчество читателя'])  # Replace with your model fields

        # Фильтруем и упорядочиваем
        queryset = self.filter_queryset(self.get_queryset())

        # Дополнительно фильтруем queryset так чтобы если у нас не было разрешения,
        # то мы могли бы просматривать только свои записи в журнале
        if not (request.user.is_superuser or request.user.has_perm("django_backend.view_journal")):
            queryset = queryset.filter(user__user=request.user)

        for journal in queryset.select_related("book").select_related("user"):
            writer.writerow([journal.begin_date, journal.end_date, journal.returned_date,
                             journal.book.inventory_number, journal.book.state, journal.book.description.isbn, 
                             journal.book.description.name, journal.user.surname, journal.user.name, journal.user.patronymics])

        return response


    def list(self, request, *args, **kwargs):
        # Филтруем и упорядочиваем
        queryset = self.filter_queryset(self.get_queryset())

        # Дополнительно фильтруем queryset так чтобы если у нас не было разрешения,
        # то мы могли бы просматривать только свои записи в журнале
        if request.method == "GET" and request.path == "/api/journals/" and not (
            request.user.is_superuser or request.user.has_perm("django_backend.view_journal")
        ):
            queryset = queryset.filter(user__user=request.user)

        # Продолжаем обычную логику запроса
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def perform_create(self, serializer):
        # Здесь проверим, что последняя запись либо отсутствует и не null

        null_last_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.validated_data["book"])
            .filter(returned_date__isnull=True)
        ).first()

        if null_last_journal_record is not None:
            raise ValidationError({'message': 'Книгу ещё не вернули'}, code=status.HTTP_400_BAD_REQUEST)

        # Теперь проверим, чтобы дата начала была больше
        # чем дата возврата
        last_journal = (
            Journal.objects.all()
            .filter(book=serializer.validated_data["book"])
            .order_by("-id")
        ).first()

        if last_journal is not None:
            if last_journal.returned_date > serializer.validated_data["begin_date"]:
                raise ValidationError({'message': 'Нельзя взять книгу раньше, чем её вернули'}, code=status.HTTP_400_BAD_REQUEST)

        serializer.save()

    # Здесь проверим, чтобы обновлённые даты соответствовали соседним записям
    def perform_update(self, serializer):
        current_object = self.get_object()

        left_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.validated_data["book"])
            .filter(id__lt=current_object.id)
            .order_by("-id")
        ).first()

        right_journal_record = (
            Journal.objects.all()
            .filter(book=serializer.validated_data["book"])
            .filter(id__gt=current_object.id)
            .order_by("id")
        ).first()

        if left_journal_record is None and right_journal_record is None:
            # Единственная запись
            serializer.save()
        elif left_journal_record is not None and right_journal_record is None:
            # Последняя запись
            # Сохраняем если дата начала больше дата возврата предыдущей книги
            # и дата возврата не установлена или больше дата возврата предыдущей книги
            if left_journal_record.returned_date < serializer.validated_data[
                "begin_date"
            ] and (
                serializer.validated_data["returned_date"] is None
                or left_journal_record.returned_date
                < serializer.validated_data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError({"message": "Дата возврата и дата выдачи книги должны быть больше даты даты возврата предыдущей книги"}, 
                                      code=status.HTTP_400_BAD_REQUEST
                )
        elif left_journal_record is None and right_journal_record is not None:
            # Первая запись
            if serializer.validated_data["returned_date"] is None:
                raise ValidationError({"message": "Книга не может быть не возвращена - её уже брали читатели в будущем"}, 
                                      code=status.HTTP_400_BAD_REQUEST
                )

            if (
                right_journal_record.begin_date
                > serializer.validated_data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError({"message": "Дата возврата и дата выдачи книги должны быть меньше даты даты взятия следующей книги"}, 
                                      code=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Книга находится посередине
            if serializer.validated_data["returned_date"] is None:
                raise ValidationError({"message": "Книга не может быть не возвращена - её уже брали читатели в будущем"}, 
                                      code=status.HTTP_400_BAD_REQUEST
                )
            if (
                left_journal_record.returned_date
                < serializer.validated_data["begin_date"]
                and right_journal_record.begin_date
                > serializer.validated_data["returned_date"]
            ):
                serializer.save()
            else:
                raise ValidationError({"message": "Дата возврата и дата выдачи книги должны быть больше даты даты возврата предыдущей книги, но меньше даты взятия книги следующей книги"}, 
                                      code=status.HTTP_400_BAD_REQUEST
                )
