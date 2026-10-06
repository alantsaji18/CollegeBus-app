from django.db import migrations, models
from django.db.models import Count, Q


def cancel_duplicate_bookings(apps, schema_editor):
    SeatBooking = apps.get_model('api', 'SeatBooking')
    duplicate_keys = (
        SeatBooking.objects.filter(status='Confirmed')
        .values('bus_number', 'seat_number', 'booking_date', 'trip_time')
        .annotate(booking_count=Count('id'))
        .filter(booking_count__gt=1)
    )

    for key in duplicate_keys.iterator():
        bookings = SeatBooking.objects.filter(
            bus_number=key['bus_number'],
            seat_number=key['seat_number'],
            booking_date=key['booking_date'],
            trip_time=key['trip_time'],
            status='Confirmed',
        ).order_by('created_at', 'pk')
        keep_id = bookings.values_list('pk', flat=True).first()
        bookings.exclude(pk=keep_id).update(status='Cancelled')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_dailylogincount'),
    ]

    operations = [
        migrations.RunPython(cancel_duplicate_bookings, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name='seatbooking',
            constraint=models.UniqueConstraint(
                fields=('bus_number', 'seat_number', 'booking_date', 'trip_time'),
                condition=Q(status='Confirmed'),
                name='uniq_booking_bus_seat_day_trip',
            ),
        ),
    ]
