import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    // Main footer container with styling for layout and spacing
    <div className='flex flex-col gap-2 bg-gray-200 text-black m-2 rounded-md py-8 lg:px-20 px-10'>
      
      {/* Logo link that navigates to the home page */}
      <Link 
        to='/'
        className='px-4 py-2 w-fit'
      >
        {/* Company logo/title */}
        <h1 className='font-serif text-2xl'>velora group</h1>
      </Link>

      {/* Footer links container with grid layout for responsive design */}
      <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 py-5 border-b border-gray-300 pb-8'>
        
        {/* First column - Company links */}
        <div className='flex flex-col gap-3'>
          {/* Section header for Company */}
          <h3 className='font-medium text-sm'>Company</h3>
          <div className='flex flex-col gap-3 text-[#1158a6] no-underline text-[0.8rem]'>
            {/* List of links related to company information */}
            <Link className='hover:underline transition-all duration-300 ease-in-out'>About</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Jobs</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>List your property</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Partnerships</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Newsroom</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Investor Relations</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Advertising</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Affliate Marketing</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Feedback</Link>
          </div>
        </div>
        
        {/* Second column - Explore links */}
        <div className='flex flex-col gap-3'>
          {/* Section header for Explore */}
          <h3 className='font-medium text-sm'>Explore</h3>
          <div className='flex flex-col gap-3 text-[#1158a6] no-underline text-[0.8rem]'>
            {/* List of links for exploring specific content */}
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              United States of America travel guide
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Hotels in United States of America
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Vacation rentals in United States of America
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Vacation packages in United  States of America
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Domestic flights
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Car rentals in United States of America
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              All accommodation types
            </Link>
          </div>
        </div>
        
        {/* Third column - Policies links */}
        <div className='flex flex-col gap-3'>
          {/* Section header for Policies */}
          <h3 className='font-medium text-sm'>Policies</h3>
          <div className='flex flex-col gap-3 text-[#1158a6] no-underline text-[0.8rem]'>
            {/* List of links for various policies */}
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Privacy
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Cookies
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Terms of use
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Accessibility
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Your privacy choices
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Content guidelines and reporting guidelines
            </Link>
          </div>
        </div>
        
        {/* Fourth column - Help links */}
        <div className='flex flex-col gap-3'>
          {/* Section header for Help */}
          <h3 className='font-medium text-sm'>Help</h3>
          <div className='flex flex-col gap-3 text-[#1158a6] no-underline text-[0.8rem]'>
            {/* List of links related to customer support */}
            <Link className='hover:underline transition-all duration-300 ease-in-out'>Support</Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Cancel your hotel or vacation rental booking
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Cancel your flight
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Refund timelines, policies & processes
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              Use an Velora coupon
            </Link>
            <Link className='hover:underline transition-all duration-300 ease-in-out'>
              International travel documents
            </Link>
          </div>
        </div>
      </div>

      {/* Footer copyright text */}
      <p className='text-[0.75rem] text-center mt-5'>
        © 2024 Velora, Inc., a Velora Group company. All rights reserved. Velora and the Velora Logo are trademarks or registered trademarks of Velora, Inc.
      </p>
    </div>
  )
}

export default Footer