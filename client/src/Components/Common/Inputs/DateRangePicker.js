import React, { useEffect, useState } from 'react'; // Importing React, useState, and useEffect hooks
import dayjs from 'dayjs'; // Importing dayjs for date manipulation
import { DatePicker } from 'antd'; // Importing DatePicker component from Ant Design
import { FaRegCalendarAlt } from 'react-icons/fa'; // Importing calendar icon from react-icons

const { RangePicker } = DatePicker; // Destructuring to get RangePicker component from DatePicker

// DateRangePicker component takes in two props: onDateChange and defaultDates
const DateRangePicker = ({ onDateChange, defaultDates, label }) => {
    const today = dayjs(); // Getting the current date using dayjs
    const [dates, setDates] = useState(defaultDates); // State to manage the selected date range, initialized with defaultDates

    // useEffect hook to update the date range when the defaultDates prop changes
    useEffect(() => {
        setDates(defaultDates); // Set the date range when defaultDates prop is updated
    }, [defaultDates]); // Dependency array, ensuring effect runs only when defaultDates changes

    // Function to handle date selection changes from the date picker
    const handleDateChange = (selectedDates) => {
        if (selectedDates?.length === 2) { // Check if two dates are selected (start and end dates)
            const [startDate, endDate] = selectedDates; // Destructuring to get the start and end date
            onDateChange([startDate, endDate]); // Call the onDateChange callback with the selected dates
        }
    };

  return (
    <div className="border rounded-xl p-3 flex items-center flex-1"> {/* Wrapper div for styling the component */}
        <FaRegCalendarAlt className="text-xl" /> {/* Calendar icon, adds visual representation */}
        
        <div className="w-full h-full relative"> {/* Container for the DatePicker input field */}
            
            {/* Label for the DatePicker input */}
            <label
                htmlFor="date" // Associate label with the date input
                className="absolute left-3 text-[0.65rem] font-Poppins text-nowrap cursor-text top-[0.1rem] transform -translate-y-1/2"
            >
                { label || 'Date' } {/* Label text */}
            </label>
            
            {/* RangePicker from Ant Design for selecting a date range */}
            <RangePicker
                suffixIcon={null} // Hides the default suffix icon in the input field
                format={"MMM DD"} // Format for displaying selected dates
                value={dates} // Controlled value for the selected date range
                minDate={today} // Prevents selecting dates in the past by setting minimum date to today
                allowClear={false} // Disables the option to clear the date selection
                inputReadOnly={true} // Makes the input field read-only to force selection via the calendar popup
                onChange={handleDateChange} // Triggered when the date range changes
                popupClassName="responsive-calendar" // Custom class for styling the calendar popup (e.g., for responsiveness)
            />
        </div>
    </div>
  );
};

export default DateRangePicker; // Exporting the DateRangePicker component for use in other parts of the application