import { ChevronRight, Pen } from 'lucide-react' 
import React from 'react'
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import ScrollToTop from './ScrollToTop'; 
import { motion } from 'framer-motion'; 

// Component: ProfileDetails
// Displays and manages the user's profile details in a structured, user-friendly layout.
const ProfileDetails = () => {
    // Redux selector to retrieve the current user details from the Redux store
    const { currentUser } = useSelector((state) => state.user);
    
    // Hook to navigate between routes programmatically
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0 }} // Initial opacity for entry animation
            animate={{ opacity: 1 }} // Final opacity for entry animation
            exit={{ opacity: 0 }} // Exit animation
            transition={{
                duration: 0.5, // Animation duration in seconds
                ease: "easeInOut" // Smooth easing for the animation
            }}
            className='bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10 max-w-full'
        >
            <ScrollToTop /> {/* Ensures the page scrolls to the top when loaded */}

            {/* Basic Information Section */}
            <div className='flex items-start justify-between'>
                <div className='flex flex-col gap-5'>
                    {/* Section Header */}
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-medium sm:text-3xl text-2xl'>Basic information</h2>
                        <p className='text-sm'>
                            Make sure this information matches your travel ID, like your passport or license.
                        </p>
                    </div>
                    
                    {/* User Details */}
                    <div className='w-full flex max-sm:flex-col max-sm:gap-5 justify-between text-sm'>
                        {/* Left Column: Name, DOB, Accessibility Needs */}
                        <div className='flex flex-col gap-2'>
                            <div>
                                <h3 className='font-medium'>Name</h3>
                                <div className='flex items-center gap-1'>
                                    <p>{currentUser.firstName}</p> {/* User's first name */}
                                    <p>{currentUser.lastName}</p> {/* User's last name */}
                                </div>
                            </div>
                            <div>
                                <h3 className='font-medium'>Date of birth</h3>
                                <p>{currentUser.DOB === '//' ? 'Not provided' : currentUser.DOB}</p> {/* DOB validation */}
                            </div>
                            <div>
                                <h3 className='font-medium'>Accessibility needs</h3>
                                <p>{currentUser.needs}</p> {/* Accessibility needs */}
                            </div>
                        </div>
                        
                        {/* Right Column: Bio, Gender */}
                        <div className='flex flex-col gap-2'>
                            <div>
                                <h3 className='font-medium'>Bio</h3>
                                <p>{currentUser.bio}</p> {/* User's bio */}
                            </div>
                            <div>
                                <h3 className='font-medium'>Gender</h3>
                                <p className='first-letter:uppercase'>{currentUser.gender}</p> {/* Capitalized gender */}
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    className='cursor-pointer rounded-md h-10 w-10 flex items-center justify-center'
                    onClick={() => navigate('/profile?tab=edit_basic_details')} // Navigates to edit basic details
                >
                    <Pen className='p-0.5 text-[#4078bc]' /> {/* Edit Icon */}
                </button>
            </div>

            {/* Contact Information Section */}
            <div className='flex items-start justify-between'>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-medium sm:text-3xl text-2xl'>Contact</h2>
                        <p className='text-sm'>
                            Receive account activity alerts and trip updates by sharing this information.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className='w-full flex sm:gap-72 max-sm:flex-col max-sm:gap-5 justify-between text-sm'>
                        {/* Left Column: Mobile Number, Emergency Contact */}
                        <div className='flex flex-col gap-2'>
                            <div>
                                <h3 className='font-medium'>Mobile number</h3>
                                <div>{currentUser.number === 'Not provided' || ""
                                    ? 'Not provided' // Validate phone number
                                    : <div className='flex items-center'>
                                        <p>{currentUser.countryCode}</p> {/* Country code */}
                                        <p>{currentUser.number}</p> {/* Phone number */}
                                    </div>
                                }</div>
                            </div>
                            <div>
                                <h3 className='font-medium text-nowrap'>Emergency contact</h3>
                                <div>{currentUser.emergency?.name === 'Not provided' || ' '
                                    ? 'Not provided' // Validate emergency contact
                                    : <div>{currentUser.emergency?.name}</div>
                                }</div>
                            </div>
                        </div>

                        {/* Right Column: Email, Address */}
                        <div className='flex flex-col gap-2'>
                            <div>
                                <h3 className='font-medium'>Email</h3>
                                <p>{currentUser.email}</p> {/* Email */}
                            </div>
                            <div>
                                <h3 className='font-medium'>Address</h3>
                                <div className='text-wrap'>
                                    {currentUser.location === null
                                        ? 'Not provided' // Validate address
                                        : (() => {
                                            const locationParts = [
                                                currentUser.location?.address,
                                                currentUser.location?.city,
                                                currentUser.location?.zip,
                                                currentUser.location?.state,
                                                currentUser.location?.region
                                            ].filter(part => part && part !== 'Not provided'); // Filter valid parts
                                            
                                            if (locationParts.length === 0) {
                                                return 'Not provided';
                                            }
                                            const formattedAddress = locationParts.join(', ') + '.';
                                            return <p>{formattedAddress}</p>;
                                        })()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    className='cursor-pointer rounded-md h-10 w-10 flex items-center justify-center'
                    onClick={() => navigate('/profile?tab=edit_contact_details')} // Navigates to edit contact details
                >
                    <Pen className='p-0.5 text-[#4078bc]' /> {/* Edit Icon */}
                </button>
            </div>

            {/* More Details Section */}
            <div className='flex items-start justify-between'>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-medium sm:text-3xl text-2xl'>More details</h1>
                        <p className='text-sm'>
                            Speed up your booking by securely saving essential travel details.
                        </p>
                    </div>
                    
                    {/* Additional Options */}
                    <div className='flex flex-col gap-5'>
                        {/* Option: Airport Security */}
                        <div 
                            className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                            onClick={() => navigate('/airport_security')} // Navigates to airport security details
                        >
                            <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                            <div>
                                <h2 className='font-medium'>Airport security</h2>
                                <p className='text-sm'>TSA Precheck and Redress number</p>
                            </div>
                            <ChevronRight className='absolute right-3' /> {/* Arrow Icon */}
                        </div>

                        {/* Option: Travel Documents */}
                        <div 
                            className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                            onClick={() => navigate('/travel_document')} // Navigates to travel document details
                        >
                            <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                            <div>
                                <h2 className='font-medium'>Travel documents</h2>
                                <p className='text-sm'>Passport</p>
                            </div>
                            <ChevronRight className='absolute right-3' />
                        </div>

                        {/* Option: Flight Preferences */}
                        <div 
                            className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                            onClick={() => navigate('/preference')} // Navigates to flight preferences
                        >
                            <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                            <div>
                                <h2 className='font-medium'>Flight preferences</h2>
                                <p className='text-sm'>Seat preference and home airport</p>
                            </div>
                            <ChevronRight className='absolute right-3' />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ProfileDetails;