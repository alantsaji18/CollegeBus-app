from django.core.management.base import BaseCommand
from api.models import AdminUser, Student, Bus, Staff, TravelReport, BusLocation

class Command(BaseCommand):
    help = 'Seeds initial demo data for College Bus Management System'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        # 1. Admin Users
        admins = [
            {"username": "admin1", "password": "admin1@123", "email": "admin1@fisat.ac.in"},
            {"username": "admin2", "password": "admin2@123", "email": "admin2@fisat.ac.in"},
        ]
        for a in admins:
            AdminUser.objects.update_or_create(
                username=a["username"],
                defaults={"password": a["password"], "email": a["email"]}
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(admins)} Admin users"))

        # 2. Students
        students = [
            {
                "student_id": "FST-001",
                "name": "Rahul Kumar",
                "roll_no": "MCA101",
                "route": "ALuva",
                "stop": "Town Hall",
                "bus_number": "Bus-101",
                "department": "MCA",
                "class_name": "S3 MCA",
                "contact_number": "9876543210",
                "password": "MCA101"
            },
            {
                "student_id": "FST-002",
                "name": "Ayan Das",
                "roll_no": "EEE105",
                "route": "Thrissur",
                "stop": "Chalakudy PUB",
                "bus_number": "Bus-102",
                "department": "B-Tech",
                "class_name": "S6 EEE",
                "contact_number": "9865231905",
                "password": "EEE105"
            },
            {
                "student_id": "FST-003",
                "name": "Rohan Mehta",
                "roll_no": "MECH101",
                "route": "Ernakulam",
                "stop": "Marine Drive",
                "bus_number": "Bus-108",
                "department": "B-Tech",
                "class_name": "S6 MECH",
                "contact_number": "9876587105",
                "password": "MECH101"
            },
            {
                "student_id": "FST-004",
                "name": "Sneha Roy",
                "roll_no": "CSE202",
                "route": "Kothamangalam",
                "stop": "Church Jn",
                "bus_number": "Bus-104",
                "department": "B-Tech",
                "class_name": "S4 CSE",
                "contact_number": "9876543211",
                "password": "CSE202"
            },
            {
                "student_id": "FST-005",
                "name": "Vikram Joshi",
                "roll_no": "MCA102",
                "route": "Muvattupuzha",
                "stop": "Post Office",
                "bus_number": "Bus-105",
                "department": "MCA",
                "class_name": "S3 MCA",
                "contact_number": "9876543212",
                "password": "MCA102"
            },
            {
                "student_id": "FST-006",
                "name": "Alant Saji",
                "roll_no": "CS2026",
                "route": "Route A - FISAT to City",
                "stop": "Angamaly Town Junction",
                "bus_number": "Bus-101",
                "department": "Computer Science",
                "class_name": "S6 MCA",
                "contact_number": "9876543210",
                "password": "CS2026"
            }
        ]
        for s in students:
            Student.objects.update_or_create(
                roll_no=s["roll_no"],
                defaults=s
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(students)} Students"))

        # 3. Buses
        buses = [
            {
                "bus_id": "Bus-101",
                "driver_name": "Ravi",
                "starting_place": "Campus",
                "ending_place": "Ernakulam",
                "route": "Ernakulam",
                "drivers_contact_number": "9876543210",
                "capacity": "50",
                "status": "Active"
            },
            {
                "bus_id": "Bus-102",
                "driver_name": "Arun",
                "starting_place": "Campus",
                "ending_place": "Thrissur",
                "route": "Thrissur",
                "drivers_contact_number": "9865231905",
                "capacity": "45",
                "status": "Maintenance"
            },
            {
                "bus_id": "Bus-103",
                "driver_name": "Meeran",
                "starting_place": "Campus",
                "ending_place": "Chalakkudy",
                "route": "Chalakkudy",
                "drivers_contact_number": "9876543210",
                "capacity": "60",
                "status": "Maintenance"
            },
            {
                "bus_id": "Bus-104",
                "driver_name": "Raju",
                "starting_place": "Campus",
                "ending_place": "Kothamangalam",
                "route": "Kothamangalam",
                "drivers_contact_number": "9877631910",
                "capacity": "40",
                "status": "Active"
            },
            {
                "bus_id": "Bus-105",
                "driver_name": "Rajesh",
                "starting_place": "Campus",
                "ending_place": "Muvattupuzha",
                "route": "Muvattupuzha",
                "drivers_contact_number": "9876884506",
                "capacity": "48",
                "status": "Active"
            },
            {
                "bus_id": "Bus-106",
                "driver_name": "Aravind",
                "starting_place": "Campus",
                "ending_place": "Angamaly",
                "route": "Angamaly",
                "drivers_contact_number": "9876500001",
                "capacity": "50",
                "status": "Active"
            }
        ]
        for b in buses:
            Bus.objects.update_or_create(
                bus_id=b["bus_id"],
                defaults=b
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(buses)} Buses"))

        # 4. Staff / Drivers
        staff_members = [
            {
                "staff_id": "STF-001",
                "name": "Ravi",
                "password": "password123",
                "designation": "Driver",
                "phone_number": "9876543210",
                "experience": "5 Years"
            },
            {
                "staff_id": "STF-002",
                "name": "Suresh Kumar",
                "password": "password123",
                "designation": "GateStaff",
                "phone_number": "9812345678",
                "experience": "3 Years"
            },
            {
                "staff_id": "STF-003",
                "name": "Arun",
                "password": "password123",
                "designation": "Driver",
                "phone_number": "9865231905",
                "experience": "4 Years"
            },
            {
                "staff_id": "STF-004",
                "name": "Meeran",
                "password": "password123",
                "designation": "Driver",
                "phone_number": "9876543210",
                "experience": "6 Years"
            },
            {
                "staff_id": "SEC-GATE-04",
                "name": "Sreedeviamma P.",
                "password": "password123",
                "designation": "Chief Gate Transit & Security Officer",
                "phone_number": "9447987654",
                "experience": "8 Years"
            }
        ]
        for sm in staff_members:
            Staff.objects.update_or_create(
                staff_id=sm["staff_id"],
                defaults=sm
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(staff_members)} Staff members"))

        # 5. Travel Reports
        reports = [
            {
                "report_id": "REP-501",
                "bus_number": "Bus-101",
                "route": "Campus → Angamaly",
                "driver": "Ravi",
                "arrival_time": "07:50 AM",
                "departure_time": "03:45 PM",
                "date": "2026-09-05",
                "status": "On Time"
            },
            {
                "report_id": "REP-502",
                "bus_number": "Bus-102",
                "route": "Campus → Ernakulam",
                "driver": "Arun",
                "arrival_time": "08:05 AM",
                "departure_time": "03:55 PM",
                "date": "2026-09-05",
                "status": "Delayed"
            },
            {
                "report_id": "REP-503",
                "bus_number": "Bus-103",
                "route": "Campus → Chalakkudy",
                "driver": "Meeran",
                "arrival_time": "07:55 AM",
                "departure_time": "03:50 PM",
                "date": "2026-09-05",
                "status": "On Time"
            },
            {
                "report_id": "REP-504",
                "bus_number": "Bus-104",
                "route": "Campus → Kothamangalam",
                "driver": "Arjun",
                "arrival_time": "08:10 AM",
                "departure_time": "03:40 PM",
                "date": "2026-09-04",
                "status": "Delayed"
            },
            {
                "report_id": "REP-505",
                "bus_number": "Bus-105",
                "route": "Campus → Muvattupuzha",
                "driver": "Athul",
                "arrival_time": "08:00 AM",
                "departure_time": "03:50 PM",
                "date": "2026-09-04",
                "status": "On Time"
            }
        ]
        for r in reports:
            TravelReport.objects.update_or_create(
                report_id=r["report_id"],
                defaults=r
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(reports)} Travel Reports"))

        # 6. Bus Locations
        locations = [
            {"bus_id": "Bus-101", "latitude": 10.2315, "longitude": 76.4150, "speed": 38.5, "status": "En Route to Angamaly"},
            {"bus_id": "Bus-102", "latitude": 10.1550, "longitude": 76.3650, "speed": 42.0, "status": "En Route to Ernakulam"},
            {"bus_id": "Bus-103", "latitude": 10.2405, "longitude": 76.4161, "speed": 35.0, "status": "Approaching Stop"},
            {"bus_id": "Bus-104", "latitude": 10.1890, "longitude": 76.3850, "speed": 40.0, "status": "On Route"},
            {"bus_id": "Bus-105", "latitude": 10.1710, "longitude": 76.3760, "speed": 36.0, "status": "On Route"},
        ]
        for loc in locations:
            BusLocation.objects.update_or_create(
                bus_id=loc["bus_id"],
                defaults=loc
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(locations)} Bus Locations"))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
