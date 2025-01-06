import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const HotelDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hotelDetails, setHotelDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { hotel } = location.state;

    useEffect(() => {
        if (hotel) {
            const fetchHotelDetails = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/flight/hotel-details/${hotel.hotelId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        setError(data.error || 'Failed to fetch hotel details. Please try again.');
                    } else {
                        setHotelDetails(data);
                    }
                } catch (error) {
                    console.error('Error fetching hotel details:', error);
                    setError('An unexpected error occurred. Please try again later.');
                }
                setLoading(false);
            };

            fetchHotelDetails();
        } else {
            navigate('/hotel-search');
        }
    }, [hotel, navigate]);

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    // Helper to format time
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(date));

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

    if (error) {
        return (
            <div className="flex items-center justify-center h-96 px-5">
                <p className="font-semibold text-center">
                    Your selected hotel has not room available, please check another hotel.
                </p>
            </div>
        );
    }

    if (!hotelDetails) return null;

    const { hotel: hotelInfo, offers } = hotelDetails.data[0];
    const { name, chainCode, cityCode, latitude, longitude } = hotelInfo;

    const hotelPrice = parseFloat(offers?.[0]?.price?.total) || 0;
    const tax = hotelPrice * 0.1; // 10% tax
    const total = hotelPrice + tax;

    const proceedToCheckOut = () => {
        navigate(`/hotel-check-out`, { state: { hotelDetails, tax, total } });
    };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            duration: .5,
            ease: "easeInOut"
        }}
        className="flex flex-col items-center lg:items-start gap-5 px-6 sm:px-8 lg:px-24 pt-28 md:pt-36 pb-12"
    >
        {/* Hotel Header */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <h1 className="md:text-3xl text-xl font-semibold">
                {name}
            </h1>
        </div>
        <div className="text-gray-600 text-sm md:text-base">
            <p>Chain Code: {chainCode}</p>
            <p>City Code: {cityCode}</p>
            <p>Latitude: {latitude}, Longitude: {longitude}</p>
        </div>

        <div className='flex flex-col lg:gap-5 gap-3 max-w-full'>
            {/* Hotel Images */}
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

            <div className='flex lg:flex-row flex-col gap-5 w-full'>
                
                {/* Offers */}
                <div className="w-full bg-blue-100 shadow shadow-[#48aadf] rounded-3xl p-6">
                    <h2 className="text-xl font-semibold">Available Offer</h2>
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
                        onClick={proceedToCheckOut}
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