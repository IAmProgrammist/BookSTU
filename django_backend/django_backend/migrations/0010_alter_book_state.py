# Generated by Django 4.2.17 on 2024-12-21 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_backend', '0009_book'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='state',
            field=models.CharField(choices=[('0', 'Новая'), ('1', 'Хорошая'), ('2', 'Поношенная'), ('3', 'В ремонте'), ('4', 'Списана'), ('5', 'Утеряна')], default='1', max_length=1),
        ),
    ]
