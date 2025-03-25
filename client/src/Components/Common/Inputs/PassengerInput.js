import React, { useState, useEffect, useRef } from 'react'
import { FaUserAlt } from 'react-icons/fa';

const PassengerInput = ({ formData, setFormData }) => {
    // State to store the list of seats, with each seat having passengers count
    const [seats, setSeats] = useState([{ passengers: 1 }]);
    // State to store the text display for input field
    const [passengersInput, setPassengersInput] = useState('1 passenger, 1 seat');
    // State to handle modal visibility when selecting passenger details
    const [passengerModalOpen, setPassengerModalOpen] = useState(false);
    // Reference for outside click detection to close modal when clicked outside
    const passengerRef = useRef();

    // Function to add a new seat (up to a maximum of 3 seats)
    const addSeat = () => {
        if (seats.length < 3) {
            setSeats([...seats, { passengers: 1 }]);
        }
    };

    // Function to remove a specific seat from the list
    const removeSeat = (index) => {
        const updatedSeats = seats.filter((_, i) => i !== index);
        setSeats(updatedSeats);
    };

    // Function to handle changes in the number of passengers in a specific seat
    const handleSeatChange = (index, type, value) => {
        setSeats((prevSeats) => {
            const updatedSeats = [...prevSeats];
            updatedSeats[index][type] = value;
            return updatedSeats;
        });
    };

    // Function to submit the passenger details and update form data and the display input
    const submitPassengers = () => {
        // Calculate total number of passengers
        const totalPassengers = seats.reduce((sum, seat) => sum + seat.passengers, 0);

        // Update the parent formData with the new passengers count and seat count
        setFormData((prev) => ({
            ...prev,
            passengers: totalPassengers,
            seats: seats.length
        }));

        // Update the text input display
        setPassengersInput(
            `${totalPassengers} passenger${totalPassengers > 1 ? 's' : ''}, ${seats.length} seat${seats.length > 1 ? 's' : ''}`
        );
        // Close the modal after submitting
        setPassengerModalOpen(false);
    };

    // Effect hook to update the passengers input text whenever the formData changes
    useEffect(() => {
        setPassengersInput(
            `${formData.passengers} passenger${formData.passengers > 1 ? 's' : ''}, ${formData.seats} seat${formData.seats > 1 ? 's' : ''}`
        );
    }, [formData]);

    // Function to detect click outside the modal to close it
    const handleOutsideClick = (event) => {
        if (passengerRef.current && !passengerRef.current.contains(event.target)) {
            setPassengerModalOpen(false);
        }
    };

    // Effect hook to add and clean up the outside click event listener
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div
            className="border rounded-xl p-3 flex items-center flex-1 relative"
            ref={passengerRef}  // Attach the ref to the outer div for outside click detection
        >
            <FaUserAlt className="text-xl" />  {/* Icon for passenger input field */}
            <div className="w-full h-full relative">
                {/* Label for the input field */}
                <label
                    htmlFor="passengers"
                    className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-2 transform -translate-y-1/2"
                >
                    Passengers
                </label>
                {/* Read-only input that displays passenger and seat details */}
                <input
                    type="text"
                    id="passengers"
                    value={passengersInput}
                    onFocus={() => setPassengerModalOpen(true)}  // Open modal when input is focused
                    className="px-3 pt-2 w-full bg-transparent font-sans font-normal"
                    autoComplete="off"
                    readOnly  // Prevent editing directly in the input
                />
            </div>
            {/* passenger details modal */}
            <div
                className={`absolute top-16 left-0 z-20 bg-white p-4 shadow shadow-gray-300 rounded-xl text-sm w-52 flex flex-col gap-4 transition-all duration-300 ease-in-out font-sans font-normal
                    ${passengerModalOpen
                        ? 'translate-y-0 opacity-1 pointer-events-auto'
                        : '-translate-y-5 opacity-0 pointer-events-none'
                    }
                `}
            >
                {/* Loop through seats to display options for each seat */}
                {seats.map((seat, index) => (
                    <div key={index} className="flex flex-col gap-3">
                        <h4 className="font-bold">Seat {index + 1}</h4>
                        <div className="flex flex-col gap-2">
                            {/* passengers input for the seat */}
                            <div className="flex justify-between items-center">
                                <span>Passengers</span>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className={`border border-gray-50 w-8 h-8 flex items-center justify-center font-semibold text-xl rounded-full
                                            ${seats[index].passengers === 1 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleSeatChange(index, 'passengers', Math.max(1, seats[index].passengers - 1))
                                        }
                                        type="button"
                                    >
                                        -
                                    </button>
                                    <span>{seats[index].passengers}</span>
                                    <button
                                        className={`border border-gray-50 font-semibold text-lg w-8 h-8 flex items-center justify-center rounded-full
                                            ${seats[index].passengers === 14 
                                                ? 'bg-gray-50 text-gray-300 cursor-no-drop' 
                                                : 'bg-white text-black'
                                            }`
                                        }
                                        onClick={() =>
                                            handleSeatChange(index, 'passengers', Math.min(14, seats[index].passengers + 1))
                                        }
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Button to remove a seat (only if there is more than one seat) */}
                        {index > 0 && (
                            <button
                                className="text-[#48aadf] text-sm py-2 self-end"
                                onClick={() => removeSeat(index)}
                                type="button"
                            >
                                Remove Seat
                            </button>
                        )}
                    </div>
                ))}
                {/* Display "Add another seat" option if the number of seats is less than 3 */}
                {seats.length < 3 && (
                    <p 
                        className="text-[#48aadf] cursor-pointer" 
                        onClick={addSeat}
                    >
                        Add another seat
                    </p>
                )}
                {/* Button to finalize the passenger details */}
                <button
                    onClick={submitPassengers}
                    className="bg-[#48aadf] text-white px-5 py-2 rounded-full font-semibold cursor-pointer"
                    type="button"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default PassengerInput;