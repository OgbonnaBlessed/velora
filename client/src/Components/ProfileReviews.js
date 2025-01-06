import React from 'react'
import { Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

const ProfileReviews = () => {
  return (
    <div className='bg-blue-100 rounded-3xl p-14 flex-1 flex flex-col gap-10'>
        <ScrollToTop/>
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
