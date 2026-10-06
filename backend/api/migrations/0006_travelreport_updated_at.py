from django.db import migrations, models
from django.db.models import F
import django.utils.timezone


def initialize_updated_at(apps, schema_editor):
    TravelReport = apps.get_model('api', 'TravelReport')
    TravelReport.objects.update(updated_at=F('created_at'))


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_unique_confirmed_seat_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='travelreport',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.RunPython(initialize_updated_at, migrations.RunPython.noop),
    ]
