# Generated by Django 4.2.17 on 2024-12-21 09:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('django_backend', '0008_bookdescription_icon_bookdescription_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('inventory_number', models.CharField(unique=True)),
                ('state', models.CharField(choices=[('0', 'Новая'), ('1', 'Хорошая'), ('2', 'Поношенная'), ('3', 'В ремонте'), ('4', 'Списана')], default='1', max_length=1)),
                ('description', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='books', to='django_backend.bookdescription')),
            ],
        ),
    ]
