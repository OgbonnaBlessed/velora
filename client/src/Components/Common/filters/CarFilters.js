import { ChevronDown, ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CarFilters = ({ handleSubmit }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState(100); // Default price range
    const [carType, setCarType] = useState(""); // Car type selection
    const [fuelType, setFuelType] = useState(""); // Fuel type selection
    const [transmission, setTransmission] = useState(""); // Transmission type
    const [sortBy, setSortBy] = useState("Recommended"); // Sort option
    const filterRef = useRef(null);

    // Function to handle the form submission by passing filter values to the parent component
    const handleSort = () => {
        setTimeout(() => {
            setShowFilters(false);
        }, 3000);
        handleSubmit({ priceRange, carType, fuelType, transmission, sortBy });
    };

    // Close filters when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Render checkbox input
    const renderCheckbox = (id, label, isChecked, toggleFn, key) => (
        <div className="flex items-center" key={key}>
            <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={toggleFn}
                className="hidden"
            />
            <label htmlFor={id} className="flex items-center cursor-pointer">
                <div
                    className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300
                        ${isChecked 
                            ? "border-[#48aadf] bg-[#48aadf]" 
                            : "border-gray-300"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                            ${isChecked ? "opacity-100" : "opacity-0"}`}
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
        <div>
            <button 
                type="button"
                className="bg-blue-100 px-6 py-2 cursor-pointer active:scale-90 rounded-md text-sm font-Grotesk transition-all duration-300 ease-in-out"
                onClick={() => setShowFilters(!showFilters)}
            >
                Filters
            </button>
            <AnimatePresence mode="wait">
                {showFilters && (
                    <motion.div 
                        key="filters-full"
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black/20 flex justify-start z-[10002]"
                    >
                        <motion.div 
                            ref={filterRef}
                            initial={{ opacity: 0, x: "-100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "-100%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="max-w-full w-md bg-white rounded-r-lg shadow-xl h-full overflow-auto p-5"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Car Filters</h2>
                                <ChevronLeft 
                                    className="cursor-pointer"
                                    onClick={() => setShowFilters(false)}
                                />
                            </div>

                            <div className="flex flex-col space-y-8">
                                {/* Price Range Filter */}
                                <div className="flex flex-col gap-2 w-64 max-w-full">
                                    <label htmlFor="price-range" className="font-Grotesk font-semibold">
                                        Price Range: ${priceRange}
                                    </label>
                                    <input
                                        type="range"
                                        id="price-range"
                                        min="50"
                                        max="500"
                                        step="10"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full cursor-grabbing"
                                    />
                                </div>

                                {/* Car Type Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-Grotesk font-semibold">Car Type</label>
                                    <div className="flex flex-col gap-2">
                                        {["SUV", "Sedan", "Hatchback", "Truck", "Convertible"].map((type) =>
                                            renderCheckbox(
                                                type,
                                                type,
                                                carType === type,
                                                () => setCarType(type),
                                                type
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Fuel Type Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-Grotesk font-semibold">Fuel Type</label>
                                    <div className="flex flex-col gap-2">
                                        {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) =>
                                            renderCheckbox(
                                                fuel,
                                                fuel,
                                                fuelType === fuel,
                                                () => setFuelType(fuel),
                                                fuel
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Transmission Type Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-Grotesk font-semibold">Transmission</label>
                                    <div className="flex flex-col gap-2">
                                        {["Automatic", "Manual"].map((trans) =>
                                            renderCheckbox(
                                                trans,
                                                trans,
                                                transmission === trans,
                                                () => setTransmission(trans),
                                                trans
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Sort By Filter */}
                                <div className="relative w-fit font-Poppins font-normal">
                                    <ChevronDown className="absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                    <label htmlFor="sort-filter" className="text-[0.7rem] absolute top-2.5 left-4">
                                        Sort by
                                    </label>
                                    <select
                                        id="sort-filter"
                                        className="shadow shadow-gray-300 pt-7 pb-3 px-4 bg-transparent rounded-md w-56 text-black appearance-none cursor-pointer text-sm"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="Recommended">Recommended</option>
                                        <option value="Price (lowest to highest)">Price (lowest to highest)</option>
                                        <option value="Price (highest to lowest)">Price (highest to lowest)</option>
                                        <option value="Mileage (lowest to highest)">Mileage (lowest to highest)</option>
                                    </select>
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handleSort}
                                    className="px-8 py-3 bg-[#48aadf] hover:bg-[#48aadf]/80 active:scale-90 font-semibold cursor-pointer rounded-full text-white w-fit transition-all duration-300 ease-in-out self-center font-Grotesk"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarFilters;