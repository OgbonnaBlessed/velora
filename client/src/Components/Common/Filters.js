import { ChevronDown } from "lucide-react"; // Importing the ChevronDown icon from the 'lucide-react' library
import React, { useState } from "react"; // Importing React and useState hook

const Filters = ({ handleSubmit }) => {
    // Initializing state for price range, number of stops, baggage options, and sort by selection
    const [priceRange, setPriceRange] = useState(500); // Default price range
    const [stops, setStops] = useState(""); // State for storing selected number of stops
    const [baggage, setBaggage] = useState({ seatChoice: false, carryOnBag: false, noCancelFee: false }); // State for baggage options
    const [sortBy, setSortBy] = useState("Recommended"); // Default sort option

    // Function to handle the form submission by passing filter values to the parent component
    const handleSort = () => {
        handleSubmit({ priceRange, stops, baggage, sortBy });
    };

    // Function to render a checkbox input element with custom styling
    const renderCheckbox = (id, label, isChecked, toggleFn, key) => (
        <div 
            className="flex items-center" // Flexbox for aligning checkbox and label
            key={key} // Unique key for each checkbox element
        >
            <input
                type="checkbox"
                id={id}
                checked={isChecked} // Checked state controlled by isChecked prop
                onChange={toggleFn} // Function to toggle checkbox state
                className="hidden" // Hide default checkbox appearance
            />
            <label 
                htmlFor={id} 
                className="flex items-center cursor-pointer" // Styling the label to look clickable
            >
                <div
                    className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300
                        ${isChecked 
                            ? "border-[#48aadf] bg-[#48aadf]" // Highlight when checked
                            : "border-gray-300" // Default border when unchecked
                        }`
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                            ${ isChecked ? "opacity-100" : "opacity-0" }`} // Show the checkmark when checked
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> {/* Checkmark path */}
                    </svg>
                </div>
                <span className="ml-2 text-black text-sm">{label}</span> {/* Label text for checkbox */}
            </label>
        </div>
    );

  return (
    <div className="flex flex-wrap gap-5 w-full items-start justify-between">
        {/* Price Range Filter Section */}
        <div className="flex flex-col gap-2 w-64 max-w-full">
            <label 
                htmlFor="price-range" 
                className="font-Grotesk font-semibold"
            >
                Price Range: ${priceRange} {/* Displaying current price range value */}
            </label>
            <input
                type="range"
                id="price-range"
                min="0"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)} // Updating price range state on change
                className="w-full cursor-grabbing" // Styling for range input
            />
        </div>

        {/* Number of Stops Filter Section */}
        <div className="flex flex-col gap-2 font-Poppins font-[400]">
            <label className="font-Grotesk font-semibold">Number of Stops</label> {/* Label for stops filter */}
            <div className="flex flex-col gap-2">
                {[
                    { label: "1 Stop", value: "oneStop" },
                    { label: "2 Stops", value: "twoStops" },
                    { label: "3+ Stops", value: "threePlusStops" },
                ].map((stop) =>
                    renderCheckbox(
                        stop.value,
                        stop.label,
                        stops === stop.value, // Checked if current stop value matches state
                        () => setStops(stop.value), // Update stops state on selection
                        stop.value // Unique key for each checkbox
                    )
                )}
            </div>
        </div>

        {/* Travel and Baggage Filter Section */}
        <div className="flex flex-col gap-2 font-Poppins font-[400]">
            <label className="font-Grotesk font-semibold">Travel and Baggage</label> {/* Label for baggage options */}
            <div className="flex flex-col gap-2 text-sm">
                {[
                    { label: "Seat Choice Included", key: "seatChoice" },
                    { label: "Carry-On Bag Included", key: "carryOnBag" },
                    { label: "No Cancel Fee", key: "noCancelFee" },
                ].map((option) =>
                    renderCheckbox(
                    option.key,
                    option.label,
                    baggage[option.key], // Checked state based on baggage state
                    () => setBaggage((prev) => ({ ...prev, [option.key]: !prev[option.key] })), // Toggle baggage option on click
                    option.key // Unique key for each checkbox
                    )
                )}
            </div>
        </div>

        {/* Sort By Dropdown Section */}
        <div className="relative w-fit font-Poppins font-normal">
            <ChevronDown className="absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none" /> {/* Chevron icon for dropdown */}
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
                    setSortBy(e.target.value); // Update sort option on change
                }}
            >
            <option value="Recommended">Recommended</option> {/* Sort options */}
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

        {/* Apply Filters Button */}
        <button
            onClick={handleSort} // Trigger the sort/filter when clicked
            className="px-8 py-3 bg-[#48aadf] font-semibold cursor-pointer rounded-full text-white w-fit"
        >
            Apply filters {/* Button text */}
        </button>
    </div>
  );
};

export default Filters; // Exporting the Filters component for use in other parts of the app