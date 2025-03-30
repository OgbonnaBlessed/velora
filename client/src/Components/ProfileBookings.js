// Import necessary libraries and components
import React, { useState } from "react"; // React and useState hook for local state management
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state management
import HotelCard from "./Common/Cards/HotelCard"; // Custom HotelCard component to display hotel bookings
import FlightCard from "./Common/Cards/FlightCard"; // Custom FlightCard component to display flight bookings
import { updateUserBookings } from "../redux/user/userSlice"; // Action to update user bookings in Redux store
import { AnimatePresence, motion } from "framer-motion"; // Animation library for transitions
import { X } from "lucide-react"; // Close icon component from Lucide Icons
import ScrollToTop from "./ScrollToTop"; // Component to scroll to the top of the page
import { formatTime } from "./Common/helpers/functions";
import CarCard from './Common/Cards/CarCard'

// ProfileBookings component
const ProfileBookings = () => {
    const dispatch = useDispatch(); // Redux dispatch function to trigger actions
    const { currentUser } = useSelector((state) => state.user); // Getting current user from Redux store
    console.log(currentUser?.bookings)

    // Local state management for confirmation and success modals
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State to show confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to show success modal
    const [selectedBookingId, setSelectedBookingId] = useState(null); // State to store selected booking ID for cancellation

    // Filter flight bookings from the current user's bookings
    const flightBookings = currentUser?.bookings?.filter(
        (booking) => booking.type === "flight-offer" // Filter bookings by type "flight-offer"
    );

    // Filter hotel bookings from the current user's bookings
    const hotelBookings = currentUser?.bookings?.filter(
        (booking) => booking?.data?.[0]?.type === "hotel-offers" // Filter bookings by type "hotel-offers"
    );

    const carBookings = currentUser?.bookings?.filter(
        (booking) => booking.type === "transfer-offer"
    )

    // Helper function to calculate flight duration in minutes
    const getFlightDuration = (flight) => {
        const segments = flight.itineraries[0]?.segments; // Get the segments of the flight itinerary
        const departureTime = new Date(segments[0].departure.at).getTime(); // Convert departure time to milliseconds
        const arrivalTime = new Date(segments[segments.length - 1].arrival.at).getTime(); // Convert arrival time to milliseconds
        return (arrivalTime - departureTime) / (1000 * 60); // Return the duration in minutes
    };

    // Function to handle the cancel booking action
    const handleCancelClick = (bookingId) => {
        setSelectedBookingId(bookingId); // Set the selected booking ID
        setShowConfirmModal(true); // Show the confirmation modal
    };

    // Helper function to calculate the car duration in minutes
    const getCarDuration = (car) => {
        const departureTime = new Date(car?.start?.dateTime).getTime();
        const arrivalTime = new Date(car?.end?.dateTime).getTime();
        return (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
    };

    // Function to cancel the booking (called when the user confirms the cancellation)
    const cancelBooking = async () => {
        try {
            // Make API call to cancel the booking
            const response = await fetch(
                `/api/user/${currentUser._id}/bookings/${selectedBookingId}`, // API endpoint to cancel the booking
                { method: "DELETE" } // HTTP DELETE method to remove the booking
            );

            // If the response is not OK, throw an error
            if (!response.ok) {
                throw new Error("Failed to cancel booking");
            }

            // Parse the response to get the updated user data
            const { updatedUser } = await response.json();

            // Dispatch the action to update the Redux store with the updated user data
            dispatch(updateUserBookings(updatedUser.bookings));

            // Hide the confirmation modal and show the success modal
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            // Log error and alert the user if the cancellation failed
            console.error(error.message);
            alert("Could not cancel booking. Please try again.");
        }
    };

    return (
        <motion.div 
            // The motion.div from Framer Motion for animations when this component is rendered
            initial={{ opacity: 0 }}  // Initial state, setting the opacity to 0 for fade-in
            animate={{ opacity: 1 }}  // Animate to opacity 1 (fully visible)
            exit={{ opacity: 0 }}  // When the component exits, animate to opacity 0
            transition={{
                duration: .5,  // Transition duration of 0.5 seconds
                ease: "easeInOut"  // Smooth easing for the animation
            }}
            className="bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10 font-Grotesk"
        >   
            {/* ScrollToTop component, likely scrolls the user to the top when they visit this page */}
            <ScrollToTop/>  
            <h2 className="font-medium sm:text-3xl text-2xl">Your Bookings</h2>

            {/* Flight Bookings Section */}
            <div className="flex flex-col gap-3">
                <h3 className="font-medium sm:text-2xl text-xl">Flight Bookings</h3>
                {flightBookings?.length > 0 ? (
                    // Conditionally render flight bookings if there are any
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-10">
                        {flightBookings.map((booking, i) => (
                            // Render FlightCard for each flight booking
                            <FlightCard
                                key={i}
                                flight={booking}
                                formatTime={formatTime}  // Pass function to format flight time
                                getFlightDuration={getFlightDuration}  // Pass function to get flight duration
                                cancelBooking={() => handleCancelClick(booking.id)} // Trigger cancel modal when cancel button is clicked
                            />
                        ))}
                    </div>
                ) : (
                    // Show message if there are no flight bookings
                    <p className="text-gray-500">No flight bookings yet.</p>
                )}
            </div>

            {/* Hotel Bookings Section */}
            <div className="flex flex-col gap-3">
                <h3 className="font-medium sm:text-2xl text-xl">Hotel Bookings</h3>
                {hotelBookings?.length > 0 ? (
                    // Conditionally render hotel bookings if there are any
                    <div className="grid grid-cols-1 gap-6">
                        {hotelBookings.map((booking, index) => (
                            // Render HotelCard for each hotel booking
                            <HotelCard
                                key={index}
                                hotel={booking}
                                hotelName={booking?.data?.[0]?.hotel?.name} // Display hotel name
                                cancelBooking={() => handleCancelClick(booking.id)} // Trigger cancel modal when cancel button is clicked
                            />
                        ))}
                    </div>
                ) : (
                    // Show message if there are no hotel bookings
                    <p className="text-gray-500">No hotel bookings yet.</p>
                )}
            </div>

            {/* Car Bookings Section */}
            <div className="flex flex-col gap-3">
                <h3 className="font-medium sm:text-2xl text-xl">Car Bookings</h3>
                {carBookings?.length > 0 ? (
                    // Conditionally render hotel bookings if there are any
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {carBookings.map((booking, index) => (
                            // Render CarCard for each hotel booking
                            <CarCard
                                key={index}
                                car={booking}
                                getCarDuration={getCarDuration}
                                cancelBooking={() => handleCancelClick(booking.id)} // Trigger cancel modal when cancel button is clicked
                            />
                        ))}
                    </div>
                ) : (
                    // Show message if there are no hotel bookings
                    <p className="text-gray-500">No car bookings yet.</p>
                )}
            </div>

            {/* Confirm Cancellation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    // If showConfirmModal is true, display this modal
                    <motion.div 
                        initial={{ opacity: 0 }}  // Fade in effect for modal
                        animate={{ opacity: 1 }}  // Animate to full opacity
                        transition={{
                            duration: .5,  // Duration of transition
                            ease: 'easeInOut'  // Easing function for smooth transition
                        }}
                        exit={{ opacity: 0 }}  // Fade out effect on exit
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
                            className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                        >
                            {/* Close button for the modal */}
                            <X
                                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                                onClick={() => setShowConfirmModal(false)}  // Close the modal when clicked
                            />
                            <p className="font-serif pt-2 text-center">Are you sure you want to cancel this booking?</p>
                            <div className="flex justify-end gap-3">
                                {/* Yes button to confirm cancellation */}
                                <button
                                    onClick={cancelBooking}  // Call cancelBooking function
                                    className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out"
                                >
                                    Yes
                                </button>
                                {/* No button to cancel the cancellation */}
                                <button
                                    onClick={() => setShowConfirmModal(false)}  // Close the modal when clicked
                                    className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out"
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
                    // If showSuccessModal is true, display this success modal
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
                            className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                        >
                            {/* Close button for the modal */}
                            <X
                                className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                                onClick={() => setShowSuccessModal(false)}  // Close the modal when clicked
                            />
                            <p className="font-serif pt-2 text-center">Your booking has been successfully cancelled.</p>
                            {/* OK button to close the success modal */}
                            <button
                                onClick={() => setShowSuccessModal(false)}  // Close the modal when clicked
                                className="bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out"
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