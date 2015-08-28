# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0004_auto_20150828_2357'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='Name',
            field=models.CharField(default='test', max_length=20),
        ),
    ]
