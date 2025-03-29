import { ArrowRight, CheckCheck, ChevronRight, Loader2 } from 'lucide-react'; // Importing icons from lucide-react library
import React, { useEffect, useState } from 'react'; // Importing React
import { useLocation, useNavigate } from 'react-router-dom'; // Importing hooks for routing
import { motion } from 'framer-motion'; // Importing motion for page transitions with framer-motion library
import { BounceLoader } from 'react-spinners';
import { formatDate, formatTime } from '../../Components/Common/helpers/functions';

const FlightDetails = () => {
  const location = useLocation(); // Hook to access the current location (used to retrieve flight data passed via state)
  const navigate = useNavigate(); // Hook to navigate to different routes programmatically
  const { flight } = location.state; // Destructuring the flight data passed from the previous page
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 5000);
  }, [])

  // Helper function to calculate the total flight duration in minutes
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments; // Extracting segments from the flight itinerary
    const departureTime = new Date(segments[0].departure.at).getTime(); // Getting the departure time in milliseconds
    const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime(); // Getting the arrival time in milliseconds
    return (arrivalTime - departureTime) / (1000 * 60); // Converting the time difference from milliseconds to minutes
  };

  const flightDuration = getFlightDuration(flight); // Calculating the total flight duration

  // Converting total minutes to hours and remaining minutes
  const hours = Math.floor(flightDuration / 60); // Getting the number of full hours
  const minutes = flightDuration % 60; // Getting the remaining minutes after hours calculation

  // Calculating tax (10%) based on the flight total price
  const tax = parseFloat(flight.price.total) * 0.1;
  const total = parseFloat(flight.price.total) + tax; // Total price including tax

  // Function to handle navigation to the checkout page, passing flight and price details via state
  const proceedToCheckOut = () => {
    setLoading(true);
    setTimeout(() => {
      setTimeout(() => {
        navigate(`/flight-check-out`, { state: { flight, tax, total } });
      }, 1000);

      setLoading(false);
    }, 5000);
  };

  // Helper function to format words with capitalized initials
  const formatWord = (word) => {
    return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (pageLoading) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center'>
        <BounceLoader
          color="#48aadf"
          loading={pageLoading}
        />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} // Setting initial opacity to 0 for fade-in effect
      animate={{ opacity: 1 }} // Setting final opacity to 1
      exit={{ opacity: 0 }} // Setting exit opacity to 0 for fade-out effect
      transition={{
        duration: .5, // Duration of the animation
        ease: "easeInOut" // Easing function for smooth animation
      }}
      className="flex flex-col items-center lg:items-start gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 bg-white"
    >
      {/* This div contains the main layout and animations for the FlightDetails component */}
      <div className='flex items-center lg:gap-3 gap-2 flex-wrap max-lg:text-sm'>
        {/* This section displays the flight route (departure and arrival cities, and carrier) */}
        <p>{formatWord(flight.itineraries[0].segments[0].departure.cityName)}</p>
        <ArrowRight className='p-1'/>
        <p>{formatWord(flight.itineraries[0].segments.slice(-1)[0].arrival.cityName)}</p>
        <ChevronRight className='p-1'/>
        <p>{flight.itineraries[0].segments[0].carrierCode} Airline</p>
        <ChevronRight className='p-1'/>
        <p>Review your trip</p>
      </div>

      <div className='flex max-lg:flex-col-reverse w-full max-lg:items-center justify-between items-start lg:gap-20 gap-5'>
        {/* This section contains the flight details and the payment summary */}
        
        {/* Flight details section */}
        <div className='flex flex-col gap-5 flex-1 max-w-full'>
          <div className='bg-blue-100 rounded-3xl p-5 flex flex-col gap-1 w-full'>
            {/* Flight itinerary details (departure and arrival times, stops, etc.) */}
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

          {/* Fare details section */}
          <div className='flex flex-col gap-2 p-5 bg-blue-100 rounded-3xl w-full'>
            <h1 className='font-semibold font-Grotesk text-lg'>
              Your fare: {formatWord(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)}
            </h1>
            <div className='flex flex-col gap-2'>
              {/* Included services for the flight */}
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white text-gray-500 rounded-full'/> 
                <p>Seat choice included</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white text-gray-500 rounded-full'/> 
                <p>2 check bags included (30 Kg per bag)</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCheck className='p-1 bg-white text-gray-500 rounded-full'/> 
                <p>Cancellation fee applies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment summary section */}
        <div className='bg-blue-100 rounded-3xl p-5 flex flex-col gap-3 w-96 max-w-full'>
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
          {/* Checkout button to proceed to the checkout page */}
          <button
            type="button"
            disabled={loading}
            className={`${loading ? 'bg-[#48aadf]/50 cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'} hover:bg-[#48aadf]/50 active:scale-90 rounded-lg py-3 w-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 relative text-sm sm:text-base`}
            onClick={proceedToCheckOut} // Trigger checkout process
          >
            {loading ? (
              <>
                <span>Proceeding to checkout...</span>
                <Loader2 className="animate-spin w-6 h-6 text-white absolute right-3" />
              </>
            ) : (
              'Proceed to Check Out'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightDetails;