import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight, formatTime, getFlightDuration }) => {
    const segments = flight.itineraries[0].segments;
    const airline = segments[0]?.carrierCode; // Assuming carrierCode maps to the airline name
    const departureTime = formatTime(segments[0].departure.at);
    const arrivalTime = formatTime(segments[segments.length - 1].arrival.at);
    const flightDuration = getFlightDuration(flight);
    const navigate = useNavigate();

    // Convert total minutes to hours and remaining minutes
    const hours = Math.floor(flightDuration / 60);
    const minutes = flightDuration % 60;

    const handleSelect = () => {
        navigate('/flight-details', { state: { flight } });
    };

    const formatWord = (word) => {
        return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

  return (
    <div className="p-5 rounded-xl bg-blue-50 flex flex-col gap-5 shadow shadow-gray-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-Roboto">{`${departureTime} - ${arrivalTime}`}</p>
                <p className="font-serif flex-wrap">
                    {formatWord(segments[0]?.departure.cityName)} ~ {formatWord(segments[segments.length - 1]?.arrival.cityName)}
                </p>
                <p>{airline} Airline</p>
                <div className="flex items-center gap-1">
                    <p>{flight.price.total}</p>
                    <p className="text-sm font-serif">{flight.price.currency}</p>
                </div>
            </div>
            <div className='flex flex-col sm:gap-3 gap-2 items-start'>
                <div className="bg-white py-1 px-3 rounded-md text-[0.8rem] w-fit text-nowrap">
                    {`${hours}h ${minutes}m`}
                </div>
                <div className='bg-white rounded-md px-3 py-1 text-[0.8rem] font-Grotesk w-fit text-nowrap flex items-center gap-1'>
                    <p>{`${segments[0]?.numberOfStops}`}</p>
                    <p>{segments[0]?.numberOfStops > 1 ? 'stops' : 'stop'}</p>
                </div>
            </div>
        </div>
        <button
            type="button"
            onClick={handleSelect}
            className="border-2 border-white px-5 py-1 bg-blue-50 w-fit self-center rounded-full font-semibold font-Grotesk text-sm"
        >
            Select
        </button>
    </div>
  );
};

export default FlightCard;