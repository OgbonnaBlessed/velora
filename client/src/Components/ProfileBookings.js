import React from "react";
import { useSelector } from "react-redux";
import HotelCard from "./Common/Cards/HotelCard";
import FlightCard from "./Common/Cards/FlightCard";

const ProfileBookings = () => {
    const { currentUser } = useSelector((state) => state.user);

    // Separate flight and hotel bookings
    const flightBookings = currentUser?.bookings?.filter(
        (booking) => booking.type === "flight-offer"
    );
    const hotelBookings = currentUser?.bookings?.filter(
        (booking) => booking?.data?.[0]?.type === "hotel-offers"
    );

    // Helper to calculate total duration in minutes
    const getFlightDuration = (flight) => {
        const segments = flight.itineraries[0]?.segments;
        const departureTime = new Date(segments[0].departure.at).getTime();
        const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime();
        return (arrivalTime - departureTime) / (1000 * 60); // Convert to minutes
    };

    // Helper to format time
    const formatTime = (date) =>
        new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(date));

    return (
        <div className="bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10">
            <h2 className="font-medium sm:text-3xl text-2xl">Your Bookings</h2>

            {/* Flight Bookings */}
            <div className="flex flex-col gap-3">
                <h3 className="font-medium sm:text-2xl text-xl">Flight Bookings</h3>
                {flightBookings?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-10">
                        {flightBookings.map((booking, i) => (
                            <FlightCard
                                key={i}
                                flight={booking}
                                formatTime={formatTime}
                                getFlightDuration={getFlightDuration}
                            />
                        ))}
                    </div>
                    ) : (
                    <p className="text-gray-500">No flight bookings yet.</p>
                )}
            </div>

            {/* Hotel Bookings */}
            <div className="flex flex-col gap-3">
                <h3 className="font-medium sm:text-2xl text-xl">Hotel Bookings</h3>
                {hotelBookings?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {hotelBookings.map((booking, index) => (
                            <div key={index} className="relative">
                                <HotelCard 
                                    // key={index} 
                                    hotel={booking} 
                                    hotelName={booking?.data?.[0]?.hotel?.name} 
                                />
                                <div className="sm:px-4 px-2 sm:py-2 py-1 bg-emerald-500 text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-[0.7rem] absolute sm:bottom-5 bottom-3 right-3">
                                    cancel booking
                                </div>
                            </div>
                        ))}
                    </div>
                    ) : (
                        <p className="text-gray-500">No hotel bookings yet.</p>
                    )}
            </div>
        </div>
    );
};

export default ProfileBookings;