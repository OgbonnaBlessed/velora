import { TimePicker } from 'antd'
import dayjs from 'dayjs';
import React from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

const format = 'h:mm a';

const PickUp = ({ onTimeChange, value, label }) => {
    return (
        <div className="border rounded-xl p-3 flex items-center">
            <AiOutlineClockCircle className="text-xl" />
            <div className="w-full h-full relative">
                <div
                    className="absolute text-sm font-Poppins text-nowrap cursor-text top-[0.1rem] scale-75 transform -translate-y-1/2"
                >
                    { label || 'Pick up time' }
                </div>
                <TimePicker
                    use12Hours
                    inputReadOnly={true}
                    suffixIcon={null}
                    value={dayjs(value, format)}
                    format={format} 
                    onChange={(time) => onTimeChange(time ? time.format(format) : '')}
                />
            </div>
        </div>
    )
}

export default PickUp