# Generated by Django 3.2.1 on 2022-05-14 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient_app', '0002_auto_20220509_1511'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientscore',
            name='update_date',
        ),
        migrations.AlterField(
            model_name='patient',
            name='note',
            field=models.TextField(default='', max_length=500),
        ),
    ]
