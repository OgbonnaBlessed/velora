import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PasswordResetSuccessful = () => {
    const navigate = useNavigate();

  return (
    <div className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'>
        <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
            <div 
                className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <ArrowLeft />
            </div>

            <div className='flex items-center justify-center gap-1 w-full mb-5'>
                <img 
                    src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                    alt="Velora logo" 
                    className='w-14 bg-black p-1 rounded-br-xl'
                />
            </div>
            <p className='text-black font-medium text-2xl text-center'>
                Your password has been successfully changed.
            </p>
            <button
                className='bg-[#48aadf] rounded-full py-3 w-full text-white font-semibold cursor-pointer shrink-button'
                onClick={() => navigate('/profile?tab=settings')}
            >
                OK
            </button>
        </div>
    </div>
  )
}

export default PasswordResetSuccessful