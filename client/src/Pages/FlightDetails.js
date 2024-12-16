import { ArrowRight, CheckCheck, ChevronRight } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state;
  // Helper to calculate total duration in minutes
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime();
    return (arrivalTime - departureTime) / (1000 * 60); // Convert to minutes
  };
  const flightDuration = getFlightDuration(flight);

  // Convert total minutes to hours and remaining minutes
  const hours = Math.floor(flightDuration / 60);
  const minutes = flightDuration % 60;

  const tax = parseFloat(flight.price.total) * 0.1; // Calculate 10% tax
  const total = parseFloat(flight.price.total) + tax;

  const proceedToCheckOut = () => {
    navigate('/check-out', { state: { flight, tax, total } });
  };

  // Helper to format time
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  }).format(new Date(date));

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const formatWord = (word) => {
    return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center lg:items-start gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10">
      <div className='flex items-center lg:gap-3 gap-2 flex-wrap max-lg:text-sm'>
        <p>{formatWord(flight.itineraries[0].segments[0].departure.cityName)}</p>
        <ArrowRight className='p-1'/>
        <p>{formatWord(flight.itineraries[0].segments.slice(-1)[0].arrival.cityName)}</p>
        <ChevronRight className='p-1'/>
        <p>{flight.itineraries[0].segments[0].carrierCode} Airline</p>
        <ChevronRight className='p-1'/>
        <p>Review your trip</p>
      </div>
      <div className='flex max-lg:flex-col-reverse w-full max-lg:items-center justify-between items-start lg:gap-20 gap-5'>
        <div className='flex flex-col gap-5 flex-1 max-w-full'>
          <div className='bg-blue-50 rounded-xl p-5 flex flex-col gap-1 w-full'>
            <div className='font-semibold font-Grotesk text-lg'>
              {`${formatWord(flight.itineraries[0].segments[0].departure.cityName)} to 
              ${formatWord(flight.itineraries[0].segments.slice(-1)[0].arrival.cityName)}`}
            </div>
            <div className='flex items-center gap-2'>
              <p>
                {`${formatTime(flight.itineraries[0].segments[0].departure.at)} - 
                ${formatTime(flight.itineraries[0].segments.slice(-1)[0].arrival.at)}`}
              </p>
              <div className='flex items-center gap-1'>
                <div>({`${hours}h ${minutes}m`},</div>
                <div className='flex items-center gap-1'>
                  <p>{`${flight.itineraries[0].segments[0]?.numberOfStops}`}</p>
                  <p>{flight.itineraries[0].segments[0]?.numberOfStops > 1 ? 'stops' : 'stop'})</p>
                </div>
              </div>
            </div>
            <div>
              {flight.itineraries[0].segments[0].carrierCode} Airline • {formatDate(flight.itineraries[0].segments[0].departure.at)}
            </div>
          </div>
          <div className='flex flex-col gap-2 p-5 bg-blue-50 rounded-xl w-full'>
            <h1 className='font-semibold font-Grotesk text-lg'>
              Your fare: {formatWord(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)}
            </h1>
            <div className='flex flex-col gap-2'>
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white rounded-full'/> 
                <p>Seat choice included</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white rounded-full'/> 
                <p>2 check bags included (30 Kg per bag)</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white rounded-full'/> 
                <p>Cancellation fee applies</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 rounded-xl p-5 flex flex-col gap-3 w-96 max-w-full'>
          <h1 className='text-lg font-semibold font-Grotesk'>Payment summary</h1>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <p>Flight</p>
              <p>${flight.price.total}</p>
            </div>
            <div className='flex items-center justify-between'>
              <p>Taxes & fees</p>
              <p>${tax.toFixed(2)}</p>
            </div>
            <div className='flex items-center justify-between border-t-2 border-white py-3 mt-3'>
              <p className='font-semibold font-Grotesk'>Trip total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
          <button
            type="button"
            className='bg-[#48aadf] rounded-full py-2 w-full font-semibold cursor-pointer text-white'
            onClick={proceedToCheckOut}
          >
            Check out
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;