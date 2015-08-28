# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appuser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(default='test', max_length=20)),
                ('Dob', models.DateField()),
                ('Address', models.CharField(max_length=50)),
                ('Description', models.TextField(blank=True, null=True)),
                ('Created_at', models.DateField()),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
