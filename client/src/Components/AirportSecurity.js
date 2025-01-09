import { X } from 'lucide-react'; // Importing the X icon from lucide-react
import React, { useEffect, useRef, useState } from 'react'; // Importing React hooks
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation
import { AnimatePresence, motion } from 'framer-motion'; // Importing animation hooks from framer-motion
import { useDispatch, useSelector } from 'react-redux'; // Importing Redux hooks for dispatching actions and selecting state
import { FaInfoCircle } from 'react-icons/fa'; // Importing InfoCircle icon from react-icons
import { SyncLoader } from 'react-spinners'; // Importing SyncLoader spinner for loading state
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'; // Importing actions for user updates from Redux slice

const AirportSecurity = () => {
    // Destructuring currentUser from Redux state
    const { currentUser } = useSelector((state) => state.user);
    
    // State variables for managing form data, validation, loading, errors, etc.
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({
        knownTravelarNumber: null,
        redressNumber: null,
    });
    
    // Modal reference for closing modal when clicking outside
    const modalRef = useRef(null);
    
    // Dispatch function for dispatching Redux actions
    const dispatch = useDispatch();
    
    // useNavigate hook to navigate after the form is submitted
    const navigate = useNavigate();

    // useEffect hook to set initial form data when the currentUser state changes
    useEffect(() => {
        if (currentUser) {
            const userData = {
                airportSecurity: {
                    knownTravelarNumber: currentUser.airportSecurity?.knownTravelarNumber || '',
                    redressNumber: currentUser.airportSecurity?.redressNumber || '',
                },
            };
            setFormData(userData); // Set the form data
            setInitialData(userData); // Keep a copy of the original data to compare for changes
        }
    }, [currentUser]); // Trigger this effect when currentUser is updated

    // Function to handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => {
            const keys = id.split('.'); // Split nested keys like "location.city"
            let updatedData = { ...prev };
    
            // Traverse and update nested keys in the form data
            let currentLevel = updatedData;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    currentLevel[key] = value;
                } else {
                    currentLevel[key] = { ...currentLevel[key] };
                    currentLevel = currentLevel[key];
                }
            });
    
            return updatedData;
        });

        // Clear errors on input change
        setFieldErrors((prev) => ({ ...prev, [id.split('.').pop()]: null }));
    };

    // Function to validate form fields
    const validateFields = () => {
        const errors = {};
        const { knownTravelarNumber, redressNumber } = formData.airportSecurity;

        // Validate Known Traveler Number field
        if (!knownTravelarNumber || knownTravelarNumber.trim() === '') {
            errors.knownTravelarNumber = 'Known Traveler Number is required.';
        } else if (!/^\d+$/.test(knownTravelarNumber)) {
            errors.knownTravelarNumber = 'Known Traveler Number must be numeric.';
        } else if (knownTravelarNumber.length > 0 && (knownTravelarNumber.length < 5 || knownTravelarNumber.length > 10)) {
            errors.knownTravelarNumber = 'Known traveler number must be between 5 and 10 characters.'
        }

        // Validate Redress Number field
        if (!redressNumber || redressNumber.trim() === '') {
            errors.redressNumber = 'Redress Number is required.';
        } else if (!/^\d+$/.test(redressNumber)) {
            errors.redressNumber = 'Redress Number must be numeric.';
        } else if (redressNumber.length > 0 && (redressNumber.length < 7 || redressNumber.length > 15)) {
            errors.redressNumber = 'Redress number must be between 7 and 15 characters.'
        }

        setFieldErrors(errors); // Set field validation errors
        return Object.keys(errors).length === 0; // Returns true if there are no errors
    };

    // Function to handle form submission
    const handleSubmit = async (e) =>{
        e.preventDefault(); // Prevent default form submission behavior
        setUpdateUserError(null); // Reset any previous errors
        setUpdateUserSuccess(null); // Reset any previous success messages

        // Validate the form fields
        if (!validateFields()) {
            return; // If validation fails, exit the function
        }
    
        // Check if form data is unchanged
        const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
        if (isUnchanged) {
            setUpdateUserError('No changes made'); // If no changes were made, show error
            return;
        }
    
        try {
            // Dispatch Redux action to start updating user
            dispatch(updateStart());
            setLoading(true); // Set loading state to true while waiting for the request
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send the updated form data as the request body
            });
        
            const data = await res.json();
        
            if (!res.ok) {
                // If the response is not successful, handle failure
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message); // Set error message
                setLoading(false);
        
            } else {
                // If the response is successful, update state and redirect
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Update successful"); // Set success message
                setLoading(false);
                
                // Navigate to profile details tab after a short delay
                setTimeout(() => {
                    navigate('/profile?tab=details');
                }, 3000);
            }
        } catch (error) {
            // Handle any errors during the fetch request
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message); // Set error message
        }
    };

    // useEffect hook for clearing success/error messages after 3 seconds
    useEffect(() => {
        if (updateUserSuccess || updateUserError || fieldErrors) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null);
                setUpdateUserError(null);
                setFieldErrors(null);
            }, 3000); // Reset messages after 3 seconds
      
            // Cleanup the timer when the component unmounts or state changes
            return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError, fieldErrors]); // Trigger the effect when any of these states change

    // useEffect hook to close modal when clicking outside of it
    useEffect(() => {
        const closeModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false); // Close the modal if clicked outside
            }
        };

        // Add event listener to detect mouse clicks outside the modal
        document.addEventListener('mousedown', closeModal);
  
        // Cleanup the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', closeModal);
        };
    }, []); // Only run this effect once, when the component mounts

    return (
        <div>
            {/* Modal Background */}
            <div className='fixed inset-0 bg-white z-[10000] flex justify-center items-center'>
                {/* Modal Content Box */}
                <div className='h-full w-96 max-w-full bg-white flex pt-20 px-5'>
                    
                    {/* Close Button */}
                    <div className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                        onClick={() => {
                            navigate('/profile?tab=details'); // Navigates to profile tab
                        }}
                    >
                        <X /> {/* Close Icon */}
                    </div>
    
                    {/* Form */}
                    <form 
                        className='flex flex-col gap-10 w-full'
                        onSubmit={handleSubmit} // Trigger handleSubmit function on form submit
                    >
                        {/* Form Header */}
                        <h1 className='text-3xl font-semibold'>Airport Security</h1>
    
                        <div className='flex flex-col gap-5 w-full'>
                            {/* Known Traveler Number Input */}
                            <div className='flex flex-col gap-3 w-full'>
                                <h3 className='font-medium text-sm'>TSA PreCheck</h3>
                                <div className='rounded-xl w-full h-16 relative'>
                                    
                                    {/* Label for Known Traveler Number */}
                                    <label
                                        htmlFor="airportSecurity.knownTravelarNumber"
                                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
                                            ${isFocused || (formData.airportSecurity?.knownTravelarNumber && formData.airportSecurity?.knownTravelarNumber !== "Not provided")
                                                ? 'top-1 transform -translate-x-6 scale-75 text-blue-500' // Label moves up when focused
                                                : 'top-1/2 transform -translate-y-1/2 text-black'
                                            }`
                                        }
                                        
                                    >
                                        Known Traveler Number (KTN)
                                    </label>
    
                                    {/* Input Field for Known Traveler Number */}
                                    <input
                                        type="text"
                                        id="airportSecurity.knownTravelarNumber"
                                        value={formData.airportSecurity?.knownTravelarNumber || ''}
                                        onChange={handleChange} // Trigger handleChange on value change
                                        className="w-full shadow shadow-gray-400 rounded-xl h-16 pl-5 pt-3 pb-1 text-base"
                                        onFocus={() => setIsFocused(true)} // Set focus state to true on focus
                                        autoComplete='off'
                                        onBlur={(e) => !e.target.value && setIsFocused(false)} // Reset focus state if the input is empty
                                    />
                                    
                                    {/* Info Icon for Known Traveler Number */}
                                    <FaInfoCircle 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black cursor-pointer"
                                        onClick={() => {
                                            setModalTitle('Known Traveler Number');
                                            setModalMessage('This is a unique number issued by the U.S. Government to identify those in a known traveler program (i.e. TSA PreCheck, Global Entry, SENTRI, NEXUS).');
                                            setShowModal(true); // Display modal with information on click
                                        }}
                                    />
                                </div>
    
                                {/* Error Message for Known Traveler Number */}
                                {fieldErrors?.knownTravelarNumber && 
                                    <p className="text-red-500 text-[0.7rem] font-serif">
                                        {fieldErrors.knownTravelarNumber}
                                    </p>
                                }
                            </div>
    
                            {/* Redress Number Input */}
                            <div className='flex flex-col gap-3 w-full'>
                                <h3 className='font-medium text-sm'>Redress Number</h3>
                                <div className='rounded-xl w-full h-16 relative'>
                                    
                                    {/* Label for Redress Number */}
                                    <label
                                        htmlFor="airportSecurity.redressNumber"
                                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text 
                                            ${isFocused2 || (formData.airportSecurity?.redressNumber && formData.airportSecurity?.redressNumber !== "Not provided")
                                                ? 'top-1 transform -translate-x-3 scale-75 text-blue-500' // Label moves up when focused
                                                : 'top-1/2 transform -translate-y-1/2 text-black'
                                            }`
                                        }
                                    >
                                        Redress Number
                                    </label>
    
                                    {/* Input Field for Redress Number */}
                                    <input
                                        type="text"
                                        id="airportSecurity.redressNumber"
                                        value={formData.airportSecurity?.redressNumber || ''}
                                        onChange={handleChange} // Trigger handleChange on value change
                                        className="w-full shadow shadow-gray-400 rounded-xl h-16 pl-5 pt-3 pb-1 text-base"
                                        onFocus={() => setIsFocused2(true)} // Set focus state to true on focus
                                        autoComplete='off'
                                        onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset focus state if input is empty
                                    />
                                    
                                    {/* Info Icon for Redress Number */}
                                    <FaInfoCircle 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black cursor-pointer"
                                        onClick={() => {
                                            setModalTitle('Redress Number');
                                            setModalMessage('This is a unique number the Department of Homeland Security (DHS) assigns to a passenger to promote resolution with previous watch list alerts.');
                                            setShowModal(true); // Display modal with information on click
                                        }}
                                    />
                                </div>
    
                                {/* Error Message for Redress Number */}
                                {fieldErrors?.redressNumber && 
                                    <p className="text-red-500 text-[0.7rem] font-serif">
                                        {fieldErrors.redressNumber}
                                    </p>
                                }
                            </div>
    
                            {/* Submit Button */}
                            <button 
                                type='submit'
                                className={`py-3 text-white font-semibold w-32 rounded-full outline-none mt-5 self-center shrink-button 
                                    transition-all duration-300 ease-in-out
                                    ${loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`
                                }
                            >
                                <p>
                                    {loading 
                                        ? <SyncLoader 
                                            color="#fff" // Show loader with white color
                                            loading={loading} 
                                            size={7} // Loader size
                                            margin={2} // Margin between loader circles
                                        />
                                        : 'Save' // Display 'Save' when not loading
                                    }
                                </p>
                            </button>
    
                            {/* Success Message */}
                            <p 
                                className={`text-[0.7rem] text-center font-serif -mt-4 text-green-500 transform transition-all duration-700 ease-in-out ${
                                    updateUserSuccess 
                                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-5 pointer-events-none'
                                    }`
                                }
                            >
                                {updateUserSuccess}
                            </p>
    
                            {/* Error Message */}
                            <p 
                                className={`text-[0.7rem] text-center font-serif -mt-4 text-red-500 transform transition-all duration-700 ease-in-out ${
                                    updateUserError 
                                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-5 pointer-events-none'
                                    }`
                                }
                            >
                                {updateUserError}
                            </p>
                        </div>
                    </form>
    
                    {/* Modal for Additional Information */}
                    <AnimatePresence>
                        {showModal && // Display modal if showModal is true
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: .5,
                                    ease: "easeInOut"
                                }}
                                className='fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center'
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: .5,
                                        ease: "easeInOut"
                                    }}
                                    ref={modalRef} // Ref for modal reference
                                    className='rounded-xl px-4 pb-4 pt-10 flex flex-col gap-3 bg-white w-96 max-w-[90%] relative'
                                >
                                    {/* Close Button in Modal */}
                                    <X
                                        className="cursor-pointer text-[#48aadf] absolute left-2 top-2 p-2 rounded-full text-[20rem] bg-[#48aadf13] 
                                        w-8 h-8"
                                        onClick={() => setShowModal(false)} // Close the modal on click
                                    />
                                    {/* Modal Title and Message */}
                                    <h1 className='font-medium text-lg'>{modalTitle}</h1>
                                    <p className='text-sm'>{modalMessage}</p>
                                    
                                    {/* OK Button to Close Modal */}
                                    <button
                                        type='button'
                                        className='bg-[#48aadf] py-2 px-5 mt-4 text-white cursor-pointer rounded-full font-semibold'
                                        onClick={() => setShowModal(false)} // Close the modal on click
                                    >
                                        OK
                                    </button>
                                </motion.div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default AirportSecurity
