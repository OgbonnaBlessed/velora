import React from 'react'
import { FcGoogle } from 'react-icons/fc'

const OAuth = ({ label }) => {
  return (
    <button 
        className='flex rounded-md bg-[#4078bc] p-2 items-center w-96 max-w-full cursor-pointer'
        type="submit"
    >
        <div className='bg-white p-2 rounded-md text-lg'>
            <FcGoogle />
        </div>
        <p className='text-center text-white w-full'>{label}</p>
    </button>
  )
}

export default OAuth