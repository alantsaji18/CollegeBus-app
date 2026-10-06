from datetime import datetime, timezone as datetime_timezone
from unittest.mock import patch

from django.db import IntegrityError, transaction
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import SeatBooking


class SeatBookingAvailabilityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.booking = {
            'studentRollNo': 'STUDENT-1',
            'studentName': 'First Student',
            'busNumber': 'Bus-101',
            'seatNumber': '1,1',
            'bookingDate': '2026-10-07',
            'tripTime': 'Morning (07:45 AM)',
        }

    def test_same_seat_cannot_be_booked_twice_for_same_bus_and_trip(self):
        first_response = self.client.post('/api/bookings/', self.booking, format='json')
        second_response = self.client.post(
            '/api/bookings/',
            {**self.booking, 'studentRollNo': 'STUDENT-2'},
            format='json',
        )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already booked', second_response.data['seatNumber'][0])
        self.assertEqual(SeatBooking.objects.filter(status='Confirmed').count(), 1)

    def test_same_seat_can_be_booked_for_another_day_or_trip(self):
        SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-07',
            trip_time='Morning (07:45 AM)',
        )

        other_day = self.client.post(
            '/api/bookings/',
            {**self.booking, 'bookingDate': '2026-10-08'},
            format='json',
        )
        other_trip = self.client.post(
            '/api/bookings/',
            {**self.booking, 'tripTime': 'Evening (04:15 PM)'},
            format='json',
        )

        self.assertEqual(other_day.status_code, status.HTTP_201_CREATED)
        self.assertEqual(other_trip.status_code, status.HTTP_201_CREATED)

    def test_database_constraint_rejects_duplicate_active_bookings(self):
        SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-07',
            trip_time='Morning (07:45 AM)',
        )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                SeatBooking.objects.create(
                    student_roll_no='STUDENT-2',
                    bus_number='Bus-101',
                    seat_number='1,1',
                    booking_date='2026-10-07',
                    trip_time='Morning (07:45 AM)',
                )

    def test_availability_endpoint_filters_bookings_by_trip(self):
        SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-07',
            trip_time='Morning (07:45 AM)',
        )
        SeatBooking.objects.create(
            student_roll_no='STUDENT-2',
            bus_number='Bus-101',
            seat_number='1,2',
            booking_date='2026-10-07',
            trip_time='Evening (04:15 PM)',
        )

        response = self.client.get('/api/bookings/', {
            'busNumber': 'Bus-101',
            'date': '2026-10-07',
            'tripTime': 'Morning (07:45 AM)',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([booking['seatNumber'] for booking in response.data], ['1,1'])

    def test_today_morning_booking_is_allowed_through_0730_india_time(self):
        now = datetime(2026, 10, 6, 2, 0, tzinfo=datetime_timezone.utc)
        with patch('api.serializers.timezone.now', return_value=now):
            response = self.client.post(
                '/api/bookings/',
                {**self.booking, 'bookingDate': '2026-10-06'},
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_today_morning_booking_is_rejected_after_0730_india_time(self):
        now = datetime(2026, 10, 6, 2, 1, tzinfo=datetime_timezone.utc)
        with patch('api.serializers.timezone.now', return_value=now):
            response = self.client.post(
                '/api/bookings/',
                {**self.booking, 'bookingDate': '2026-10-06'},
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('closed at 7:30 AM', response.data['tripTime'][0])

    def test_today_evening_booking_is_allowed_through_1530_india_time(self):
        now = datetime(2026, 10, 6, 10, 0, tzinfo=datetime_timezone.utc)
        with patch('api.serializers.timezone.now', return_value=now):
            response = self.client.post(
                '/api/bookings/',
                {
                    **self.booking,
                    'bookingDate': '2026-10-06',
                    'tripTime': 'Evening (04:15 PM)',
                },
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_today_evening_booking_is_rejected_after_1530_india_time(self):
        now = datetime(2026, 10, 6, 10, 1, tzinfo=datetime_timezone.utc)
        with patch('api.serializers.timezone.now', return_value=now):
            response = self.client.post(
                '/api/bookings/',
                {
                    **self.booking,
                    'bookingDate': '2026-10-06',
                    'tripTime': 'Evening (04:15 PM)',
                },
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('closed at 3:30 PM', response.data['tripTime'][0])

    def test_tomorrow_bookings_remain_available_after_today_cutoffs(self):
        now = datetime(2026, 10, 6, 16, 0, tzinfo=datetime_timezone.utc)
        with patch('api.serializers.timezone.now', return_value=now):
            response = self.client.post(
                '/api/bookings/',
                {**self.booking, 'bookingDate': '2026-10-07'},
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cancellation_is_allowed_through_morning_cutoff(self):
        booking = SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-06',
            trip_time='Morning (07:45 AM)',
        )

        now = datetime(2026, 10, 6, 1, 59, tzinfo=datetime_timezone.utc)
        with patch('api.views.timezone.now', return_value=now):
            cancel_response = self.client.delete(f"/api/bookings/{booking.pk}/")

        self.assertEqual(cancel_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SeatBooking.objects.filter(pk=booking.pk).exists())

    def test_cancellation_is_rejected_after_morning_cutoff(self):
        booking = SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-06',
            trip_time='Morning (07:45 AM)',
        )

        now = datetime(2026, 10, 6, 2, 31, tzinfo=datetime_timezone.utc)
        with patch('api.views.timezone.now', return_value=now):
            cancel_response = self.client.delete(f"/api/bookings/{booking.pk}/")

        self.assertEqual(cancel_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('closed at 7:30 AM', cancel_response.data['detail'])
        self.assertTrue(SeatBooking.objects.filter(pk=booking.pk).exists())

    def test_cancellation_is_rejected_after_evening_cutoff(self):
        booking = SeatBooking.objects.create(
            student_roll_no='STUDENT-1',
            bus_number='Bus-101',
            seat_number='1,1',
            booking_date='2026-10-06',
            trip_time='Evening (04:15 PM)',
        )

        now = datetime(2026, 10, 6, 10, 31, tzinfo=datetime_timezone.utc)
        with patch('api.views.timezone.now', return_value=now):
            cancel_response = self.client.delete(f"/api/bookings/{booking.pk}/")

        self.assertEqual(cancel_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('closed at 3:30 PM', cancel_response.data['detail'])
        self.assertTrue(SeatBooking.objects.filter(pk=booking.pk).exists())
