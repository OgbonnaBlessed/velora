import React from 'react';
import { useLocation } from 'react-router-dom';

const FlightDetails = () => {
  const location = useLocation();
  const { flight } = location.state;

  const segments = flight.itineraries[0].segments;

  const handleBooking = () => {
    // Implement booking logic based on Amadeus API
    console.log('Booking flight:', flight);
  };

  return (
    <div className="flex flex-col gap-10 px-8 py-5 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold">Flight Details</h1>

        <div className="flex flex-col gap-5 bg-white shadow p-5 rounded-lg">
            <p>
                <strong>Airline:</strong> {segments[0]?.carrierCode} Airline
            </p>
            <p>
            <strong>From:</strong> {segments[0]?.departure.cityName} ({segments[0]?.departure.iataCode})
            </p>
            <p>
            <strong>To:</strong> {segments[segments.length - 1]?.arrival.cityName} ({segments[segments.length - 1]?.arrival.iataCode})
            </p>
            <p>
            <strong>Departure Time:</strong> {segments[0]?.departure.at}
            </p>
            <p>
            <strong>Arrival Time:</strong> {segments[segments.length - 1]?.arrival.at}
            </p>
            <p>
            <strong>Duration:</strong> {flight.itineraries[0]?.duration}
            </p>
            <p>
            <strong>Price:</strong> {flight.price.total} {flight.price.currency}
            </p>
        </div>

        <button
            onClick={handleBooking}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg w-fit self-start"
        >
            Book Flight
        </button>
    </div>
  );
};

export default FlightDetails;