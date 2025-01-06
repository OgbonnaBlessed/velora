import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const HotelCard = ({ hotel, hotelName, cancelBooking }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSelect = () => {
        navigate(`/hotel-details/${hotel?.hotelId}`, { state: { hotel } });
    };

    const formatWord = (word) => {
        return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="rounded-xl bg-blue-100 flex justify-between gap-5 h-fit shadow shadow-white">

            {/* Image Slider Container */}
            <div className="relative z-10 sm:min-w-72 sm:max-w-72 min-w-[50%] sm:h-60 h-40 rounded-l-xl overflow-hidden">
                <div
                    className="relative w-full h-full flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {hotel.images.map((image, index) => (
                        <div
                            key={index}
                            className="sm:min-w-72 sm:max-w-72 min-w-full sm:h-60 h-40 bg-[#dbeafe]"
                        >
                            <LazyLoadImage
                                src={image}
                                alt={`${hotel.name} - ${index + 1}`}
                                className="sm:min-w-72 sm:max-w-72 min-w-40 w-full sm:h-60 h-40 object-cover"
                                effect="blur" // Adds a blur effect while loading
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronLeft className="max-sm:p-0.5" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronRight className="max-sm:p-0.5" />
                </button>
            </div>

            <div className="flex flex-col gap-2 p-4 items-end">
                <p className="text-lg font-semibold text-wrap text-start max-sm:text-[0.78rem] leading-tight">
                    {formatWord(hotelName || hotel.name)}
                </p>
                {!cancelBooking 
                ? (
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleSelect}
                            className="sm:px-4 px-2 sm:py-2 py-1 bg-blue-500  text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-[0.7rem]"
                            type="button"
                        >
                            View Details
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => cancelBooking(hotel.id)}
                        className="sm:px-4 px-2 sm:py-2 py-1 bg-blue-500  text-white sm:rounded-md rounded-sm text-nowrap max-sm:text-[0.7rem]"
                        type="button"
                    >
                        Cancel booking
                    </button>
                )}
            </div>
        </div>
    );
};

export default HotelCard;