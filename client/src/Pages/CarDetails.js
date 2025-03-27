/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BounceLoader } from "react-spinners";

const CarDetails = () => {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const location = useLocation(); // Get the state passed from CarCard
    const navigate = useNavigate();
    const car = location.state?.car;
    console.log("Car details:", car);

    useEffect(() => {
        setPageLoading(true);
        setTimeout(() => {
            setPageLoading(false);
        }, 5000);
    }, [])

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

    // Fallback if car data is missing
    if (!car) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Car Not Found</h2>
                <button
                    className="bg-[#48aadf] text-white px-6 py-2 rounded-full hover:bg-[#48aadf]/80"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const {
        cancellationRules,
        vehicle,
        serviceProvider,
        converted,
        start,
        end,
    } = car;

    // Helper function to format the time in 12-hour format (e.g., 10:30 AM)
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(date));

    // Helper function to format the date (e.g., Tue, Jan 9)
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    // Ensure monetaryAmount is a number
    const monetaryAmount = Number(converted?.monetaryAmount) || 0; 
    const tax = monetaryAmount * 0.1; // 10% tax
    const total = monetaryAmount + tax; // Total price including tax

    // Function to handle booking
    const handleBooking = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Booking functionality coming soon!");
            setLoading(false);
        }, 5000);
    };

    return (
        <div className="flex flex-col items-center lg:items-start gap-5 px-6 sm:px-8 lg:px-24 pt-28 md:pt-36 pb-12 bg-white font-Grotesk">

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 self-start">
                <h1 className="md:text-3xl text-xl font-semibold">
                    {vehicle?.description} {/* Hotel Name */}
                </h1>
            </div>

            <div className="text-gray-600 text-sm md:text-base self-start">
                {/* Display additional hotel information */}
                <p>Service Provider: {serviceProvider?.name}</p>
                <div className="flex items-center gap-2">
                    <p>Logo: </p>
                    <img 
                        src={serviceProvider?.logoUrl} 
                        alt="Service Provider Logo"
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/service_provider.png`}
                        className="w-10"
                    />
                </div>
                <p>Vehicle Code: {vehicle?.code}</p>
            </div>

            <div className="flex flex-col lg:gap-5 gap-3 w-full mt-5">
                <div className="flex flex-col w-full">
                    <img 
                        src={vehicle?.imageURL || `${process.env.PUBLIC_URL}/images/placeholder-car.png`}
                        alt={`Car-${car.id} image`} 
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-car.png`}
                        className="object-cover hover:scale-105 cursor-pointer transition-all duration-300"
                    />
                </div>

                <div className="flex lg:flex-row flex-col gap-5 w-full">
                    <div className="w-full bg-blue-100  rounded-3xl p-6">
                        <h2 className="text-xl font-semibold">Vehicle Information</h2>
                        <div className="p-4 flex flex-col gap-1 font-Grotesk">
                            <div className="flex items-center gap-2">
                                <p className="font-Grotesk font-semibold">
                                    Seats:
                                </p> 
                                {vehicle?.seats?.map((seat) => (
                                    <p className="text-sm">{seat.count}</p>
                                )) || "N/A" }
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="font-Grotesk font-semibold">
                                   Description:
                                </p> 
                                <p className="text-sm">
                                    {vehicle?.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-Grotesk font-semibold">
                                    Baggages:
                                </p> 
                                {vehicle?.baggages?.map((baggage) => (
                                    <p className="text-sm">{baggage.count}, {baggage.size}</p>
                                )) || "N/A" }
                            </div>

                            <div className="flex flex-col font-Grotesk">
                                <h2 className="font-semibold font-Grotesk">Pick up</h2>
                                <div className="flex flex-col ml-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <h3>Date:</h3>
                                        <div>{formatDate(start?.dateTime)}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <h3>Time:</h3>
                                        <div>{formatTime(start?.dateTime)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col font-Grotesk">
                                <h2 className="font-semibold font-Grotesk">Drop off</h2>
                                <div className="flex flex-col ml-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <h3>Date:</h3>
                                        <div>{formatDate(end?.dateTime)}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <h3>Time:</h3>
                                        <div>{formatTime(end?.dateTime)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center font-Grotesk gap-1">
                                <h3 className="font-semibold">Total Price:</h3>
                                <p className="text-sm">{converted?.monetaryAmount} {converted?.currencyCode}</p>
                            </div>
                            <div className="font-Grotesk">
                                <h2 className="font-semibold">Terms & Conditions</h2>
                                <p className="text-gray-600 text-sm ml-4">
                                    {cancellationRules.map((rules, index) => (
                                        <div className="flex items-start gap-1 mb-1">
                                            <span>{index + 1}.</span>
                                            <p>{rules?.ruleDescription}</p>
                                        </div>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-blue-100  rounded-3xl p-5 flex flex-col gap-3 w-[35rem] max-w-full h-fit'>
                        <h1 className='text-lg font-semibold font-Grotesk'>Payment summary</h1>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-between'>
                                <p>Car</p>
                                <p>{converted?.monetaryAmount} {converted?.currencyCode}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Taxes & fees</p>
                                <p>{tax.toFixed(2)} {converted?.currencyCode}</p>
                            </div>
                            <div className='flex items-center justify-between border-t-2 border-white py-3 mt-3'>
                                <p className='font-semibold font-Grotesk'>Trip total</p>
                                <p>{total.toFixed(0)} {converted?.currencyCode}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            className={`${loading ? 'bg-[#48aadf]/50 cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'} hover:bg-[#48aadf]/50 active:scale-90 rounded-lg py-3 w-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 relative text-sm sm:text-base`}
                            onClick={handleBooking} // Trigger checkout process
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
            </div>
        </div>
    );
};

export default CarDetails;