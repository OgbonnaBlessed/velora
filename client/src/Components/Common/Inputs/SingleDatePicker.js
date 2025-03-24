import React from 'react'
import { DatePicker } from 'antd';
import { FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs';

const SingleDatePicker = ({ onDateChange, defaultDate, label }) => {
    const today = dayjs(); // Get today's date using dayjs.
    
    const handleDateChange = (selectedDate) => {
        if (selectedDate) { // Check if two dates are selected (start and end dates)
            const date = selectedDate; // Destructuring to get the start and end date
            onDateChange(date); // Call the onDateChange callback with the selected dates
        }
    };
    
    return (
        <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaRegCalendarAlt className="text-xl" />
            <div className="w-full h-full relative">
                <label
                    htmlFor="date"
                    className="absolute left-3 text-[0.65rem] font-Poppins text-nowrap cursor-text top-[0.1rem] transform -translate-y-1/2"
                >
                    { label }
                </label>
                <DatePicker
                    suffixIcon={null}
                    format={"MMM DD"}
                    defaultValue={defaultDate}
                    minDate={today}
                    allowClear={false} // Optional: allows clearing the input
                    inputReadOnly={true}
                    onChange={handleDateChange}
                    popupClassName="responsive-calendar" // Apply custom class for responsiveness
                />
            </div>
        </div>
    )
}

export default SingleDatePicker;