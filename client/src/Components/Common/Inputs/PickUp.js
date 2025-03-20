import { TimePicker } from 'antd'
import React from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import dayjs from 'dayjs'

const format = 'HH:mm';

const PickUp = () => {
    return (
        <div className="border rounded-xl p-3 flex items-center">
            <AiOutlineClockCircle className="text-xl" />
            <div className="w-full h-full relative">
                <label
                    htmlFor="pick-up-time"
                    className="absolute left-3 text-sm font-Poppins text-nowrap cursor-text top-[0.1rem] scale-75 -translate-x-3 transform -translate-y-1/2"
                >
                    Pick up time
                </label>
                <TimePicker
                    id='pick-up-time'
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

export default PickUp