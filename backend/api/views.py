from datetime import date
from zoneinfo import ZoneInfo

from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone
from .models import AdminUser, Student, Bus, Staff, TravelReport, SeatBooking, BusLocation, LoginHistory, DailyLoginCount
from .serializers import (
    StudentSerializer,
    BusSerializer,
    StaffSerializer,
    TravelReportSerializer,
    SeatBookingSerializer,
    BusLocationSerializer,
    LoginHistorySerializer,
    DailyLoginCountSerializer,
)

# ================================================================
# VIEWSETS
# ================================================================

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('id')
    serializer_class = StudentSerializer

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            # Try by numeric PK
            if lookup.isdigit():
                return Student.objects.get(pk=lookup)
        except Student.DoesNotExist:
            pass
        # Try by student_id or roll_no
        obj = Student.objects.filter(Q(student_id=lookup) | Q(roll_no=lookup)).first()
        if obj:
            return obj
        return super().get_object()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Student deleted successfully'}, status=status.HTTP_200_OK)


class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all().order_by('bus_id')
    serializer_class = BusSerializer

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            if lookup.isdigit():
                return Bus.objects.get(pk=lookup)
        except Bus.DoesNotExist:
            pass
        obj = Bus.objects.filter(bus_id=lookup).first()
        if obj:
            return obj
        return super().get_object()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Bus deleted successfully'}, status=status.HTTP_200_OK)


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by('staff_id')
    serializer_class = StaffSerializer

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            if lookup.isdigit():
                return Staff.objects.get(pk=lookup)
        except Staff.DoesNotExist:
            pass
        obj = Staff.objects.filter(staff_id=lookup).first()
        if obj:
            return obj
        return super().get_object()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Staff deleted successfully'}, status=status.HTTP_200_OK)


class TravelReportViewSet(viewsets.ModelViewSet):
    queryset = TravelReport.objects.all().order_by('-date', '-created_at')
    serializer_class = TravelReportSerializer

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            if lookup.isdigit():
                return TravelReport.objects.get(pk=lookup)
        except TravelReport.DoesNotExist:
            pass
        obj = TravelReport.objects.filter(report_id=lookup).first()
        if obj:
            return obj
        return super().get_object()


class SeatBookingViewSet(viewsets.ModelViewSet):
    queryset = SeatBooking.objects.filter(status='Confirmed').order_by('-created_at')
    serializer_class = SeatBookingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        student_roll = self.request.query_params.get('studentRollNo')
        bus_no = self.request.query_params.get('busNumber')
        date = self.request.query_params.get('date')
        trip_time = self.request.query_params.get('tripTime')

        if student_roll:
            queryset = queryset.filter(student_roll_no=student_roll)
        if bus_no:
            queryset = queryset.filter(bus_number=bus_no)
        if date:
            queryset = queryset.filter(booking_date=date)
        if trip_time:
            queryset = queryset.filter(trip_time=trip_time)
        return queryset

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError as exc:
            raise ValidationError({
                'seatNumber': 'This seat is already booked for this bus, date, and trip.'
            }) from exc

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        try:
            booking_date = date.fromisoformat(booking.booking_date)
        except (TypeError, ValueError) as exc:
            raise ValidationError({
                'bookingDate': 'This booking has an invalid date and cannot be cancelled.'
            }) from exc

        local_now = timezone.localtime(timezone.now(), ZoneInfo('Asia/Kolkata'))
        if booking_date < local_now.date():
            raise ValidationError({
                'detail': 'Cancellation is closed for this trip.'
            })

        if booking_date == local_now.date():
            cutoff_minutes = (
                7 * 60 + 30
                if 'Morning' in booking.trip_time
                else 15 * 60 + 30
            )
            current_minutes = local_now.hour * 60 + local_now.minute
            if current_minutes > cutoff_minutes:
                cutoff_label = '7:30 AM' if 'Morning' in booking.trip_time else '3:30 PM'
                raise ValidationError({
                    'detail': f'Cancellation closed at {cutoff_label} India time.'
                })

        return super().destroy(request, *args, **kwargs)


class BusLocationViewSet(viewsets.ModelViewSet):
    queryset = BusLocation.objects.all()
    serializer_class = BusLocationSerializer

    def get_object(self):
        lookup = self.kwargs.get('pk')
        obj = BusLocation.objects.filter(bus_id=lookup).first()
        if obj:
            return obj
        return super().get_object()


class LoginHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoginHistory.objects.all().order_by('-login_time')
    serializer_class = LoginHistorySerializer


class DailyLoginCountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyLoginCount.objects.all().order_by('-date')
    serializer_class = DailyLoginCountSerializer


# ================================================================
# AUTHENTICATION VIEWS
# ================================================================

class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        admin = AdminUser.objects.filter(username=username).first()
        if not admin:
            return Response(
                {'error': 'The username you entered does not exist.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if admin.password != password:
            return Response(
                {'error': 'Incorrect password for this username.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        LoginHistory.objects.create(
            user_type='admin',
            user_id=admin.username,
            name=admin.username
        )

        today = timezone.now().date()
        daily_record, created = DailyLoginCount.objects.get_or_create(
            user_type='admin',
            user_id=admin.username,
            date=today,
            defaults={'login_count': 1}
        )
        if not created:
            daily_record.login_count += 1
            daily_record.save(update_fields=['login_count'])

        return Response({
            'success': True,
            'message': 'Admin login successful',
            'user': {
                'username': admin.username,
                'email': admin.email,
                'role': 'admin'
            }
        })


class StudentLoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Please enter both roll number and password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        student = Student.objects.filter(
            Q(roll_no__iexact=username) | Q(student_id__iexact=username)
        ).first()

        if not student:
            return Response(
                {'error': 'No student found with this roll number.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if student.password != password:
            return Response(
                {'error': 'Incorrect password. Please verify and try again.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        student.last_login = timezone.now()
        student.login_count = (student.login_count or 0) + 1
        student.save(update_fields=['last_login', 'login_count'])

        LoginHistory.objects.create(
            user_type='student',
            user_id=student.roll_no,
            name=student.name
        )

        today = timezone.now().date()
        daily_record, created = DailyLoginCount.objects.get_or_create(
            user_type='student',
            user_id=student.roll_no,
            date=today,
            defaults={'login_count': 1}
        )
        if not created:
            daily_record.login_count += 1
            daily_record.save(update_fields=['login_count'])

        serializer = StudentSerializer(student)
        return Response({
            'success': True,
            'message': 'Student login successful',
            'student': serializer.data,
            'role': 'student'
        })


class StaffLoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Please enter both staff ID and password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        staff = Staff.objects.filter(
            Q(staff_id__iexact=username) | Q(name__iexact=username)
        ).first()

        if not staff:
            return Response(
                {'error': 'No staff record found with this ID.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if staff.password != password:
            return Response(
                {'error': 'Incorrect password. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        staff.last_login = timezone.now()
        staff.login_count = (staff.login_count or 0) + 1
        staff.save(update_fields=['last_login', 'login_count'])

        LoginHistory.objects.create(
            user_type='staff',
            user_id=staff.staff_id,
            name=staff.name
        )

        today = timezone.now().date()
        daily_record, created = DailyLoginCount.objects.get_or_create(
            user_type='staff',
            user_id=staff.staff_id,
            date=today,
            defaults={'login_count': 1}
        )
        if not created:
            daily_record.login_count += 1
            daily_record.save(update_fields=['login_count'])

        serializer = StaffSerializer(staff)
        return Response({
            'success': True,
            'message': 'Staff login successful',
            'staff': serializer.data,
            'role': 'staff'
        })


# ================================================================
# DASHBOARD STATS VIEW
# ================================================================

class DashboardStatsView(APIView):
    def get(self, request):
        total_students = Student.objects.count()
        total_buses = Bus.objects.count()
        active_buses = Bus.objects.filter(status='Active').count()
        active_drivers = Staff.objects.filter(designation__icontains='Driver').count()
        total_staff = Staff.objects.count()

        reports = TravelReport.objects.all()
        total_reports = reports.count()
        on_time_count = reports.filter(status='On Time').count()
        on_time_rate = f"{round((on_time_count / total_reports * 100), 1)}%" if total_reports > 0 else "98.5%"

        recent_reports = TravelReportSerializer(reports[:5], many=True).data

        return Response({
            'totalStudents': total_students,
            'totalBuses': total_buses,
            'activeBuses': active_buses,
            'activeDrivers': active_drivers,
            'totalStaff': total_staff,
            'onTimeRate': on_time_rate,
            'recentReports': recent_reports,
        })
