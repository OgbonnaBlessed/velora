import { ChevronRight, Pen } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { motion } from 'framer-motion';

const ProfileDetails = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            duration: .5,
            ease: "easeInOut"
        }}
        className='bg-blue-100 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10 max-w-full'
    >
        <ScrollToTop/>
        <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                    <h2 className='font-medium sm:text-3xl text-2xl'>Basic information</h2>
                    <p className='text-sm'>Make sure this information matches your travel ID, like your passport or license.</p>
                </div>
                <div className='w-full flex max-sm:flex-col max-sm:gap-5 justify-between text-sm'>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h3 className='font-medium'>Name</h3>
                            <div className='flex items-center gap-1'>
                                <p>{currentUser.firstName}</p>
                                <p>{currentUser.lastName}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className='font-medium'>Date of birth</h3>
                            <p>{currentUser.DOB === '//' ? 'Not provided' : currentUser.DOB}</p>
                        </div>
                        <div>
                            <h3 className='font-medium'>Accessibility needs</h3>
                            <p>{currentUser.needs}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h3 className='font-medium'>Bio</h3>
                            <p>{currentUser.bio}</p>
                        </div>
                        <div>
                            <h3 className='font-medium'>Gender</h3>
                            <p className='first-letter:uppercase'>{currentUser.gender}</p>
                        </div>
                    </div>
                </div>
            </div>
            <button 
                className='cursor-pointer rounded-md h-10 w-10 flex items-center justify-center'
                onClick={() => navigate('/profile?tab=edit_basic_details')}
            >
                <Pen className='p-0.5 text-[#4078bc]'/>
            </button>
        </div>

        <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                    <h2 className='font-medium sm:text-3xl text-2xl'>Contact</h2>
                    <p className='text-sm'>Receive account activity alerts and trip updates by sharing this information.</p>
                </div>
                <div className='w-full flex sm:gap-72 max-sm:flex-col max-sm:gap-5 justify-between text-sm'>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h3 className='font-medium'>Mobile number</h3>
                            <div>{currentUser.number === 'Not provided' || ""
                                ? 'Not provided' 
                                :   <div className='flex items-center'>
                                        <p>{currentUser.countryCode}</p> 
                                        <p>{currentUser.number}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div>
                            <h3 className='font-medium text-nowrap'>Emergency contact</h3>
                            <div>{currentUser.emergency?.name === 'Not provided' || ' '
                                ? 'Not provided' 
                                :   <div>
                                        {currentUser.emergency?.name}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h3 className='font-medium'>Email</h3>
                            <p>{currentUser.email}</p>
                        </div>
                        <div>
                            <h3 className='font-medium'>Address</h3>
                            <div className='text-wrap'>
                                {currentUser.location === null
                                    ? 'Not provided'
                                    : (() => {
                                        // Create an array of location parts
                                        const locationParts = [
                                            currentUser.location?.address,
                                            currentUser.location?.city,
                                            currentUser.location?.zip,
                                            currentUser.location?.state,
                                            currentUser.location?.region
                                        ]
                                        // Filter out empty or "Not provided" values
                                        .filter(part => part && part !== 'Not provided');
                                        
                                        // If no valid parts, display "Not provided"
                                        if (locationParts.length === 0) {
                                            return 'Not provided';
                                        }

                                        // Join the filtered values into a single string
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
                onClick={() => navigate('/profile?tab=edit_contact_details')}
            >
                <Pen className='p-0.5 text-[#4078bc]'/>
            </button>
        </div>

        <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                    <h1 className='font-medium sm:text-3xl text-2xl'>More details</h1>
                    <p className='text-sm'>Speed up your booking by securely saving essential travel details.</p>
                </div>
                <div className='flex flex-col gap-5'>
                    <div 
                        className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                        onClick={() => navigate('/airport_security')}
                    >
                        <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                        <div>
                            <h2 className='font-medium'>Airport security</h2>
                            <p className='text-sm'>TSA Precheck and Redress number</p>
                        </div>
                        <ChevronRight className='absolute right-3'/>
                    </div>
                    <div 
                        className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                        onClick={() => navigate('/travel_document')}
                    >
                        <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                        <div>
                            <h2 className='font-medium'>Travel documents</h2>
                            <p className='text-sm'>Passport</p>
                        </div>
                        <ChevronRight className='absolute right-3'/>
                    </div>
                    <div 
                        className='bg-white py-3 pl-8 flex items-center cursor-pointer rounded-lg w-72 max-w-[95%] relative shadow shadow-gray-300'
                        onClick={() => navigate('/preference')}
                    >
                        <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                        <div>
                            <h2 className='font-medium'>Flight preferences</h2>
                            <p className='text-sm'>Seat preference and home airport</p>
                        </div>
                        <ChevronRight className='absolute right-3'/>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default ProfileDetails