# Generated by Django 4.2.17 on 2024-12-18 13:42

from django.db import migrations, models
import django.db.models.deletion
import django_backend.validators.book_description


class Migration(migrations.Migration):

    dependencies = [
        ('django_backend', '0007_alter_author_name_alter_author_patronymics_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookdescription',
            name='icon',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='django_backend.filemodel'),
        ),
        migrations.AddField(
            model_name='bookdescription',
            name='name',
            field=models.TextField(default='Дефолтное имя', max_length=40),
        ),
        migrations.AlterField(
            model_name='author',
            name='icon',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='django_backend.filemodel'),
        ),
        migrations.AlterField(
            model_name='bookdescription',
            name='description',
            field=models.TextField(max_length=2048),
        ),
        migrations.AlterField(
            model_name='bookdescription',
            name='isbn',
            field=models.TextField(validators=[django_backend.validators.book_description.validate_isbn]),
        ),
    ]
