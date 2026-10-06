import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { bookingsApi, busesApi } from "../services/api";
import { toTrackingBus } from "../services/busRoutes";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const STUDENT_STOP_COORDINATES = {
  "town hall": [9.9952, 76.2898],
  "chalakudy pub": [10.307, 76.337],
  "marine drive": [9.9816, 76.2762],
  "church jn": [10.0645, 76.6239],
  "post office": [9.9865, 76.5775],
  "angamaly town junction": [10.19, 76.38],
  anagamaly: [10.19, 76.38],
  aluva: [10.107, 76.351],
  kidangoor: [9.815, 76.535],
};

const getStudentStopCoordinates = (stop) =>
  STUDENT_STOP_COORDINATES[String(stop || "").trim().toLowerCase()] || null;

const getDistanceMeters = (first, second) => {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = radians(second[0] - first[0]);
  const longitudeDifference = radians(second[1] - first[1]);
  const arc =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(first[0])) *
      Math.cos(radians(second[0])) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6_371_000 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
};

const getIndiaDateTime = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(() => {
    try {
      const saved = sessionStorage.getItem("loggedInStudent");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      name: "Alant",
      rollNo: "CS2026",
      busNumber: "Bus-101",
      route: "Route A - FISAT to City",
      stop: "Angamaly Town Junction",
      department: "Computer Science",
      className: "S6 MCA",
      contactNumber: "9876543210"
    };
  });

  const [activeTab, setActiveTab] = useState("overview");

  const getTodayString = () => getIndiaDateTime(new Date()).date;
  const getTomorrowString = () => {
    const [year, month, day] = getTodayString().split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().split("T")[0];
  };

  const [travelDirection, setTravelDirection] = useState("North-Bound (Morning Sun on Right)");
  const [predictionDone, setPredictionDone] = useState(false);
  const [predictedSunlightMap, setPredictedSunlightMap] = useState({});

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingDate, setBookingDate] = useState(getTodayString());
  const [tripTime, setTripTime] = useState("Morning (07:45 AM)");
  const [currentTime, setCurrentTime] = useState(() => getIndiaDateTime(new Date()));
  const [loadedAvailabilityKey, setLoadedAvailabilityKey] = useState("");
  const [seatAvailabilityErrorKey, setSeatAvailabilityErrorKey] = useState("");
  const availabilityKey = `${student.busNumber}|${bookingDate}|${tripTime}`;
  const seatAvailabilityReady = loadedAvailabilityKey === availabilityKey;
  const seatAvailabilityError = seatAvailabilityErrorKey === availabilityKey;
  const bookingCutoff = tripTime.includes("Morning") ? 7 * 60 + 30 : 15 * 60 + 30;
  const bookingCutoffLabel = tripTime.includes("Morning") ? "7:30 AM" : "3:30 PM";
  const bookingWindowClosed =
    bookingDate === currentTime.date && currentTime.minutes > bookingCutoff;
  const isBookingCancellationClosed = (booking) => {
    if (!booking?.date) return false;
    if (booking.date < currentTime.date) return true;
    if (booking.date > currentTime.date) return false;

    const cutoff = booking.time?.includes("Morning") ? 7 * 60 + 30 : 15 * 60 + 30;
    return currentTime.minutes > cutoff;
  };

  const [myBookings, setMyBookings] = useState([]);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(getIndiaDateTime(new Date()));
    }, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  const [busMatrix, setBusMatrix] = useState([
    [{ id: "1,1", status: "available" }, { id: "1,2", status: "available" }, { id: "1,3", status: "available" }, { id: "1,4", status: "available" }, { id: "1,5", status: "available" }, { id: "1,6", status: "available" }],
    [{ id: "2,1", status: "available" }, { id: "2,2", status: "available" }, { id: "2,3", status: "available" }, { id: "2,4", status: "available" }, { id: "2,5", status: "available" }, { id: "2,6", status: "available" }],
    [{ id: "3,1", status: "available" }, { id: "3,2", status: "available" }, { id: "3,3", status: "available" }, { id: "3,4", status: "available" }, { id: "3,5", status: "available" }, { id: "3,6", status: "available" }],
    [{ id: "4,1", status: "available" }, { id: "4,2", status: "available" }, { id: "4,3", status: "available" }, { id: "4,4", status: "available" }, { id: "4,5", status: "available" }, { id: "4,6", status: "available" }],
    [{ id: "5,1", status: "available" }, { id: "5,2", status: "available" }, { id: "5,3", status: "available" }, { id: "5,4", status: "available" }, { id: "5,5", status: "available" }, { id: "5,6", status: "available" }],
    [{ id: "6,1", status: "available" }, { id: "6,2", status: "available" }, { id: "6,3", status: "available" }, { id: "6,4", status: "available" }, { id: "6,5", status: "available" }, { id: "6,6", status: "available" }],
    [{ id: "7,1", status: "available" }, { id: "7,2", status: "available" }, { id: "7,3", status: "available" }, { id: "7,4", status: "available" }, { id: "7,5", status: "available" }, { id: "7,6", status: "available" }],
    [{ id: "8,1", status: "available" }, { id: "8,2", status: "available" }, { id: "8,3", status: "available" }, { id: "8,4", status: "available" }, { id: "8,5", status: "available" }, { id: "8,6", status: "available" }],
  ]);

  // OSRM & Leaflet Map States starting from FISAT College
  const [osrmRouteCoords, setOsrmRouteCoords] = useState([]);
  const [busProgressIndex, setBusProgressIndex] = useState(0);
  const [studentStopRoute, setStudentStopRoute] = useState(null);
  const [trackingBus, setTrackingBus] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [routedBusId, setRoutedBusId] = useState("");

  const routeStops = useMemo(() => {
    const studentStopCoordinates = getStudentStopCoordinates(student.stop);
    if (
      !trackingBus ||
      trackingBus.routePath.some((coordinate) => !coordinate) ||
      !studentStopCoordinates
    ) return [];
    return [
      { name: `${trackingBus.startingPlace} (Start)`, coords: trackingBus.routePath[0] },
      { name: student.stop, coords: studentStopCoordinates },
      { name: `${trackingBus.endingPlace} (Destination)`, coords: trackingBus.routePath[1] },
    ];
  }, [trackingBus, student.stop]);

  const studentStopReached = Boolean(
    studentStopRoute &&
    routedBusId === student.busNumber &&
    busProgressIndex >= studentStopRoute.stopIndex
  );
  const studentStopRemainingDistance = studentStopRoute && routedBusId === student.busNumber
    ? Math.max(
        studentStopRoute.cumulativeDistances[studentStopRoute.stopIndex] -
          (studentStopRoute.cumulativeDistances[busProgressIndex] || 0),
        0
      )
    : null;
  const studentStopDistance = studentStopRemainingDistance === null
    ? "Calculating..."
    : `${(studentStopRemainingDistance / 1000).toFixed(1)} km`;
  const studentStopEta = studentStopReached
    ? `Arrived at ${student.stop}`
    : studentStopRemainingDistance === null
      ? "Calculating..."
      : `${Math.ceil(
          studentStopRoute.stopDurationSeconds *
          (studentStopRoute.cumulativeDistances[studentStopRoute.stopIndex]
            ? studentStopRemainingDistance / studentStopRoute.cumulativeDistances[studentStopRoute.stopIndex]
            : 0) /
          60
        )} mins`;
  
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const busMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);
  const stopMarkersRef = useRef([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getAll({ studentRollNo: student.rollNo });
        if (!Array.isArray(data)) {
          throw new Error("Unexpected bookings response.");
        }
        setMyBookings(
          data.map((b) => ({
            id: b.id,
            bookingId: b.id ? `BK-${b.id}` : "BK-101",
            seatNo: b.seatNumber,
            busNumber: b.busNumber,
            route: student.route,
            date: b.bookingDate,
            time: b.tripTime,
          }))
        );
        return;
      } catch (err) {
        console.warn("Backend bookings not available, using local cache", err);
      }

      const savedBookings = localStorage.getItem("studentBookings");
      if (savedBookings) {
        try {
          setMyBookings(JSON.parse(savedBookings));
        } catch (err) {
          console.error("Failed to parse bookings", err);
        }
      }
    };

    fetchBookings();
  }, [student.rollNo, student.route]);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchSeatAvailability = async () => {
      try {
        const bookings = await bookingsApi.getAll({
          busNumber: student.busNumber,
          date: bookingDate,
          tripTime,
        });
        if (!Array.isArray(bookings)) {
          throw new Error("Unexpected seat availability response.");
        }

        if (isCurrentRequest) {
          setSelectedSeat(null);
          const bookedSeats = new Set(bookings.map((booking) => booking.seatNumber));
          setBusMatrix((currentMatrix) =>
            currentMatrix.map((row) =>
              row.map((seat) => ({
                ...seat,
                status: bookedSeats.has(seat.id) ? "sold" : "available",
              }))
            )
          );
          setSeatAvailabilityErrorKey("");
          setLoadedAvailabilityKey(availabilityKey);
        }
      } catch (err) {
        console.error("Could not load seat availability:", err);
        if (isCurrentRequest) {
          setSeatAvailabilityErrorKey(availabilityKey);
          setBookingMessage("Could not load seat availability. Please try again.");
        }
      }
    };

    fetchSeatAvailability();
    return () => {
      isCurrentRequest = false;
    };
  }, [student.busNumber, bookingDate, tripTime, availabilityKey]);

  useEffect(() => {
    if (activeTab !== "tracking") return undefined;

    let isCurrentRequest = true;
    busesApi.getAll()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected bus list response.");
        }
        const bus = data.find((item) => (item.busId || item.bus_id) === student.busNumber);
        if (!bus) {
          throw new Error(`Assigned bus ${student.busNumber} is not registered in api_bus.`);
        }
        const resolvedBus = toTrackingBus(bus);
        if (resolvedBus.routePath.some((coordinate) => !coordinate)) {
          throw new Error(`A map location is not configured for ${resolvedBus.startingPlace} or ${resolvedBus.endingPlace}.`);
        }
        if (!getStudentStopCoordinates(student.stop)) {
          throw new Error(`A map location is not configured for your stop: ${student.stop || "not set"}.`);
        }
        if (isCurrentRequest) {
          setRoutedBusId("");
          setTrackingError("");
          setTrackingBus(resolvedBus);
        }
      })
      .catch((error) => {
        console.error("Could not load the assigned bus from api_bus:", error);
        if (isCurrentRequest) {
          setOsrmRouteCoords([]);
          setStudentStopRoute(null);
          setRoutedBusId("");
          setTrackingError(error.message || "Could not load the assigned bus route.");
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, student.busNumber, student.stop]);

  // Fetch the road route using the assigned bus's api_bus endpoints.
  useEffect(() => {
    if (
      activeTab !== "tracking" ||
      !trackingBus ||
      trackingBus.busId !== student.busNumber ||
      routeStops.length !== 3
    ) return undefined;

    let isCurrentRoute = true;
    const coordinatesString = routeStops.map((stop) => `${stop.coords[1]},${stop.coords[0]}`).join(";");

    const fetchOSRMRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`
        );
        if (!response.ok) {
          throw new Error(`Road route request failed with status ${response.status}.`);
        }
        const data = await response.json();
        const route = data.routes?.[0];
        if (!route?.geometry?.coordinates?.length) {
          throw new Error("No road route was returned for the assigned bus.");
        }
        if (isCurrentRoute) {
          const coordinates = route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
          const snappedStop = data.waypoints?.[1]?.location;
          const stopCoordinate = snappedStop
            ? [snappedStop[1], snappedStop[0]]
            : routeStops[1].coords;
          const stopIndex = coordinates.reduce((closestIndex, coordinate, index) => {
            const closestDistance = getDistanceMeters(coordinates[closestIndex], stopCoordinate);
            const candidateDistance = getDistanceMeters(coordinate, stopCoordinate);
            return candidateDistance < closestDistance ? index : closestIndex;
          }, 0);
          const cumulativeDistances = [0];
          for (let index = 1; index < coordinates.length; index += 1) {
            cumulativeDistances.push(
              cumulativeDistances[index - 1] + getDistanceMeters(coordinates[index - 1], coordinates[index])
            );
          }
          const toStopLeg = route.legs?.[0];
          setOsrmRouteCoords(coordinates);
          setBusProgressIndex(0);
          setRoutedBusId(trackingBus.busId);
          setStudentStopRoute({
            stopIndex,
            stopDistanceMeters: toStopLeg?.distance ?? cumulativeDistances[stopIndex],
            stopDurationSeconds: toStopLeg?.duration ?? route.duration,
            cumulativeDistances,
            snappedStop: stopCoordinate,
          });
          setTrackingError("");
        }
      } catch (error) {
        console.error(`Could not load road route for ${trackingBus.busId}:`, error);
        if (isCurrentRoute) {
          setOsrmRouteCoords([]);
          setRoutedBusId("");
          setStudentStopRoute(null);
          setTrackingError("Road routing is unavailable; the assigned bus route could not be displayed.");
        }
      }
    };

    fetchOSRMRoute();
    return () => {
      isCurrentRoute = false;
    };
  }, [activeTab, trackingBus, student.busNumber, routeStops]);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (activeTab === "tracking" && window.L && mapRef.current) {
      if (!leafletMapInstance.current) {
        const map = window.L.map(mapRef.current, {
          zoomControl: false
        }).setView([10.19, 76.38], 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap & OSRM Engine'
        }).addTo(map);

        window.L.control.zoom({ position: 'bottomright' }).addTo(map);
        leafletMapInstance.current = map;
      } else {
        leafletMapInstance.current.invalidateSize();
      }
    }
  }, [activeTab]);

  // Render the registered route endpoints and bus marker.
  useEffect(() => {
    if (leafletMapInstance.current && window.L) {
      const map = leafletMapInstance.current;

      if (completedPolylineRef.current) map.removeLayer(completedPolylineRef.current);
      if (remainingPolylineRef.current) map.removeLayer(remainingPolylineRef.current);
      if (busMarkerRef.current) map.removeLayer(busMarkerRef.current);
      stopMarkersRef.current.forEach(m => map.removeLayer(m));
      stopMarkersRef.current = [];
      completedPolylineRef.current = null;
      remainingPolylineRef.current = null;
      busMarkerRef.current = null;
      if (!osrmRouteCoords.length || !routeStops.length || routedBusId !== student.busNumber) return;

      completedPolylineRef.current = window.L.polyline([], {
        color: '#cbd5e1',
        weight: 5,
        opacity: 0.5
      }).addTo(map);

      remainingPolylineRef.current = window.L.polyline(osrmRouteCoords, {
        color: '#1a73e8',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeStops.forEach((stop, idx) => {
        const stopIcon = window.L.divIcon({
          className: 'google-stop-pin',
          html: `<div style="background-color: ${idx === 0 ? '#10b981' : idx === routeStops.length - 1 ? '#ef4444' : '#ffffff'}; color: ${idx === 0 || idx === routeStops.length - 1 ? '#fff' : '#1a73e8'}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid #1a73e8; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${idx + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const markerPosition = idx === 1 && studentStopRoute?.snappedStop
          ? studentStopRoute.snappedStop
          : stop.coords;
        const marker = window.L.marker(markerPosition, { icon: stopIcon })
          .addTo(map)
          .bindPopup(`<b>Stop ${idx + 1}: ${stop.name}</b><br/>FISAT Transit Network`);
        
        stopMarkersRef.current.push(marker);
      });

      const busEmojiIcon = window.L.divIcon({
        className: 'custom-bus-emoji-marker',
        html: `<div style="background-color: #1a73e8; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 6px; border: 2px solid white; white-space: nowrap;">🚌 ${student.busNumber}</div>`,
        iconSize: [110, 40],
        iconAnchor: [55, 20]
      });

      busMarkerRef.current = window.L.marker(routeStops[0].coords, { icon: busEmojiIcon }).addTo(map);
      map.fitBounds(remainingPolylineRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [osrmRouteCoords, routeStops, routedBusId, student.busNumber, studentStopRoute]);

  useEffect(() => {
    let interval;
    if (
      activeTab === "tracking" &&
      routedBusId === student.busNumber &&
      osrmRouteCoords.length > 0 &&
      busMarkerRef.current
    ) {
      interval = setInterval(() => {
        setBusProgressIndex((prevIndex) => {
          const nextIndex = prevIndex >= osrmRouteCoords.length - 1 ? 0 : prevIndex + 1;
          const currentPos = osrmRouteCoords[nextIndex];
          
          if (busMarkerRef.current) {
            busMarkerRef.current.setLatLng(currentPos);
          }

          const traveledCoords = osrmRouteCoords.slice(0, nextIndex + 1);
          const upcomingCoords = osrmRouteCoords.slice(nextIndex);

          if (completedPolylineRef.current) {
            completedPolylineRef.current.setLatLngs(traveledCoords);
          }
          if (remainingPolylineRef.current) {
            remainingPolylineRef.current.setLatLngs(upcomingCoords);
          }

          return nextIndex;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, osrmRouteCoords, routeStops.length, routedBusId, student.busNumber]);

  const handleLogout = () => {
    sessionStorage.removeItem("studentLoggedIn");
    sessionStorage.removeItem("studentUsername");
    sessionStorage.removeItem("loggedInStudent");
    navigate("/studentlogin", { replace: true });
  };

  const handleRunRandomForestPrediction = (e) => {
    e.preventDefault();
    const exposureByDirection = {
      "North-Bound (Morning Sun on Right)": (row, column) => ({
        high: column >= 4 && row >= 5,
        moderate: column >= 4,
      }),
      "South-Bound (Morning Sun on Left)": (row, column) => ({
        high: column <= 3 && row >= 5,
        moderate: column <= 3,
      }),
      "East-Bound (Direct Front Glare)": (row) => ({
        high: row <= 2,
        moderate: row <= 4,
      }),
      "West-Bound (Afternoon Sun Glare)": (row) => ({
        high: row >= 7,
        moderate: row >= 5,
      }),
    };
    const getExposure = exposureByDirection[travelDirection];
    const newMap = {};
    busMatrix.forEach((row) => {
      row.forEach((seat) => {
        const [seatRow, seatColumn] = seat.id.split(",").map(Number);
        const exposure = getExposure(seatRow, seatColumn);
        newMap[seat.id] = exposure.high
          ? "red"
          : exposure.moderate
            ? "yellow"
            : "green";
      });
    });
    setPredictedSunlightMap(newMap);
    setPredictionDone(true);
    setBookingMessage(`Sunlight prediction updated for ${travelDirection}.`);
  };

  const handleSeatClick = (rowIdx, colIdx, seat) => {
    if (!seatAvailabilityReady || bookingWindowClosed || seat.status === "disabled" || seat.status === "sold") return;
    const nextSelectedSeat = selectedSeat === seat.id ? null : seat.id;
    const updated = busMatrix.map((row, rIdx) =>
      row.map((s, cIdx) => {
        if (s.status === "sold") return s;
        return {
          ...s,
          status: rIdx === rowIdx && cIdx === colIdx && nextSelectedSeat ? "selected" : "available",
        };
      })
    );
    setBusMatrix(updated);
    setSelectedSeat(nextSelectedSeat);
  };

  const handleBookSeat = async () => {
    if (bookingWindowClosed) {
      setBookingMessage(`Today's ${tripTime.includes("Morning") ? "morning" : "evening"} bookings closed at ${bookingCutoffLabel} India time.`);
      return;
    }

    if (!selectedSeat) {
      setBookingMessage("Please select a seat from the layout first.");
      return;
    }

    const payload = {
      studentRollNo: student.rollNo,
      studentName: student.name,
      busNumber: student.busNumber,
      seatNumber: selectedSeat,
      bookingDate: bookingDate,
      tripTime: tripTime,
    };

    let res;
    try {
      res = await bookingsApi.create(payload);
    } catch (err) {
      console.error("Could not book the selected seat:", err);
      const message =
        err.response?.data?.seatNumber?.[0] ||
        err.response?.data?.tripTime?.[0] ||
        err.response?.data?.detail ||
        "Booking failed. Please try again.";
      setBookingMessage(message);
      if (message.includes("already booked")) {
        setBusMatrix((currentMatrix) =>
          currentMatrix.map((row) =>
            row.map((seat) => seat.id === selectedSeat ? { ...seat, status: "sold" } : seat)
          )
        );
        setSelectedSeat(null);
      }
      return;
    }

    const newBooking = {
      id: res.id,
      bookingId: `BK-${res.id}`,
      seatNo: selectedSeat,
      busNumber: student.busNumber,
      route: student.route,
      date: bookingDate,
      time: tripTime,
    };

    const updatedBookings = [...myBookings, newBooking];
    setMyBookings(updatedBookings);
    localStorage.setItem("studentBookings", JSON.stringify(updatedBookings));
    setBusMatrix(busMatrix.map(row => row.map(s => s.id === selectedSeat ? { ...s, status: "sold" } : s)));
    setBookingMessage(`Successfully booked seat [${selectedSeat}]!`);
    setSelectedSeat(null);
  };

  const handleCancelBooking = async (bookingId, seatNo, id, booking) => {
    if (isBookingCancellationClosed(booking)) {
      setBookingMessage(`Cancellation for this trip closed at ${booking.time?.includes("Morning") ? "7:30 AM" : "3:30 PM"} India time.`);
      return;
    }

    if (id) {
      try {
        await bookingsApi.delete(id);
      } catch (err) {
        console.error("Backend booking cancellation failed:", err);
        setBookingMessage("Cancellation failed. Please try again.");
        return;
      }
    }

    const updatedBookings = myBookings.filter(b => b.bookingId !== bookingId);
    setMyBookings(updatedBookings);
    localStorage.setItem("studentBookings", JSON.stringify(updatedBookings));
    if (
      booking?.busNumber === student.busNumber &&
      booking?.date === bookingDate &&
      booking?.time === tripTime
    ) {
      setBusMatrix((currentMatrix) =>
        currentMatrix.map((row) =>
          row.map((seat) => seat.id === seatNo ? { ...seat, status: "available" } : seat)
        )
      );
    }
    setBookingMessage(`Booking ${bookingId} cancelled.`);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <div style={styles.logoIcon}>🚌</div>
          <div>
            <h1 style={styles.headerTitle}>FISAT Student Portal</h1>
            <p style={styles.headerSubtitle}>Transport & Safety Management System</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: "6px" }}></i> Log out
        </button>
      </header>

      <div style={styles.heroBanner}>
        <div style={styles.heroOverlayContent}>
          <div style={styles.heroBadgeBox}>
            <h2 style={styles.heroTitle}>Student Transit & Seat Reservation</h2>
            <p style={styles.heroSubText}>Welcome back, {student.name} ({student.rollNo}) • FISAT Hormis Nagar Campus.</p>
          </div>
        </div>
      </div>

      <div style={styles.quickStatsContainer}>
        <div style={styles.statCard} onClick={() => setActiveTab("overview")}>
          <div style={styles.statIconWrapper}>🚌</div>
          <div>
            <h4 style={styles.statTitle}>Assigned Bus</h4>
            <p style={styles.statValue}>{student.busNumber}</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("tracking")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#1a73e8" }}><i className="fas fa-map-marked-alt"></i></div>
          <div>
            <h4 style={styles.statTitle}>Google Maps GPS</h4>
            <p style={styles.statValue}>11 Stops Live Tracking</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("seating")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#f59e0b" }}><i className="fas fa-chair"></i></div>
          <div>
            <h4 style={styles.statTitle}>Seat Booking</h4>
            <p style={styles.statValue}>ML Sunlight Predictor</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("bookings")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#6366f1" }}><i className="fas fa-ticket-alt"></i></div>
          <div>
            <h4 style={styles.statTitle}>My Bookings</h4>
            <p style={styles.statValue}>{myBookings.length} / 4 Weekly</p>
          </div>
        </div>
      </div>

      <div style={styles.tabWrapperOuter}>
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tabButton, ...(activeTab === "overview" ? styles.activeTab : {}) }} onClick={() => setActiveTab("overview")}>
            <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i> Route & Schedule
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "tracking" ? styles.activeTab : {}) }} onClick={() => setActiveTab("tracking")}>
            <i className="fas fa-map-marked-alt" style={{ marginRight: "8px" }}></i> Google Maps Live Tracking
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "seating" ? styles.activeTab : {}) }} onClick={() => setActiveTab("seating")}>
            <i className="fas fa-sun" style={{ marginRight: "8px" }}></i> ML Sunlight & Booking
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "bookings" ? styles.activeTab : {}) }} onClick={() => setActiveTab("bookings")}>
            <i className="fas fa-ticket-alt" style={{ marginRight: "8px" }}></i> My Bookings ({myBookings.length})
          </button>
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* Added Student Name & Profile Display Banner */}
        <div style={styles.studentProfileBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={styles.studentAvatarCircle}>
              <i className="fas fa-user-graduate"></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0c2340", fontWeight: "700" }}>{student.name}</h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>Roll No: <strong>{student.rollNo}</strong> | Class: <strong>{student.className}</strong> ({student.department})</p>
            </div>
          </div>
          <div style={styles.studentBadgeStatus}>
            <span style={styles.statusDot}></span> Verified Student
          </div>
        </div>

        {bookingMessage && (
          <div style={styles.alertBanner}>
            <span>{bookingMessage}</span>
            <button onClick={() => setBookingMessage("")} style={styles.closeAlert}>&times;</button>
          </div>
        )}

        {activeTab === "overview" && (
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><i className="fas fa-route" style={{ color: "#0c2340", marginRight: "8px" }}></i> Assigned Route Information</h3>
              <div style={styles.infoRow}><strong>Student Name:</strong> <span style={{ fontWeight: "bold", color: "#1a73e8" }}>{student.name}</span></div>
              <div style={styles.infoRow}><strong>Assigned Bus:</strong> <span>{student.busNumber}</span></div>
              <div style={styles.infoRow}><strong>Route Name:</strong> <span>{student.route}</span></div>
              <div style={styles.infoRow}><strong>Origin College:</strong> <span style={{ color: "#10b981", fontWeight: "bold" }}>Federal Institute of Science and Technology (FISAT), Hormis Nagar, Mookannoor, Angamaly</span></div>
              <div style={styles.infoRow}><strong>Boarding Stop:</strong> <span>{student.stop}</span></div>
              <div style={styles.infoRow}><strong>Department / Class:</strong> <span>{student.department} - {student.className}</span></div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}><i className="fas fa-clock" style={{ color: "#0c2340", marginRight: "8px" }}></i> Daily Transit Schedule</h3>
              <ul style={styles.scheduleList}>
                <li><strong>Dispatch (FISAT Campus):</strong> 07:45 AM</li>
                <li><strong>Route Stops:</strong> Origin and destination from the registered bus</li>
                <li><strong>Evening Return:</strong> 04:15 PM from Angamaly / City</li>
                <li><strong>Status:</strong> <span style={{ color: "#10b981", fontWeight: "bold" }}>Active GPS Service</span></li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div style={styles.card}>
            <div style={styles.googleMapHeaderBar}>
              <div>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}><i className="fas fa-map-marked-alt" style={{ color: "#1a73e8", marginRight: "8px" }}></i> Live Transit for {student.name} ({student.busNumber})</h3>
                <p style={{ ...styles.subText, margin: "4px 0 0 0" }}>
                  {trackingBus
                    ? <><strong>{trackingBus.startingPlace}</strong> to <strong>{trackingBus.endingPlace}</strong>, matching the registered bus route.</>
                    : "Loading the assigned route from the bus database..."}
                </p>
              </div>
              <div style={styles.googleRouteBadge}>
                <span>Distance to {student.stop}: <strong>{studentStopDistance}</strong></span>
                <span>ETA to {student.stop}: <strong style={{color: "#1a73e8"}}>{studentStopEta}</strong></span>
              </div>
            </div>

            {trackingError && (
              <div role="alert" style={{ color: "#b91c1c", background: "#fee2e2", padding: "10px 12px", borderRadius: "6px", marginBottom: "12px" }}>
                {trackingError}
              </div>
            )}
            <div style={styles.nextStopLiveBanner}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={styles.pulseIndicator}></span>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Your Registered Stop:</span>
                  <div style={{ fontSize: "1.05rem", fontWeight: "bold", color: "#1a73e8" }}>
                    {studentStopReached
                      ? `Arrived at ${student.stop}`
                      : student.stop || trackingError || "Loading your registered stop..."}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.googleMapWrapper}>
              <div ref={mapRef} style={{ width: "100%", height: "450px", borderRadius: "10px", zIndex: 1 }}></div>
            </div>
          </div>
        )}

        {activeTab === "seating" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><i className="fas fa-sun" style={{ color: "#0c2340", marginRight: "8px" }}></i> Random Forest Sunlight Intensity Predictor</h3>
            <form onSubmit={handleRunRandomForestPrediction} style={styles.mlFormBoxSingle}>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-compass" style={{ marginRight: "5px" }}></i> Direction</label>
                <select value={travelDirection} onChange={(e) => setTravelDirection(e.target.value)} style={styles.configInput}>
                  <option value="North-Bound (Morning Sun on Right)">North-Bound (Morning Sun on Right)</option>
                  <option value="South-Bound (Morning Sun on Left)">South-Bound (Morning Sun on Left)</option>
                  <option value="East-Bound (Direct Front Glare)">East-Bound (Direct Front Glare)</option>
                  <option value="West-Bound (Afternoon Sun Glare)">West-Bound (Afternoon Sun Glare)</option>
                </select>
              </div>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-calendar-alt" style={{ marginRight: "5px" }}></i> Date</label>
                <input type="date" min={getTodayString()} max={getTomorrowString()} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={styles.configInput} />
              </div>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-clock" style={{ marginRight: "5px" }}></i> Time Slot</label>
                <select value={tripTime} onChange={(e) => setTripTime(e.target.value)} style={styles.configInput}>
                  <option value="Morning (07:45 AM)">Morning (07:45 AM)</option>
                  <option value="Evening (04:15 PM)">Evening (04:15 PM)</option>
                </select>
              </div>
              <div style={{ textAlign: "center" }}>
                <button type="submit" style={styles.mlPredictBtn}>
                  <i className="fas fa-brain" style={{ marginRight: "8px" }}></i> Predict Sunlight
                </button>
              </div>
            </form>

            {predictionDone && (
              <div style={styles.busLayoutBox}>
                <div style={styles.busFrontIndicator}>Front of bus (FISAT College Dispatch)</div>

                <div style={styles.legendContainer}>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#4ade80", border: "2px solid #166534" }}></div>
                    <span>Recommended (Shade)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#fde047", border: "2px solid #a16207" }}></div>
                    <span>Moderate Sun</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#fca5a5", border: "2px solid #b91c1c" }}></div>
                    <span>Not Recommended (Glare)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#a5f3fc", border: "2px solid #06b6d4" }}></div>
                    <span>Already Booked</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#1e3a8a", border: "2px solid #0f172a" }}></div>
                    <span>Selected Seat</span>
                  </div>
                </div>

                {!seatAvailabilityReady && (
                  <p role="status" style={{ textAlign: "center" }}>
                    {seatAvailabilityError
                      ? "Seat availability is unavailable. Booking is disabled; refresh or change the trip to retry."
                      : "Loading seat availability..."}
                  </p>
                )}

                {bookingWindowClosed && (
                  <p role="status" style={{ textAlign: "center" }}>
                    Booking for today's {tripTime.includes("Morning") ? "morning" : "evening"} trip closed at {bookingCutoffLabel} India time.
                  </p>
                )}

                <div style={styles.busSeatMatrix}>
                  {busMatrix.map((row, rIndex) => (
                    <div key={rIndex} style={styles.busRow}>
                      <div style={styles.seatGroup}>
                        {row.slice(0, 3).map((seat, cIndex) => {
                          const sunlightTag = predictedSunlightMap[seat.id];
                          let bg = "#ffffff", border = "2px solid #22c55e", cursor = seatAvailabilityReady ? "pointer" : "not-allowed";
                          if (seat.status === "disabled") { bg = "#6b7280"; border = "2px solid #4b5563"; cursor = "not-allowed"; }
                          else if (seat.status === "sold") { bg = "#a5f3fc"; border = "2px solid #06b6d4"; cursor = "not-allowed"; }
                          else if (seat.status === "selected") { bg = "#1e3a8a"; border = "2px solid #0f172a"; }
                          else {
                            if (sunlightTag === "green") { bg = "#4ade80"; border = "2px solid #166534"; }
                            else if (sunlightTag === "yellow") { bg = "#fde047"; border = "2px solid #a16207"; }
                            else if (sunlightTag === "red") { bg = "#fca5a5"; border = "2px solid #b91c1c"; }
                          }
                          return <div key={seat.id} onClick={() => handleSeatClick(rIndex, cIndex, seat)} style={{ ...styles.seatSquare, backgroundColor: bg, border, cursor }} />;
                        })}
                      </div>
                      <div style={styles.aisleSpace}></div>
                      <div style={styles.seatGroup}>
                        {row.slice(3, 6).map((seat, cIndex) => {
                          const actualCol = cIndex + 3;
                          const sunlightTag = predictedSunlightMap[seat.id];
                          let bg = "#ffffff", border = "2px solid #22c55e", cursor = seatAvailabilityReady ? "pointer" : "not-allowed";
                          if (seat.status === "disabled") { bg = "#6b7280"; border = "2px solid #4b5563"; cursor = "not-allowed"; }
                          else if (seat.status === "sold") { bg = "#a5f3fc"; border = "2px solid #06b6d4"; cursor = "not-allowed"; }
                          else if (seat.status === "selected") { bg = "#1e3a8a"; border = "2px solid #0f172a"; }
                          else {
                            if (sunlightTag === "green") { bg = "#4ade80"; border = "2px solid #166534"; }
                            else if (sunlightTag === "yellow") { bg = "#fde047"; border = "2px solid #a16207"; }
                            else if (sunlightTag === "red") { bg = "#fca5a5"; border = "2px solid #b91c1c"; }
                          }
                          return <div key={seat.id} onClick={() => handleSeatClick(rIndex, actualCol, seat)} style={{ ...styles.seatSquare, backgroundColor: bg, border, cursor }} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button onClick={handleBookSeat} disabled={!seatAvailabilityReady || !selectedSeat || bookingWindowClosed} style={styles.showSelectedBtn}>Confirm Reservation for {student.name}</button>
                  <div style={{ marginTop: "10px", fontFamily: "monospace", fontSize: "1rem" }}>{selectedSeat ? `[${selectedSeat.replace(",", "][")}]` : "[None Selected]"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><i className="fas fa-ticket-alt" style={{ color: "#0c2340", marginRight: "8px" }}></i> Manage Bookings for {student.name} ({myBookings.length} / 4 Active)</h3>
            {myBookings.length === 0 ? (
              <p style={styles.subText}>You have no active seat bookings yet.</p>
            ) : (
              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Booking ID</th>
                      <th style={styles.th}>Student</th>
                      <th style={styles.th}>Bus No</th>
                      <th style={styles.th}>Route</th>
                      <th style={styles.th}>Seat</th>
                      <th style={styles.th}>Date & Slot</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.map((b) => (
                      <tr key={b.bookingId}>
                        <td style={styles.td}>{b.bookingId}</td>
                        <td style={styles.td}><strong>{student.name}</strong></td>
                        <td style={styles.td}>{b.busNumber}</td>
                        <td style={styles.td}>{b.route}</td>
                        <td style={styles.td}><strong>[{b.seatNo.replace(",", "][")}]</strong></td>
                        <td style={styles.td}>{b.date} <br/><small style={{color: "#1a73e8"}}>{b.time}</small></td>
                        <td style={styles.td}>
                          {isBookingCancellationClosed(b) ? (
                            <span style={{ color: "#64748b", fontSize: "0.82rem" }}>Cancellation closed</span>
                          ) : (
                            <button onClick={() => handleCancelBooking(b.bookingId, b.seatNo, b.id, b)} style={styles.cancelBtn}>Cancel</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { 
    minHeight: "100vh", 
    backgroundImage: `linear-gradient(rgba(244, 247, 246, 0.88), rgba(244, 247, 246, 0.88)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundAttachment: "fixed", 
    fontFamily: "'Inter', 'Segoe UI', sans-serif" 
  },
  header: { backgroundColor: "#0c2340", color: "#ffffff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  headerTitleContainer: { display: "flex", alignItems: "center", gap: "15px" },
  logoIcon: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#ffc107", color: "#0c2340", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.4rem" },
  headerTitle: { margin: 0, fontSize: "1.3rem", fontWeight: 800 },
  headerSubtitle: { margin: "2px 0 0 0", fontSize: "0.8rem", color: "#cbd5e1" },
  logoutBtn: { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 },
  heroBanner: { 
    position: "relative", 
    width: "100%", 
    height: "320px", 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    display: "flex", 
    alignItems: "flex-end", 
    padding: "30px 40px" 
  },
  heroOverlayContent: { maxWidth: "1200px", width: "100%", margin: "0 auto" },
  heroBadgeBox: { backgroundColor: "rgba(12, 35, 64, 0.85)", backdropFilter: "blur(6px)", padding: "20px 25px", borderRadius: "12px", borderLeft: "5px solid #ffc107", maxWidth: "600px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  heroTitle: { color: "#ffffff", margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: 700 },
  heroSubText: { color: "#e2e8f0", margin: 0, fontSize: "0.9rem" },
  quickStatsContainer: { maxWidth: "1200px", margin: "-30px auto 20px auto", padding: "0 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", position: "relative", zIndex: 10 },
  statCard: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "20px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" },
  statIconWrapper: { width: "45px", height: "45px", borderRadius: "10px", backgroundColor: "#0c2340", color: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.3rem" },
  statTitle: { margin: "0", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" },
  statValue: { margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" },
  tabWrapperOuter: { backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)", borderBottom: "1px solid #e2e8f0", marginTop: "20px" },
  tabContainer: { display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "0 40px", justifyContent: "center", gap: "20px" },
  tabButton: { padding: "15px 20px", border: "none", background: "transparent", fontSize: "0.95rem", fontWeight: 600, color: "#64748b", cursor: "pointer", borderBottom: "3px solid transparent", flex: 1, maxWidth: "260px" },
  activeTab: { color: "#0c2340", borderBottomColor: "#1a73e8" },
  mainContent: { maxWidth: "1200px", margin: "30px auto", padding: "0 40px" },
  studentProfileBar: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "18px 25px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "5px solid #1a73e8" },
  studentAvatarCircle: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#eff6ff", color: "#1a73e8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", border: "1px solid #bfdbfe" },
  studentBadgeStatus: { backgroundColor: "#f0fdf4", color: "#166534", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "6px" },
  statusDot: { width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block" },
  card: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", marginBottom: "30px" },
  cardTitle: { margin: "0 0 20px 0", fontSize: "1.2rem", fontWeight: 700, color: "#0c2340", display: "flex", alignItems: "center" },
  cardGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" },
  infoRow: { marginBottom: "12px", fontSize: "0.95rem", color: "#334155", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" },
  scheduleList: { paddingLeft: "20px", color: "#334155", lineHeight: "1.8", margin: 0 },
  alertBanner: { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600" },
  closeAlert: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#1e40af" },
  googleMapHeaderBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" },
  googleRouteBadge: { display: "flex", gap: "15px", backgroundColor: "#f8fafc", padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem" },
  nextStopLiveBanner: { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 20px", borderRadius: "8px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pulseIndicator: { width: "12px", height: "12px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 0 rgba(34, 197, 94, 0.4)", animation: "pulse 1.5s infinite" },
  googleMapWrapper: { position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #cbd5e1" },
  mlFormBoxSingle: { display: "grid", gridTemplateColumns: "repeat(3, 1fr) auto", gap: "15px", alignItems: "flex-end", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" },
  configField: { display: "flex", flexDirection: "column", gap: "6px" },
  configLabel: { fontSize: "0.85rem", fontWeight: "600", color: "#475569" },
  configInput: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" },
  mlPredictBtn: { backgroundColor: "#1a73e8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", height: "41px" },
  busLayoutBox: { backgroundColor: "#f8fafc", padding: "25px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "20px" },
  busFrontIndicator: { textAlign: "center", backgroundColor: "#0c2340", color: "#ffffff", padding: "8px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", marginBottom: "20px" },
  legendContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px", margin: "15px 0 25px 0", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#334155", fontWeight: "600" },
  legendBox: { width: "16px", height: "16px", borderRadius: "4px" },
  busSeatMatrix: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" },
  busRow: { display: "flex", alignItems: "center", gap: "25px" },
  seatGroup: { display: "flex", gap: "8px" },
  aisleSpace: { width: "30px" },
  seatSquare: { width: "36px", height: "36px", borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.75rem", fontWeight: "bold", transition: "all 0.2s" },
  showSelectedBtn: { backgroundColor: "#10b981", color: "#ffffff", border: "none", padding: "12px 25px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem" },
  tableResponsive: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px", backgroundColor: "#f1f5f9", color: "#475569", fontSize: "0.85rem", borderBottom: "2px solid #cbd5e1" },
  td: { padding: "12px", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#334155" },
  cancelBtn: { backgroundColor: "#ef4444", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "0.80rem" },
  subText: { color: "#64748b", fontSize: "0.95rem", margin: 0 }
};