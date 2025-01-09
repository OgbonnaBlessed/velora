import { useLocation, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HotelDetails = () => {
    // Hooks to manage state and navigation
    const location = useLocation(); // Gets the current location object from React Router
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [hotelDetails, setHotelDetails] = useState(null); // Holds hotel details data
    const [error, setError] = useState(null); // Holds any error message
    const [loading, setLoading] = useState(false); // Manages loading state
    const { hotel } = location.state; // Destructures hotel object from the state passed via location

    // Fetch hotel details when the component mounts or hotel changes
    useEffect(() => {
        if (hotel) {
            const fetchHotelDetails = async () => {
                setLoading(true); // Starts loading
                try {
                    // Fetch hotel details from the server
                    const response = await fetch(`/api/flight/hotel-details/${hotel.hotelId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await response.json(); // Parse the JSON response

                    if (!response.ok) {
                        // If response is not successful, set error message
                        setError(data.error || 'Failed to fetch hotel details. Please try again.');
                    } else {
                        // Set hotel details if the response is successful
                        setHotelDetails(data);
                    }
                } catch (error) {
                    console.error('Error fetching hotel details:', error);
                    // Handle unexpected errors
                    setError('An unexpected error occurred. Please try again later.');
                }
                setLoading(false); // Stops loading after the request
            };

            fetchHotelDetails(); // Call the fetch function
        } else {
            // If no hotel data, navigate to the hotel search page
            navigate('/hotel-search');
        }
    }, [hotel, navigate]); // Re-run effect if hotel or navigate changes

    // Helper function to format date into a readable string
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    // Helper function to format time into a 12-hour time format
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(date));

    // Show loading spinner while waiting for data
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <BounceLoader 
                    color="#48aadf" 
                    size={50} 
                />
            </div>
        );
    }

    // Show error message if there is an error fetching hotel data
    if (error) {
        return (
            <div className="flex items-center justify-center h-96 px-5">
                <p className="font-semibold text-center">
                    Your selected hotel has no room available, please check another hotel.
                </p>
            </div>
        );
    }

    // If no hotel details, don't render anything
    if (!hotelDetails) return null;

    // Destructuring hotel info and offers from fetched data
    const { hotel: hotelInfo, offers } = hotelDetails.data[0];
    const { name, chainCode, cityCode, latitude, longitude } = hotelInfo;

    // Calculate hotel price, tax, and total price
    const hotelPrice = parseFloat(offers?.[0]?.price?.total) || 0;
    const tax = hotelPrice * 0.1; // 10% tax
    const total = hotelPrice + tax; // Total price including tax

    // Navigate to checkout page with hotel details and price information
    const proceedToCheckOut = () => {
        navigate(`/hotel-check-out`, { state: { hotelDetails, tax, total } });
    };

    return (
        // Motion.div for animated page transition
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: .5,
                ease: "easeInOut"
            }}
            className="flex flex-col items-center lg:items-start gap-5 px-6 sm:px-8 lg:px-24 pt-28 md:pt-36 pb-12 bg-white"
        >
            {/* Hotel Header */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <h1 className="md:text-3xl text-xl font-semibold">
                    {name} {/* Hotel Name */}
                </h1>
            </div>
            <div className="text-gray-600 text-sm md:text-base">
                {/* Display additional hotel information */}
                <p>Chain Code: {chainCode}</p>
                <p>City Code: {cityCode}</p>
                <p>Latitude: {latitude}, Longitude: {longitude}</p>
            </div>

            {/* Hotel Images Section */}
            <div className='flex flex-col lg:gap-5 gap-3 max-w-full'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotelDetails?.images && hotelDetails?.images.length > 0 ? (
                        hotelDetails?.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Hotel ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg transition-all hover:scale-105 cursor-pointer"
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-nowrap">No images available</p>
                    )}
                </div>

                {/* Offers Section */}
                <div className='flex lg:flex-row flex-col gap-5 w-full'>
                    <div className="w-full bg-blue-100 shadow shadow-[#48aadf] rounded-3xl p-6">
                        <h2 className="text-xl font-semibold">Available Offer</h2>
                        {/* Loop through each offer and display details */}
                        {offers.map((offer, index) => (
                            <div key={index} className="p-4">
                                <div className='flex flex-col gap-2'>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Room Type: </span> 
                                        {offer.room?.description?.text || 'Not Specified'}
                                    </div>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Rate Type: </span> 
                                        {offer.rateFamilyEstimated?.type || 'Not Specified'}
                                    </div>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Price: </span> 
                                        {offer.price.total} {offer.price.currency}
                                    </div>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Check-in Date: </span> 
                                        {offer.checkInDate}
                                    </div>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Check-out Date: </span> 
                                        {offer.checkOutDate}
                                    </div>
                                    <div>
                                        <span className='font-Grotesk font-semibold'>Guests: </span> {offer.guests.adults} {offer.guests.adults > 1 ? 'Adults' : 'Adult'}
                                    </div>
                                    {/* Cancellation Policies */}
                                    <div> 
                                        <span className='font-Grotesk font-semibold'>Cancellation Policies: </span>
                                        {offer.policies?.cancellations?.map((policy, idx) => (
                                            <p key={idx}>
                                                Payment of {policy.amount} {offers?.[0]?.price?.currency} has to be made on or before {formatDate(policy.deadline)} {formatTime(policy.deadline)}, else your booking will be cancelled.
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary Section */}
                    <div className='bg-blue-100 shadow shadow-[#48aadf] rounded-3xl p-5 flex flex-col gap-3 w-[35rem] max-w-full h-fit'>
                        <h1 className='text-lg font-semibold font-Grotesk'>Payment summary</h1>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-between'>
                                <p>Hotel</p>
                                <p>{hotelPrice} {offers?.[0]?.price?.currency}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Taxes & fees</p>
                                <p>{tax.toFixed(2)} {offers?.[0]?.price?.currency}</p>
                            </div>
                            <div className='flex items-center justify-between border-t-2 border-white py-3 mt-3'>
                                <p className='font-semibold font-Grotesk'>Trip total</p>
                                <p>{total.toFixed(2)} {offers?.[0]?.price?.currency}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className='bg-[#48aadf] rounded-full py-3 w-full font-semibold cursor-pointer text-white'
                            onClick={proceedToCheckOut} // Trigger checkout process
                        >
                            Check out
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HotelDetails;