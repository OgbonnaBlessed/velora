import React from 'react'
import { Link } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import { motion } from 'framer-motion'

const ProfileReviews = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            duration: .5,
            ease: "easeInOut"
        }}
        className='bg-blue-100 rounded-3xl p-14 flex-1 flex flex-col gap-10'
    >
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
    </motion.div>
  )
}

export default ProfileReviews
