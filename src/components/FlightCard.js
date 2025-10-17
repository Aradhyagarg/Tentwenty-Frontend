const FlightCard = ({ flight, onBook }) => {
  const departure = flight.departure ? new Date(flight.departure) : null;
  const arrival = flight.arrival ? new Date(flight.arrival) : null;

  const formatDate = (d) =>
    d && !isNaN(d.getTime())
      ? d.toLocaleDateString("en-GB")
      : "N/A";

  const formatTime = (d) =>
    d && !isNaN(d.getTime())
      ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      : "N/A";

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{flight.airline} - {flight.flightNumber}</h3>
      <p>
        {flight.origin} → {flight.destination}
      </p>
      <p>Date: {formatDate(departure)}</p>
      <p>Departure: {formatTime(departure)}</p>
      <p>Arrival: {formatTime(arrival)}</p>
      <p>Price: ₹{flight.price}</p>
      <button
        onClick={onBook}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book
      </button>
    </div>
  );
};

export default FlightCard;
