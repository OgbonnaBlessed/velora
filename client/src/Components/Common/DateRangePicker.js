import React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { FaRegCalendarAlt } from 'react-icons/fa';

const { RangePicker } = DatePicker;

const DateRangePicker = ({ onDateChange }) => {
    const today = dayjs();
    const twoDaysLater = today.add(2, 'day');

    const handleDateChange = (selectedDates) => {
        if (selectedDates?.length === 2) {
            const [startDate, endDate] = selectedDates;
            onDateChange([startDate, endDate]);
        }
    };

  return (
    <div className="border rounded-xl p-3 flex items-center flex-1">
        <FaRegCalendarAlt className="text-xl" />
        <div className="w-full h-full relative">
            <label
                htmlFor="date"
                className="absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-1 transform -translate-y-1/2"
            >
                Date
            </label>
            <RangePicker
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
  );
};

export default DateRangePicker;