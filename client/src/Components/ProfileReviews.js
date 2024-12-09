import React from 'react'
import { Link } from 'react-router-dom'

const ProfileReviews = () => {
  return (
    <div className='bg-blue-50 bg-opacity-50 rounded-3xl p-14 flex-1 flex flex-col gap-10'>
        <div className='flex flex-col items-center sm:gap-3 gap-1'>
            <p className='sm:text-2xl text-xl font-semibold'>
                Your first review awaits...
            </p>
            <Link
                to='/'
                className='text-[#48aadf] hover:underline max-sm:text-sm'
            >
                book your next adventure
            </Link>
        </div>
    </div>
  )
}

export default ProfileReviews
