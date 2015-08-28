# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='Address',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='Created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='Description',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='Dob',
            field=models.DateTimeField(),
        ),
    ]
