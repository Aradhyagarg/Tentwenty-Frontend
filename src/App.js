import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";
import MyBookings from "./pages/MyBookings";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <FlightSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;