import { useState, useEffect } from "react";
import { X, AlertCircle, Check } from "lucide-react";

const BookingModal = ({ flight, onClose, onConfirm }) => {
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', age: '', gender: 'Male', seatNumber: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
          `https://tentwenty-backend.onrender.com/api/flights/${flight._id}/booked-seats`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          setBookedSeats(data.data.bookedSeats);
          console.log(`Fetched ${data.data.totalBooked} booked seats for flight ${flight.flightNumber}`);
        } else {
          console.error("Failed to fetch booked seats:", data.message);
        }
      } catch (err) {
        console.error("Error fetching booked seats:", err);
      }
    };

    fetchBookedSeats();
  }, [flight._id]);

  const addPassenger = () => {
    if (passengers.length < flight.availableSeats) {
      setPassengers([...passengers, { firstName: '', lastName: '', age: '', gender: 'Male', seatNumber: '' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSeatSelect = (passengerIndex, seat) => {
    if (bookedSeats.includes(seat)) {
      return; 
    }
    const isSelectedByOther = passengers.some(
      (p, idx) => idx !== passengerIndex && p.seatNumber === seat
    );

    if (isSelectedByOther) {
      setError(`Seat ${seat} is already selected by another passenger in this booking`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    updatePassenger(passengerIndex, 'seatNumber', seat);
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missingSeats = passengers.some(p => !p.seatNumber);
    if (missingSeats) {
      setError('Please select seats for all passengers');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(flight._id, passengers);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const rows = 10;
  const cols = 6;
  const totalAmount = flight.price * passengers.length;
  const seatLabel = (r, c) => `${r + 1}${String.fromCharCode(65 + c)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Book Flight</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{flight.airline} - {flight.airlineCode} {flight.flightNumber}</p>
                <p className="text-sm text-gray-600">{flight.origin} → {flight.destination}</p>
              </div>
              <p className="text-xl font-bold text-blue-600">₹{flight.price}/person</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {passengers.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Passenger {i + 1}</h3>
                  {passengers.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePassenger(i)} 
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={p.firstName} 
                    onChange={(e) => updatePassenger(i, 'firstName', e.target.value)} 
                    required 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={p.lastName} 
                    onChange={(e) => updatePassenger(i, 'lastName', e.target.value)} 
                    required 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <input 
                    type="number" 
                    placeholder="Age" 
                    value={p.age} 
                    onChange={(e) => updatePassenger(i, 'age', e.target.value)} 
                    required 
                    min="1" 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <select 
                    value={p.gender} 
                    onChange={(e) => updatePassenger(i, 'gender', e.target.value)} 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Select Seat</h4>
                    {p.seatNumber && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Selected: {p.seatNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                      <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                      <span className="text-gray-600">Booked</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
                      {Array.from({ length: rows }).map((_, r) =>
                        Array.from({ length: cols }).map((_, c) => {
                          const seat = seatLabel(r, c);
                          const isBooked = bookedSeats.includes(seat);
                          const isSelected = p.seatNumber === seat;
                          const isSelectedByOtherPassenger = passengers.some(
                            (passenger, idx) => idx !== i && passenger.seatNumber === seat
                          );

                          return (
                            <button
                              key={seat}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatSelect(i, seat)}
                              className={`
                                px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all
                                ${isBooked
                                  ? "bg-gray-400 text-gray-200 cursor-not-allowed border-gray-400"
                                  : isSelected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : isSelectedByOtherPassenger
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                                }
                              `}
                              title={
                                isBooked 
                                  ? "Already booked" 
                                  : isSelectedByOtherPassenger
                                  ? "Selected by another passenger"
                                  : isSelected
                                  ? "Your selected seat"
                                  : "Click to select"
                              }
                            >
                              {seat}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < flight.availableSeats && (
              <button
                type="button"
                onClick={addPassenger}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 mb-6 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition font-medium"
              >
                + Add Another Passenger
              </button>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Passengers:</span>
                <span className="font-semibold">{passengers.length}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Price per person:</span>
                <span className="font-semibold">₹{flight.price}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300">
                <span className="text-gray-800">Total Amount:</span>
                <span className="text-blue-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;