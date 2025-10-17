import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/search"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
        >
          Search Flights
        </Link>

        <Link
          to="/bookings"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center"
        >
          My Bookings
        </Link>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
