import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { 
  updateFailure, 
  updateStart, 
  updateSuccess, 
} from '../redux/user/userSlice'; // Import Redux actions for handling user updates
import { motion } from 'framer-motion'; // For animation transitions

const UpdateEmail = () => {
    // Access the current user from the Redux store
    const { currentUser } = useSelector((state) => state.user);
    // Set up local state to manage input focus, loading status, modal message, and form data
    const [isFocused3, setIsFocused3] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate(); // Hook for navigation
    const dispatch = useDispatch(); // Dispatch function for Redux actions

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData['email'])) {
            setModalMessage("Please enter a valid email address.");
            return;
        }
    
        setLoading(true); // Start loading spinner
    
        try {
            dispatch(updateStart()); // Dispatch update start action
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // Include credentials (cookies) in the request
            });
    
            const data = await res.json();
            console.log(data);
    
            if (!res.ok) {
                dispatch(updateFailure(data.message)); // Dispatch failure action
                setModalMessage(data.message); // Set error message for modal
            } else {
                navigate('/email-update-success'); // Navigate to success page
                dispatch(updateSuccess(data)); // Dispatch success action
            }
        } catch (error) {
            setModalMessage(error.message); // Set error message if request fails
            dispatch(updateFailure(error.message)); // Dispatch failure action
        } finally {
            setLoading(false); // Stop loading spinner after request completes
        }
    };

    // Function to handle changes in form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    // Automatically hide modal message after 3 seconds
    useEffect(() => {
        if (modalMessage) {
            const timer = setTimeout(() => {
                setModalMessage(null); // Clear modal message
            }, 3000); // Hide message after 3 seconds
    
            // Cleanup timer when component unmounts or modalMessage changes
            return () => clearTimeout(timer);
        }
    }, [modalMessage]);

  return (
    <motion.div 
        initial={{ opacity: 0 }} // Initial state of the motion component (invisible)
        animate={{ opacity: 1 }} // Animate to full opacity
        exit={{ opacity: 0 }} // Exit state (invisible)
        transition={{
            duration: .5, // Transition duration
            ease: "easeInOut" // Ease function for smooth transition
        }} 
        className='bg-white fixed w-full h-full inset-0 z-[10000] flex justify-center'
    >
        <form onSubmit={handleSubmit} className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
            {/* Back button */}
            <div 
                className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                onClick={() => {
                    navigate(-1); // Go back to the previous page
                }}
            >
                <ArrowLeft />
            </div>

            {/* Logo section */}
            <div className='flex items-center justify-center gap-1 w-full mb-5'>
                <img 
                    src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                    alt="Velora logo" 
                    className='w-14 bg-black p-1 rounded-br-xl'
                />
            </div>
            
            {/* Heading and description */}
            <h1 className='text-3xl font-semibold'>Change Email</h1>
            <p className='text-sm'>
                Your new email will be used for all communications regarding your bookings, account updates, and other important information. Please ensure it's correct.
            </p>

            {/* Form inputs */}
            <div className='w-full flex flex-col gap-5'>
                {/* Current email input */}
                <div className='relative text-black'>
                    <label
                        htmlFor="current-email"
                        className="absolute left-5 transition-all duration-300 ease-in-out cursor-text top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-3"
                    >
                        Current email
                    </label>
                    <input 
                        id='current-email'
                        type='email'
                        value={currentUser.email} // Display current user's email
                        className="w-full shadow shadow-gray-400 rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                        readOnly // Input is read-only
                    />
                </div>

                {/* New email input */}
                <div className='relative text-black'>
                    <label
                        htmlFor="email"
                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
                            ${isFocused3
                                ? 'top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-2' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2 text-black'
                            }`
                        }
                    >
                        New email
                    </label>
                    <input 
                        id='email'
                        type='email'
                        autoComplete='off'
                        onFocus={() => setIsFocused3(true)} // Focus event to scale label
                        onBlur={(e) => !e.target.value && setIsFocused3(false)} // Reset if input is empty
                        onChange={handleChange} 
                        className="w-full shadow shadow-gray-400 rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                    />
                </div>
            </div>

            {/* Modal message for errors */}
            <p 
                className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out 
                    ${
                        modalMessage 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-5 pointer-events-none'
                    }`
                }
            >
                {modalMessage}
            </p>

            {/* Submit button */}
            <button 
                type="submit"
                disabled={loading} // Disable button when loading
                className={`w-full h-12 text-white rounded-full border-none outline-none flex items-center justify-center gap-2 transition-all duration-300 ease-in-out font-semibold
                    ${loading 
                        ? 'bg-[#48aadf96] cursor-not-allowed' 
                        : 'bg-[#48aadf] cursor-pointer'
                    }`
                }
            >
                {/* Display loading spinner when submitting */}
                {loading 
                    ?   <SyncLoader 
                            color="#fff" // Customize the color
                            loading={loading} 
                            size={7} // Customize the size
                            margin={2} // Customize the margin between circles
                        />
                    : 'Update email'
                }
            </button>
        </form>
    </motion.div>
  )
}

export default UpdateEmail;