from django.contrib import admin
from .models import AdminUser, Student, Bus, Staff, TravelReport, SeatBooking, BusLocation

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('username','password', 'email', 'created_at')
    search_fields = ('username', 'email')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'roll_no', 'name', 'bus_number', 'route', 'stop','password','department','last_login','login_count','total_count')
    search_fields = ('student_id', 'roll_no', 'name', 'bus_number')
    list_filter = ('department', 'bus_number', 'route')

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_id', 'route', 'driver_name', 'capacity', 'status')
    search_fields = ('bus_id', 'route', 'driver_name')
    list_filter = ('status', 'starting_place')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('staff_id', 'name','password', 'designation', 'phone_number', 'experience','last_login','login_count','total_count')
    search_fields = ('staff_id', 'name', 'designation')
    list_filter = ('designation',)

@admin.register(TravelReport)
class TravelReportAdmin(admin.ModelAdmin):
    list_display = ('report_id', 'bus_number', 'route', 'driver', 'arrival_time', 'departure_time', 'date', 'status')
    search_fields = ('report_id', 'bus_number', 'driver')
    list_filter = ('status', 'date')

@admin.register(SeatBooking)
class SeatBookingAdmin(admin.ModelAdmin):
    list_display = ('student_roll_no', 'student_name', 'bus_number', 'seat_number', 'booking_date', 'trip_time', 'status')
    search_fields = ('student_roll_no', 'student_name', 'bus_number')
    list_filter = ('status', 'booking_date')

@admin.register(BusLocation)
class BusLocationAdmin(admin.ModelAdmin):
    list_display = ('bus_id', 'latitude', 'longitude', 'speed', 'status', 'last_updated')
