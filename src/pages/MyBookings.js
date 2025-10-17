import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://tentwenty-backend.onrender.com/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (!user) return <p className="p-8">Loading...</p>;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "N/A";

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "N/A";

  return (
    <div className="p-8">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => navigate("/search")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search Flights
        </button>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((b) => {
        const departure = b.flight.departure ? new Date(b.flight.departure) : null;
        const arrival = b.flight.arrival ? new Date(b.flight.arrival) : null;

        return (
          <div key={b._id} className="border p-4 rounded mb-3">
            <p>
              <strong>{b.flight.flightNumber}</strong> — {b.flight.origin} ➡ {b.flight.destination}
            </p>
            <p>Date: {formatDate(departure)}</p>
            <p>Departure: {formatTime(departure)}</p>
            <p>Arrival: {formatTime(arrival)}</p>
            <p>Price: ₹{b.totalAmount}</p>
            <p>Seats: {b.passengers.map((p) => p.seatNumber).join(", ")}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
