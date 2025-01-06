import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HotelCard from "./Common/Cards/HotelCard";
import FlightCard from "./Common/Cards/FlightCard";
import { updateUserBookings } from "../redux/user/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ScrollToTop from "./ScrollToTop";

const ProfileBookings = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

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
        new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(new Date(date));

    // Open confirmation modal
    const handleCancelClick = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowConfirmModal(true);
    };

    // Cancel booking function
    const cancelBooking = async () => {
        try {
            const response = await fetch(
                `/api/user/${currentUser._id}/bookings/${selectedBookingId}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Failed to cancel booking");
            }

            const { updatedUser } = await response.json();

            // Update Redux state with the updated user data
            dispatch(updateUserBookings(updatedUser.bookings));

            // Show success modal
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error.message);
            alert("Could not cancel booking. Please try again.");
        }
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
            className="bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10"
        >
            <ScrollToTop/>
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
                                cancelBooking={() => handleCancelClick(booking.id)} // Pass cancel function
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
                            <HotelCard
                                key={index}
                                hotel={booking}
                                hotelName={booking?.data?.[0]?.hotel?.name}
                                cancelBooking={() => handleCancelClick(booking.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hotel bookings yet.</p>
                )}
            </div>

            {/* Confirm Cancellation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: .5,
                            ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: .5,
                              ease: 'easeInOut'
                            }}
                            exit={{ opacity: 0 }}
                            className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                        >
                            <X
                                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                                onClick={() => setShowConfirmModal(false)}
                            />
                            <p className="font-serif pt-2 text-center">Are you sure you want to cancel this booking?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelBooking}
                                    className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out shrink-button"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out shrink-button"
                                >
                                    No
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: .5,
                            ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="fixed left-0 right-0 top-0 bottom-0 z-[10001] bg-black/25 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: .5,
                              ease: 'easeInOut'
                            }}
                            exit={{ opacity: 0 }}
                            className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                        >
                            <X
                                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                                onClick={() => setShowSuccessModal(false)}
                            />
                            <p className="font-serif pt-2 text-center">Your booking has been successfully cancelled.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out shrink-button"
                            >
                                OK
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfileBookings;