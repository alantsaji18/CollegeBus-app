from rest_framework import serializers
from .models import AdminUser, Student, Bus, Staff, TravelReport, SeatBooking, BusLocation, LoginHistory, DailyLoginCount

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'email']


class StudentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='student_id', required=False, allow_blank=True, allow_null=True)
    rollNo = serializers.CharField(source='roll_no')
    busNumber = serializers.CharField(source='bus_number')
    className = serializers.CharField(source='class_name')
    contactNumber = serializers.CharField(source='contact_number')
    lastLogin = serializers.DateTimeField(source='last_login', read_only=True)
    loginCount = serializers.IntegerField(source='logins_today', read_only=True)
    loginsToday = serializers.IntegerField(source='logins_today', read_only=True)
    totalCount = serializers.IntegerField(source='total_count', read_only=True)

    class Meta:
        model = Student
        fields = [
            'pk',
            'id',
            'name',
            'rollNo',
            'route',
            'stop',
            'busNumber',
            'department',
            'className',
            'contactNumber',
            'password',
            'last_login',
            'lastLogin',
            'login_count',
            'loginCount',
            'loginsToday',
            'totalCount',
            'created_at',
        ]
        extra_kwargs = {
            'password': {'write_only': False}, # readable for student demo portal
        }

    def create(self, validated_data):
        # Auto-generate student_id if not provided
        if not validated_data.get('student_id'):
            count = Student.objects.count() + 1
            validated_data['student_id'] = f"FST-{count:03d}"
        return super().create(validated_data)


class BusSerializer(serializers.ModelSerializer):
    busId = serializers.CharField(source='bus_id')
    driverName = serializers.CharField(source='driver_name')
    startingPlace = serializers.CharField(source='starting_place', required=False, default='Campus')
    endingPlace = serializers.CharField(source='ending_place')
    driversContactNumber = serializers.CharField(source='drivers_contact_number')

    class Meta:
        model = Bus
        fields = [
            'pk',
            'busId',
            'driverName',
            'startingPlace',
            'endingPlace',
            'route',
            'driversContactNumber',
            'capacity',
            'status',
            'created_at',
        ]


class StaffSerializer(serializers.ModelSerializer):
    staffId = serializers.CharField(source='staff_id')
    phoneNumber = serializers.CharField(source='phone_number')
    lastLogin = serializers.DateTimeField(source='last_login', read_only=True)
    loginCount = serializers.IntegerField(source='logins_today', read_only=True)
    loginsToday = serializers.IntegerField(source='logins_today', read_only=True)
    totalCount = serializers.IntegerField(source='total_count', read_only=True)

    class Meta:
        model = Staff
        fields = [
            'pk',
            'staffId',
            'name',
            'password',
            'designation',
            'phoneNumber',
            'experience',
            'last_login',
            'lastLogin',
            'login_count',
            'loginCount',
            'loginsToday',
            'totalCount',
            'created_at',
        ]


class TravelReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='report_id', required=False, allow_blank=True)
    reportId = serializers.CharField(source='report_id', required=False, allow_blank=True)
    busNo = serializers.CharField(source='bus_number', required=False)
    busNumber = serializers.CharField(source='bus_number', required=False)
    arrivalTime = serializers.CharField(source='arrival_time')
    departureTime = serializers.CharField(source='departure_time')

    class Meta:
        model = TravelReport
        fields = [
            'pk',
            'id',
            'reportId',
            'busNo',
            'busNumber',
            'route',
            'driver',
            'arrivalTime',
            'departureTime',
            'date',
            'status',
            'created_at',
        ]

    def create(self, validated_data):
        if not validated_data.get('report_id'):
            count = TravelReport.objects.count() + 1
            report_id = f"REP-{500 + count}"
            while TravelReport.objects.filter(report_id=report_id).exists():
                count += 1
                report_id = f"REP-{500 + count}"
            validated_data['report_id'] = report_id
        return super().create(validated_data)


class SeatBookingSerializer(serializers.ModelSerializer):
    studentRollNo = serializers.CharField(source='student_roll_no')
    studentName = serializers.CharField(source='student_name', required=False, allow_blank=True)
    busNumber = serializers.CharField(source='bus_number')
    seatNumber = serializers.CharField(source='seat_number')
    bookingDate = serializers.CharField(source='booking_date')
    tripTime = serializers.CharField(source='trip_time')

    class Meta:
        model = SeatBooking
        fields = [
            'id',
            'studentRollNo',
            'studentName',
            'busNumber',
            'seatNumber',
            'bookingDate',
            'tripTime',
            'status',
            'created_at',
        ]


class BusLocationSerializer(serializers.ModelSerializer):
    busId = serializers.CharField(source='bus_id')
    lastUpdated = serializers.DateTimeField(source='last_updated', read_only=True)

    class Meta:
        model = BusLocation
        fields = [
            'id',
            'busId',
            'latitude',
            'longitude',
            'speed',
            'status',
            'lastUpdated',
        ]


class LoginHistorySerializer(serializers.ModelSerializer):
    userType = serializers.CharField(source='user_type', read_only=True)
    userId = serializers.CharField(source='user_id', read_only=True)
    loginTime = serializers.DateTimeField(source='login_time', read_only=True)

    class Meta:
        model = LoginHistory
        fields = [
            'id',
            'user_type',
            'userType',
            'user_id',
            'userId',
            'name',
            'login_time',
            'loginTime',
        ]


class DailyLoginCountSerializer(serializers.ModelSerializer):
    userType = serializers.CharField(source='user_type', read_only=True)
    userId = serializers.CharField(source='user_id', read_only=True)
    loginCount = serializers.IntegerField(source='login_count', read_only=True)

    class Meta:
        model = DailyLoginCount
        fields = [
            'id',
            'user_type',
            'userType',
            'user_id',
            'userId',
            'date',
            'login_count',
            'loginCount',
        ]


