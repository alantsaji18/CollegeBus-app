from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet,
    BusViewSet,
    StaffViewSet,
    TravelReportViewSet,
    SeatBookingViewSet,
    BusLocationViewSet,
    LoginHistoryViewSet,
    DailyLoginCountViewSet,
    AdminLoginView,
    StudentLoginView,
    StaffLoginView,
    DashboardStatsView,
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'buses', BusViewSet, basename='bus')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'travel-reports', TravelReportViewSet, basename='travel_report')
router.register(r'bookings', SeatBookingViewSet, basename='booking')
router.register(r'bus-locations', BusLocationViewSet, basename='bus_location')
router.register(r'login-history', LoginHistoryViewSet, basename='login_history')
router.register(r'daily-logins', DailyLoginCountViewSet, basename='daily_logins')

urlpatterns = [
    # Router endpoints (CRUD)
    path('', include(router.urls)),

    # Authentication
    path('auth/admin-login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/student-login/', StudentLoginView.as_view(), name='student_login'),
    path('auth/staff-login/', StaffLoginView.as_view(), name='staff_login'),

    # Dashboard Statistics
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
