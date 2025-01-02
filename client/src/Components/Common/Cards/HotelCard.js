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
        <div className="rounded-xl bg-blue-100 flex justify-between gap-5 shadow shadow-gray-400 h-fit">
            <div className="relative min-w-72 max-w-72 h-60 rounded-l-xl overflow-hidden">
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                >
                    <ChevronRight />
                </button>
            </div>

            <div className="flex flex-col gap-2 p-4 items-end">
                <p className="text-lg font-semibold text-wrap text-start">{formatWord(hotel.name)}</p>
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSelect}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow shadow-gray-400"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;