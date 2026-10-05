from django.db import models
# from django.utils import timezone

class AdminUser(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Student(models.Model):
    student_id = models.CharField(max_length=50, blank=True, null=True) # e.g. "FST-001"
    name = models.CharField(max_length=150)
    roll_no = models.CharField(max_length=50, unique=True) # e.g. "MCA101"
    route = models.CharField(max_length=150)
    stop = models.CharField(max_length=150)
    bus_number = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    class_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(null=True, blank=True)
    login_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_count(self):
        return self.login_count or 0

    # @property
    # def logins_today(self):
    #     from django.utils import timezone
    #     today = timezone.now().date()
    #     rec = DailyLoginCount.objects.filter(user_type='student', user_id=self.roll_no, date=today).first()
    #     return rec.login_count if rec else 0

    def __str__(self):
        return f"{self.roll_no} - {self.name}"


class Bus(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Maintenance', 'Maintenance'),
    ]

    bus_id = models.CharField(max_length=50, unique=True) # e.g. "Bus-101"
    driver_name = models.CharField(max_length=150)
    starting_place = models.CharField(max_length=150, default="Campus")
    ending_place = models.CharField(max_length=150)
    route = models.CharField(max_length=150)
    drivers_contact_number = models.CharField(max_length=20)
    capacity = models.CharField(max_length=20, default="50")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bus_id} ({self.route})"


class Staff(models.Model):
    staff_id = models.CharField(max_length=50, unique=True) # e.g. "STF-001"
    name = models.CharField(max_length=150)
    password = models.CharField(max_length=128)
    designation = models.CharField(max_length=100, default="Driver")
    phone_number = models.CharField(max_length=20)
    experience = models.CharField(max_length=50, default="1 Year")
    last_login = models.DateTimeField(null=True, blank=True)
    login_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_count(self):
        return self.login_count or 0

    # @property
    # def logins_today(self):
    #     from django.utils import timezone
    #     today = timezone.now().date()
    #     rec = DailyLoginCount.objects.filter(user_type='staff', user_id=self.staff_id, date=today).first()
    #     return rec.login_count if rec else 0

    def __str__(self):
        return f"{self.staff_id} - {self.name} ({self.designation})"


class TravelReport(models.Model):
    STATUS_CHOICES = [
        ('On Time', 'On Time'),
        ('Delayed', 'Delayed'),
    ]

    report_id = models.CharField(max_length=50, unique=True) # e.g. "REP-501"
    bus_number = models.CharField(max_length=50) # e.g. "Bus-101"
    route = models.CharField(max_length=150)
    driver = models.CharField(max_length=150)
    arrival_time = models.CharField(max_length=50)
    departure_time = models.CharField(max_length=50)
    date = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="On Time")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_id} - {self.bus_number} ({self.date})"


class SeatBooking(models.Model):
    student_roll_no = models.CharField(max_length=50)
    student_name = models.CharField(max_length=150, blank=True, default="")
    bus_number = models.CharField(max_length=50)
    seat_number = models.CharField(max_length=20)
    booking_date = models.CharField(max_length=50)
    trip_time = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default="Confirmed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_roll_no} - Seat {self.seat_number} - {self.bus_number}"


class BusLocation(models.Model):
    bus_id = models.CharField(max_length=50, unique=True)
    latitude = models.FloatField(default=10.2315)
    longitude = models.FloatField(default=76.4150)
    speed = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, default="On Route")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bus_id} at ({self.latitude}, {self.longitude})"


class LoginHistory(models.Model):
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    user_id = models.CharField(max_length=100) # e.g. roll_no "MCA101" or staff_id "STF-001"
    name = models.CharField(max_length=150, blank=True, default="")
    login_time = models.DateTimeField(auto_now_add=True)
    # login_time = timezone.now()

    def __str__(self):
        return f"{self.user_type.capitalize()} {self.user_id} ({self.name}) - {self.login_time}"


class DailyLoginCount(models.Model):
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    user_id = models.CharField(max_length=100) # e.g. roll_no "MCA101" or staff_id "STF-001"
    date = models.DateField()
    login_count = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user_type', 'user_id', 'date')
        verbose_name_plural = "Daily Login Counts"

    def __str__(self):
        return f"{self.user_type.capitalize()} {self.user_id} on {self.date}: {self.login_count} logins"


