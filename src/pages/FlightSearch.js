import { useEffect, useState } from "react";
import axios from "axios";
import FlightCard from "../components/FlightCard";
import BookingModal from "../pages/BookingModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FlightSearch = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [query, setQuery] = useState({
    origin: "",
    destination: "",
    date: "",
    minPrice: "",
    maxPrice: "",
    airline: "",
    sortBy: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const api = "https://tentwenty-backend.onrender.com/api";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToMyBookings = () => {
    navigate("/bookings");
  };

  const fetchFlights = async (paramsObj = null) => {
    setLoading(true);
    setError("");
    try {
      let url = `${api}/flights`;
      if (paramsObj) {
        const params = new URLSearchParams(paramsObj).toString();
        url = `${api}/flights/search?${params}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFlights(res.data.data || []);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const searchFlights = (e) => {
    e.preventDefault();
    const paramsObj = {};
    Object.keys(query).forEach((key) => {
      if (query[key]) paramsObj[key] = query[key];
    });
    fetchFlights(paramsObj);
  };

  const handleBookingConfirm = async (flightId, passengers) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${api}/bookings`,
        { flightId, passengers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successful!");
      setSelectedFlight(null);
      fetchFlights();
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={goToMyBookings}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          My Bookings
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={searchFlights}
        className="flex flex-col md:flex-row gap-2 mb-6 flex-wrap"
      >
        <input
          placeholder="From"
          value={query.origin}
          onChange={(e) => setQuery({ ...query, origin: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="To"
          value={query.destination}
          onChange={(e) => setQuery({ ...query, destination: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={query.date}
          onChange={(e) => setQuery({ ...query, date: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={query.minPrice}
          onChange={(e) => setQuery({ ...query, minPrice: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={(e) => setQuery({ ...query, maxPrice: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Airline"
          value={query.airline}
          onChange={(e) => setQuery({ ...query, airline: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={query.sortBy}
          onChange={(e) => setQuery({ ...query, sortBy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="departure_asc">Departure: Earliest</option>
          <option value="departure_desc">Departure: Latest</option>
          <option value="duration">Duration</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 md:mt-0"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flights.map((f) => (
          <FlightCard key={f._id} flight={f} onBook={() => setSelectedFlight(f)} />
        ))}
        {flights.length === 0 && !loading && <p>No flights found.</p>}
      </div>

      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default FlightSearch;
