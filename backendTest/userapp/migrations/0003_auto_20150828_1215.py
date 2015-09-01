# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0002_auto_20150828_1207'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='Dob',
            field=models.DateField(),
        ),
    ]
