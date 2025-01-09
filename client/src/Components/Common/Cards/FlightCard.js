import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight, formatTime, getFlightDuration, cancelBooking }) => {
    // Extract segments of the flight itinerary (each leg of the flight)
    const segments = flight.itineraries[0].segments;

    // Assuming that the carrierCode in the first segment refers to the airline
    const airline = segments[0]?.carrierCode;

    // Format departure and arrival times using the formatTime function
    const departureTime = formatTime(segments[0].departure.at);
    const arrivalTime = formatTime(segments[segments.length - 1].arrival.at);

    // Get the total flight duration using the getFlightDuration function
    const flightDuration = getFlightDuration(flight);

    // Initialize the useNavigate hook to navigate between pages
    const navigate = useNavigate();

    // Convert total flight duration (in minutes) to hours and minutes
    const hours = Math.floor(flightDuration / 60); // Calculate full hours
    const minutes = flightDuration % 60; // Calculate remaining minutes

    // Handle selecting a flight by navigating to the flight details page
    const handleSelect = () => {
        navigate(`/flight-details/${flight.id}`, { state: { flight } });
    };

    // Format a word by capitalizing the first letter of each word
    const formatWord = (word) => {
        return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

  return (
    <div className="p-5 rounded-xl bg-blue-100 shadow shadow-white flex flex-col gap-5">
        {/* Main flight details section */}
        <div className="flex justify-between items-start">
            <div>
                {/* Display departure and arrival times */}
                <p className="text-lg font-Roboto">{`${departureTime} - ${arrivalTime}`}</p>
                {/* Display departure and arrival city names with proper capitalization */}
                <p className="font-serif flex-wrap">
                    {formatWord(segments[0]?.departure.cityName)} ~ {formatWord(segments[segments.length - 1]?.arrival.cityName)}
                </p>
                {/* Display airline name */}
                <p>{airline} Airline</p>
                <div className="flex items-center gap-1">
                    {/* Display total flight price */}
                    <p>{flight.price.total}</p>
                    {/* Display currency of the price */}
                    <p className="text-sm font-serif">{flight.price.currency}</p>
                </div>
            </div>
            <div className='flex flex-col sm:gap-3 gap-2 items-start'>
                {/* Display flight duration in hours and minutes */}
                <div className="bg-white py-1 px-3 rounded-md text-[0.8rem] w-fit text-nowrap">
                    {`${hours}h ${minutes}m`}
                </div>
                {/* Display the number of stops in the flight */}
                <div className='bg-white rounded-md px-3 py-1 text-[0.8rem] font-Grotesk w-fit text-nowrap flex items-center gap-1'>
                    <p>{`${segments[0]?.numberOfStops}`}</p>
                    {/* Display "stop" or "stops" based on the number of stops */}
                    <p>{segments[0]?.numberOfStops > 1 ? 'stops' : 'stop'}</p>
                </div>
            </div>
        </div>
        {/* Conditionally render either "Cancel" or "Select" button */}
        {cancelBooking 
            ? (
                <button
                    type="button"
                    onClick={() => cancelBooking(flight.id)} // Trigger cancelBooking if available
                    className="border-2 border-white px-5 py-1 bg-blue-100 w-fit self-center rounded-full font-semibold font-Grotesk text-sm"
                >
                    Cancel
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleSelect} // Navigate to flight details when "Select" is clicked
                    className="border-2 border-white px-5 py-1 bg-blue-100 w-fit self-center rounded-full font-semibold font-Grotesk text-sm"
                >
                    Select
                </button>
            )
        }
    </div>
  );
};

export default FlightCard;