/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";

const CarDetails = () => {
    const location = useLocation(); // Get the state passed from CarCard
    const navigate = useNavigate();
    const car = location.state?.car;
    console.log("Car details:", car);

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
        availability,
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

    // Function to handle booking
    const handleBooking = () => {
        alert("Booking functionality coming soon!");
    };

    return (
        <div className="p-6 lg:p-12 bg-[#f8fafc] min-h-screen flex flex-col gap-8 pt-28">
            {/* Header */}
            <div className="flex justify-between items-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-[#48aadf] font-semibold cursor-pointer"
                >
                    <ArrowLeft />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Car Image & Provider */}
                <div className="bg-white p-6 rounded-md shadow-lg flex flex-col gap-6">
                    <img 
                        src={vehicle?.imageURL || `${process.env.PUBLIC_URL}/images/placeholder-car.png`}
                        alt={`Car-${car.id} image`} 
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-car.png`}
                        className="rounded-md object-cover"
                    />
                    <div className="flex items-center gap-2">
                        <img 
                            src={serviceProvider?.logoUrl} 
                            alt="Service Provider Logo"
                            onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/service_provider.png`}
                            className="w-12"
                        />
                        <div>
                            <h3 className="font-semibold text-lg">{serviceProvider?.name}</h3>
                        </div>
                    </div>
                </div>

                {/* Right Column: Car Details */}
                <div className="bg-white p-6 rounded-md shadow-lg flex flex-col gap-6">
                    <h2 className="text-xl font-semibold">Vehicle Information</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <p>
                                <strong>Seats:</strong>
                            </p> 
                            {vehicle?.seats?.map((seat) => (
                                <p>{seat.count}</p>
                            )) || "N/A" }
                        </div>
                        <div className="flex items-start gap-2">
                            <p>
                                <strong>Description:</strong>
                            </p> 
                            {vehicle?.description}
                        </div>
                        <div className="flex items-center gap-2">
                            <p>
                                <strong>Baggages:</strong>
                            </p> 
                            {vehicle?.baggages?.map((baggage) => (
                                <p>{baggage.count}, {baggage.size}</p>
                            )) || "N/A" }
                        </div>
                    </div>

                    <div className="flex items-start gap-12">
                        {/* <p><strong>Pickup Location:</strong> {start?.locationCode || "Not specified"}</p>
                        <p><strong>Drop-off Location:</strong> {end?.address?.cityName || "Not specified"}</p> */}
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold text-lg">Pick up</h2>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-sm">
                                    <h3>Date:</h3>
                                    <div>{formatDate(start?.dateTime)}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <h3>Time:</h3>
                                    <div>{formatTime(start?.dateTime)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold text-lg">Drop off</h2>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-sm">
                                    <h3>Date:</h3>
                                    <div>{formatDate(end?.dateTime)}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <h3>Time:</h3>
                                    <div>{formatTime(end?.dateTime)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing and Availability */}
            <div className="bg-white p-6 rounded-md shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Pricing & Availability</h2>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">Total Price:</p>
                        <h3 className="text-2xl font-bold">{converted?.monetaryAmount} {converted?.currencyCode}</h3>
                    </div>
                    <div>
                        <p className="text-gray-600">Availability:</p>
                        <h3 className="text-lg font-bold">
                            {availability ? "Available" : "Not Available"}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Terms & Conditions</h2>
                <p className="text-gray-600 text-sm">
                    {cancellationRules.map((rules, index) => (
                        <div className="flex items-start gap-1 mb-2">
                            <span>{index + 1}.</span>
                            <p>{rules?.ruleDescription}</p>
                        </div>
                    ))}
                </p>
            </div>

            {/* Booking Button */}
            <div className="flex justify-center">
                <button 
                    onClick={handleBooking}
                    className="bg-[#48aadf] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#48aadf]/80 active:scale-90 transition-all duration-300 ease-in-out"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default CarDetails;