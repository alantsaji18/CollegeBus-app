from datetime import timedelta
from zoneinfo import ZoneInfo

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from api.models import TravelReport


class TravelReportDateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.today = timezone.localdate(timezone=ZoneInfo('Asia/Kolkata'))
        self.payload = {
            'busNumber': 'Bus-102',
            'route': 'Campus → Thrissur',
            'driver': 'Test Driver',
            'arrivalTime': '07:45 AM',
            'departureTime': '03:45 PM',
            'status': 'On Time',
        }

    def test_today_and_past_dates_are_allowed(self):
        for report_date in (self.today, self.today - timedelta(days=1)):
            response = self.client.post(
                '/api/travel-reports/',
                {**self.payload, 'date': report_date.isoformat()},
                format='json',
            )
            self.assertEqual(response.status_code, 201, response.data)

    def test_future_date_is_rejected(self):
        response = self.client.post(
            '/api/travel-reports/',
            {**self.payload, 'date': (self.today + timedelta(days=1)).isoformat()},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('date', response.data)

    def test_update_advances_updated_at(self):
        report = TravelReport.objects.create(
            report_id='REP-TEST-UPDATE',
            bus_number='Bus-102',
            route='Campus → Thrissur',
            driver='Test Driver',
            arrival_time='07:45 AM',
            departure_time='03:45 PM',
            date=(self.today - timedelta(days=1)).isoformat(),
        )
        created_at = report.created_at
        response = self.client.put(
            f'/api/travel-reports/{report.pk}/',
            {
                **self.payload,
                'date': report.date,
                'arrivalTime': '08:00 AM',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200, response.data)
        report.refresh_from_db()
        self.assertGreater(report.updated_at, created_at)
