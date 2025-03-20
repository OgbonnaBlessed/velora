import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'

const format = 'HH:mm';

const DropOff = () => {
    return (
        <div className="border rounded-xl p-3 flex items-center">
            <AiOutlineClockCircle className="text-xl" />
            <div className="w-full h-full relative">
                <label
                    htmlFor="drop-off-time"
                    className={`absolute left-3 text-sm font-Poppins cursor-text top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2 text-nowrap`}
                >
                    Drop off time
                </label>
                <TimePicker 
                    id='drop-off-time'
                    use12Hours
                    inputReadOnly={true}
                    suffixIcon={null}
                    defaultValue={dayjs('10:00', format)} 
                    format={format} 
                /> 
            </div>
        </div>
    )
}

export default DropOff