import React from "react";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();
  
    const handleSelect = () => {
      navigate(`/hotel-details/${hotel.hotel.hotelId}`, { state: { hotel } });
    };

    const formatWord = (word) => {
        return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    return (
        <div className="p-5 rounded-xl bg-blue-100 flex flex-col gap-5">
            <div>
                <h3 className="text-lg font-semibold">{formatWord(hotel?.name)}</h3>
                <p>{hotel.hotel?.address.lines.join(', ')}</p>
                <p className="text-sm">{hotel.hotel?.address.cityName}</p>
                <div className="flex items-center justify-between">
                    <span className="font-bold">$price</span>
                    <button
                        onClick={handleSelect}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full"
                    >
                    Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;