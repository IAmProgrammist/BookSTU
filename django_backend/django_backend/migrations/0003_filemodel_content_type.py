# Generated by Django 4.0.4 on 2024-12-17 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_backend', '0002_filemodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='filemodel',
            name='content_type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
