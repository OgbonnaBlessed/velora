import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Filters = ({ handleSubmit }) => {
    const [priceRange, setPriceRange] = useState(500); // Default price range
    const [stops, setStops] = useState(""); // Single selection for stops
    const [baggage, setBaggage] = useState({ seatChoice: false, carryOnBag: false, noCancelFee: false });
    const [sortBy, setSortBy] = useState("Recommended"); // Default sort option

    const handleSort = () => {
        handleSubmit({ priceRange, stops, baggage, sortBy });
    };

  const renderCheckbox = (id, label, isChecked, toggleFn, key) => (
    <div 
        className="flex items-center" 
        key={key}
    >
        <input
            type="checkbox"
            id={id}
            checked={isChecked}
            onChange={toggleFn}
            className="hidden" // Hide the default checkbox
        />
        <label 
            htmlFor={id} 
            className="flex items-center cursor-pointer"
        >
            <div
                className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300
                    ${isChecked 
                        ? "border-[#48aadf] bg-[#48aadf]" 
                        : "border-gray-300"
                    }`
                }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                        ${ isChecked ? "opacity-100" : "opacity-0" }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="ml-2 text-black text-sm">{label}</span>
        </label>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-5 w-full items-start justify-between">
        {/* Price Range Filter */}
        <div className="flex flex-col gap-2 w-64 max-w-full">
            <label 
                htmlFor="price-range" 
                className="font-Grotesk font-semibold"
            >
                Price Range: ${priceRange}
            </label>
            <input
                type="range"
                id="price-range"
                min="0"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full cursor-grabbing"
            />
        </div>

        {/* Number of Stops Filter */}
        <div className="flex flex-col gap-2 font-Poppins font-[400]">
            <label className="font-Grotesk font-semibold">Number of Stops</label>
            <div className="flex flex-col gap-2">
                {[
                    { label: "1 Stop", value: "oneStop" },
                    { label: "2 Stops", value: "twoStops" },
                    { label: "3+ Stops", value: "threePlusStops" },
                ].map((stop) =>
                    renderCheckbox(
                        stop.value,
                        stop.label,
                        stops === stop.value,
                        () => setStops(stop.value),
                        stop.value // Use value as a unique key
                    )
                )}
            </div>
        </div>

        {/* Travel and Baggage Filter */}
        <div className="flex flex-col gap-2 font-Poppins font-[400]">
            <label className="font-Grotesk font-semibold">Travel and Baggage</label>
            <div className="flex flex-col gap-2 text-sm">
                {[
                    { label: "Seat Choice Included", key: "seatChoice" },
                    { label: "Carry-On Bag Included", key: "carryOnBag" },
                    { label: "No Cancel Fee", key: "noCancelFee" },
                ].map((option) =>
                    renderCheckbox(
                    option.key,
                    option.label,
                    baggage[option.key],
                    () => setBaggage((prev) => ({ ...prev, [option.key]: !prev[option.key] })),
                    option.key // Use key as a unique key
                    )
                )}
            </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative w-fit font-Poppins font-normal">
            <ChevronDown className="absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <label 
                htmlFor="price-filter" 
                className="text-[0.7rem] absolute top-2.5 left-4"
            >
                Sort by
            </label>
            <select
                id="price-filter"
                className="shadow shadow-gray-300 pt-7 pb-3 px-4 bg-transparent rounded-md w-56 text-black appearance-none cursor-pointer text-sm"
                value={sortBy}
                onChange={(e) => {
                    setSortBy(e.target.value);
                }}
            >
            <option value="Recommended">Recommended</option>
            <option value="Price (lowest to highest)">Price (lowest to highest)</option>
            <option value="Price (highest to lowest)">Price (highest to lowest)</option>
            <option value="Duration (shortest)">Duration (shortest)</option>
            <option value="Duration (longest)">Duration (longest)</option>
            <option value="Departure (earliest)">Departure (earliest)</option>
            <option value="Departure (latest)">Departure (latest)</option>
            <option value="Arrival (earliest)">Arrival (earliest)</option>
            <option value="Arrival (latest)">Arrival (latest)</option>
            </select>
        </div>

        {/* Sort Button */}
        <button
            onClick={handleSort}
            className="px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white w-fit"
        >
            Apply filters
        </button>
    </div>
  );
};

export default Filters;