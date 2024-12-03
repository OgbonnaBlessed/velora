import React from 'react'
import { Link } from 'react-router-dom'

const ProfileReviews = () => {
  return (
    <div className='bg-gray-100 rounded-3xl p-14 flex-1 flex flex-col gap-10'>
        <div className='flex flex-col items-center gap-3'>
            <p className='text-2xl font-semibold'>
                Your first review awaits...
            </p>
            <Link
                to='/'
                className='text-[#48aadf] hover:underline'
            >
                book your next adventure
            </Link>
        </div>
    </div>
  )
}

export default ProfileReviews
