# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0003_auto_20150828_1215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='Address',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='Description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='Name',
            field=models.CharField(blank=True, default='test', max_length=20),
        ),
    ]
