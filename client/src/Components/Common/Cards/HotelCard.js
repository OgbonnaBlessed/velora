import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing icons for navigation arrows
import React, { useState } from "react"; // Importing React and useState hook for managing state
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import { LazyLoadImage } from "react-lazy-load-image-component"; // Importing LazyLoadImage component to load images lazily
import "react-lazy-load-image-component/src/effects/blur.css"; // Importing the blur effect for lazy-loaded images

// HotelCard component receives hotel, hotelName, and cancelBooking as props
const HotelCard = ({ hotel, hotelName, cancelBooking }) => {
    const navigate = useNavigate(); // Hook for navigation
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image in the slider

    // Function to navigate to the hotel details page when 'View Details' is clicked
    const handleSelect = () => {
        navigate(`/hotel-details/${hotel?.hotelId}`, { state: { hotel } }); // Navigates to hotel details, passing the hotel object
    };

    // Function to format a word by capitalizing the first letter of each word
    const formatWord = (word) => {
        return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizes first letter of each word
    };

    // Function to go to the previous image in the slider
    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1 // Loop back to the last image if we're at the first one
        );
    };

    // Function to go to the next image in the slider
    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1 // Loop to the first image if we're at the last one
        );
    };

    return (
        <div className="rounded-xl bg-blue-100 flex justify-between gap-5 h-fit shadow shadow-white">
            {/* Image Slider Container */}
            <div className="relative z-10 sm:min-w-72 sm:max-w-72 min-w-[50%] sm:h-60 h-40 rounded-l-xl overflow-hidden">
                {/* Image slider with transition effect */}
                <div
                    className="relative w-full h-full flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }} // Applying translation based on current image index
                >
                    {/* Mapping through all the hotel images */}
                    {hotel.images.map((image, index) => (
                        <div
                            key={index}
                            className="sm:min-w-72 sm:max-w-72 min-w-full sm:h-60 h-40 bg-[#dbeafe]"
                        >
                            {/* Lazy loading images to improve performance */}
                            <LazyLoadImage
                                src={image}
                                alt={`${hotel.name} - ${index + 1}`}
                                className="sm:min-w-72 sm:max-w-72 min-w-40 w-full sm:h-60 h-40 object-cover"
                                effect="blur" // Adds a blur effect while loading the image
                            />
                        </div>
                    ))}
                </div>

                {/* Left arrow button to go to previous image */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronLeft className="max-sm:p-0.5" /> {/* Chevron Left Icon */}
                </button>

                {/* Right arrow button to go to next image */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronRight className="max-sm:p-0.5" /> {/* Chevron Right Icon */}
                </button>
            </div>

            {/* Hotel Details Section */}
            <div className="flex flex-col gap-2 p-4 items-end">
                {/* Displaying hotel name, formatted */}
                <p className="text-lg font-semibold text-wrap text-start max-sm:text-[0.78rem] leading-tight">
                    {formatWord(hotelName || hotel.name)} {/* Formatting hotel name or using default */}
                </p>

                {/* Conditional rendering based on whether cancelBooking function is passed */}
                {!cancelBooking 
                ? (
                    <div className="flex items-center justify-between">
                        {/* 'View Details' button to navigate to the hotel details */}
                        <button
                            onClick={handleSelect}
                            className="sm:px-4 px-2 sm:py-2 py-1 bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-xs transition-all duration-300 ease-in-out font-semibold"
                            type="button"
                        >
                            View Details
                        </button>
                    </div>
                ) : (
                    // 'Cancel Booking' button when cancelBooking function is available
                    <button 
                        onClick={() => cancelBooking(hotel.id)} // Call cancelBooking when clicked
                        className="sm:px-4 px-2 sm:py-2 py-1 bg-blue-500 text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-[0.7rem]"
                        type="button"
                    >
                        Cancel booking
                    </button>
                )}
            </div>
        </div>
    );
};

export default HotelCard; // Exporting the HotelCard component