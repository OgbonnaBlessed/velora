import React from 'react'
import { DatePicker } from 'antd';
import { FaRegCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs';

const SingleDatePicker = () => {
    const today = dayjs(); // Get today's date using dayjs.
    const twoDaysLater = today.add(2, "day"); // Get the date 2 days from today.
    
    const handleDateChange = (selectedDates) => {
        // The function for handling date change is currently commented out, could be used for future improvements.
    };
    
    return (
        <div className="border rounded-xl p-3 flex items-center flex-1">
            <FaRegCalendarAlt className="text-xl" />
            <div className="w-full h-full relative">
                <label
                    htmlFor="date"
                    className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-4 transform -translate-y-1/2"
                >
                    Flight arrival date
                </label>
                <DatePicker
                    suffixIcon={null}
                    format={"MMM DD"}
                    defaultValue={[today, twoDaysLater]}
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