from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from api.models import Student, Staff, LoginHistory, DailyLoginCount

class LoginDatabaseUpdateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = Student.objects.create(
            student_id="FST-999",
            name="Test Student",
            roll_no="TEST101",
            route="Test Route",
            stop="Test Stop",
            bus_number="Bus-101",
            department="CSE",
            class_name="S6 CSE",
            contact_number="9999999999",
            password="testpassword"
        )
        self.staff = Staff.objects.create(
            staff_id="STF-999",
            name="Test Staff",
            password="staffpassword",
            designation="Driver",
            phone_number="8888888888",
            experience="2 Years"
        )

    def test_student_login_updates_database(self):
        self.assertIsNone(self.student.last_login)
        self.assertEqual(self.student.login_count, 0)

        # First Login
        response1 = self.client.post('/api/auth/student-login/', {
            'username': 'TEST101',
            'password': 'testpassword'
        }, format='json')

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertIsNotNone(self.student.last_login)
        self.assertEqual(self.student.login_count, 1)

        # Second Login
        response2 = self.client.post('/api/auth/student-login/', {
            'username': 'TEST101',
            'password': 'testpassword'
        }, format='json')

        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.login_count, 2)

        # Check LoginHistory records
        history_records = LoginHistory.objects.filter(user_id='TEST101')
        self.assertEqual(history_records.count(), 2)

        # Check DailyLoginCount for today
        today = timezone.now().date()
        daily_record = DailyLoginCount.objects.get(user_id='TEST101', date=today)
        self.assertEqual(daily_record.login_count, 2)

    def test_staff_login_updates_database(self):
        self.assertIsNone(self.staff.last_login)
        self.assertEqual(self.staff.login_count, 0)

        # Login twice
        for i in range(1, 3):
            res = self.client.post('/api/auth/staff-login/', {
                'username': 'STF-999',
                'password': 'staffpassword'
            }, format='json')
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            self.staff.refresh_from_db()
            self.assertEqual(self.staff.login_count, i)

        history_records = LoginHistory.objects.filter(user_id='STF-999')
        self.assertEqual(history_records.count(), 2)

        today = timezone.now().date()
        daily_record = DailyLoginCount.objects.get(user_id='STF-999', date=today)
        self.assertEqual(daily_record.login_count, 2)
