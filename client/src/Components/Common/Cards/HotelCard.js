import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSelect = () => {
        navigate(`/hotel-details/${hotel.hotel.hotelId}`, { state: { hotel } });
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
        <div className="rounded-xl bg-blue-100 flex justify-between gap-5 h-fit">
            <div className="relative sm:min-w-72 sm:max-w-72 min-w-[50%] sm:h-60 h-40 rounded-l-xl overflow-hidden">
                {/* Image Slider Container */}
                <div
                    className="relative w-full h-full flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {hotel.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${hotel.name} - ${index + 1}`}
                            className="h-full min-w-full object-cover"
                        />
                    ))}
                </div>

                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronLeft className="max-sm:p-0.5"/>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white sm:p-2 p-1 rounded-full"
                >
                    <ChevronRight className="max-sm:p-0.5"/>
                </button>
            </div>

            <div className="flex flex-col gap-2 p-4 items-end">
                <p className="text-lg font-semibold text-wrap text-start max-sm:text-sm">{formatWord(hotel.name)}</p>
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSelect}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-nowrap max-sm:text-sm"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;