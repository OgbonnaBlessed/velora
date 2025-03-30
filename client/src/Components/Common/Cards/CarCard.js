/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-undef */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car, getCarDuration, cancelBooking }) => {
    // Get the total flight duration using the getFlightDuration function
    const flightDuration = getCarDuration(car);

    // Initialize the useNavigate hook to navigate between pages
    const navigate = useNavigate();

    // Convert total flight duration (in minutes) to hours and minutes
    const hours = Math.floor(flightDuration / 60); // Calculate full hours
    const minutes = flightDuration % 60; // Calculate remaining minutes

    // Handle selecting a flight by navigating to the flight details page
    const handleSelect = () => {
        navigate(`/car-details/${car.id}`, { state: { car } });
    };

    return (
        <div className='flex flex-col gap-6 p-4 bg-[#dbeafe] rounded-md h-fit font-Grotesk'>
            <div className='flex flex-col gap-4'>
                <img 
                    src={car?.vehicle?.imageURL || `${process.env.PUBLIC_URL}/images/placeholder-car.png`} 
                    alt={`Car-${car.id} image`} 
                    onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-car.png`} 
                    className='object-cover rounded-md' 
                />
                <div className='flex gap-2 items-start'>
                    <div className='w-full py-4 flex flex-col gap-2'>
                        <div className='font-serif'>{car?.vehicle?.description}</div>
                        <div className='flex gap-2 items-center font-serif'>
                            <div className='w-10 h-10 rounded-full'>
                                <img 
                                    src={car?.serviceProvider?.logoUrl} 
                                    alt={`Car-${car.id}-service-provider-logo`} 
                                    className='w-10' 
                                    onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/service_provider.png`} 
                                />
                            </div>
                            <div>{car?.serviceProvider?.name}</div>
                        </div>
                        <div className='font-Grotesk'>{car?.converted?.monetaryAmount} {car?.converted?.currencyCode}</div>
                    </div>
                    <div>
                        <div className="bg-white py-1 px-3 rounded-md text-[0.8rem] w-fit text-nowrap">
                            {`${hours}h ${minutes}m`}
                        </div>
                    </div>
                </div>
            </div>
            {cancelBooking ? (
                <button 
                    onClick={() => cancelBooking(car.id)} // Call cancelBooking when clicked
                    className="sm:px-4 px-2 sm:py-2 py-1 bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-[0.7rem] transition-all duration-300 ease-in-out"
                    type="button"
                >
                    Cancel booking
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleSelect} // Navigate to car details when "Select" is clicked
                    className="bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 sm:rounded-md rounded-sm font-semibold text-white cursor-pointer sm:px-4 px-2 sm:py-2 py-1 self-center transition-all duration-300 ease-in-out text-base"
                >
                    Select
                </button>
            )}
        </div>
    );
};

export default CarCard;