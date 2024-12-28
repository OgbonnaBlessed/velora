import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FaInfoCircle } from 'react-icons/fa';
import { SyncLoader } from 'react-spinners';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const AirportSecurity = () => {
    const { currentUser } = useSelector((state) => state.user);
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
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const userData = {
                airportSecurity: {
                    knownTravelarNumber: currentUser.airportSecurity?.knownTravelarNumber || '',
                    redressNumber: currentUser.airportSecurity?.redressNumber || '',
                },
            };
            setFormData(userData);
            setInitialData(userData); // Keep a copy of the original data to compare changes.
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => {
            const keys = id.split('.'); // Split nested keys like "location.city"
            let updatedData = { ...prev };
    
            // Traverse and update nested keys
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

    const validateFields = () => {
        const errors = {};
        const { knownTravelarNumber, redressNumber } = formData.airportSecurity;

        if (!knownTravelarNumber || knownTravelarNumber.trim() === '') {
            errors.knownTravelarNumber = 'Known Traveler Number is required.';
        } else if (!/^\d+$/.test(knownTravelarNumber)) {
            errors.knownTravelarNumber = 'Known Traveler Number must be numeric.';
        } else if (knownTravelarNumber.length > 0 && (knownTravelarNumber.length < 5 || knownTravelarNumber.length > 10)) {
            errors.knownTravelarNumber = 'Known traveler number must be between 5 and 10 characters.'
        }

        if (!redressNumber || redressNumber.trim() === '') {
            errors.redressNumber = 'Redress Number is required.';
        } else if (!/^\d+$/.test(redressNumber)) {
            errors.redressNumber = 'Redress Number must be numeric.';
        } else if (redressNumber.length > 0 && (redressNumber.length < 7 || redressNumber.length > 15)) {
            errors.redressNumber = 'Redress number must be between 7 and 15 charaters.'
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        // Validate fields
        if (!validateFields()) {
            return;
        }
    
        // Check if changes were made
        const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
        if (isUnchanged) {
            setUpdateUserError('No changes made');
            return;
        }
    
        try {
          dispatch(updateStart());
          setLoading(true);
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            const data = await res.json();
        
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
                console.log(data);
                setLoading(false);
        
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Update successful");
                setLoading(false);
                
                setTimeout(() => {
                    navigate('/profile?tab=details');
                }, 3000);
            }
        } catch (error) {
          dispatch(updateFailure(error.message));
          setUpdateUserError(error.message);
        }
    };

    useEffect(() => {
        if (updateUserSuccess || updateUserError || fieldErrors) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null);
                setUpdateUserError(null);
                setFieldErrors(null);
            }, 3000); // 3 seconds
      
          // Cleanup the timer if the component unmounts or the state changes before 5 seconds
          return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError, fieldErrors]);

    useEffect(() => {
        const closeModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }

        document.addEventListener('mousedown', closeModal);
  
        return () => {
          document.removeEventListener('mousedown', closeModal);
        }
    }, []);

  return (
    <div>
        <div className='fixed inset-0 bg-white z-[10000] flex justify-center items-center'>
            <div
                className='h-full w-96 max-w-full bg-white flex pt-20 px-5'>
                <div className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate('/profile?tab=details')
                    }}
                >
                    <X />
                </div>

                <form 
                    className='flex flex-col gap-10 w-full'
                    onSubmit={handleSubmit}
                >
                    <h1 className='text-3xl font-semibold'>Airport Security</h1>
                    <div className='flex flex-col gap-5 w-full'>
                        <div className='flex flex-col gap-3 w-full'>
                            <h3 className='font-medium text-sm'>TSA PreCheck</h3>
                            <div className='rounded-xl w-full h-16 relative'>
                                <label
                                    htmlFor="airportSecurity.knownTravelarNumber"
                                    className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                                    isFocused || (formData.airportSecurity?.knownTravelarNumber && formData.airportSecurity?.knownTravelarNumber !== "Not provided")
                                        ? 'top-1 transform -translate-x-6 scale-75 text-blue-500' // Label moves up and scales down when focused
                                        : 'top-1/2 transform -translate-y-1/2 text-black'
                                    }`}
                                >
                                    Known Traveler Number (KTN)
                                </label>
                                <input
                                    type="text"
                                    id="airportSecurity.knownTravelarNumber"
                                    value={formData.airportSecurity?.knownTravelarNumber || ''}
                                    onChange={handleChange}
                                    className="w-full shadow shadow-gray-400 rounded-xl h-16 pl-5 pt-3 pb-1 text-base"
                                    onFocus={() => setIsFocused(true)}
                                    autoComplete='off'
                                    onBlur={(e) => !e.target.value && setIsFocused(false)} // Reset if input is empty
                                />
                                <FaInfoCircle 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black cursor-pointer"
                                    onClick={() => {
                                        setModalTitle('Known Traveler Number');
                                        setModalMessage('This is a unique number issued by the U.S. Government to identify those in a known traveler program (i.e. TSA PreCheck, Global Entry, SENTRI, NEXUS).');
                                        setShowModal(true);
                                    }}
                                />
                            </div>
                            {fieldErrors?.knownTravelarNumber && 
                                <p className="text-red-500 text-[0.7rem] font-serif">
                                    {fieldErrors.knownTravelarNumber}
                                </p>
                            }
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                            <h3 className='font-medium text-sm'>Redress Number</h3>
                            <div className='rounded-xl w-full h-16 relative'>
                                <label
                                    htmlFor="airportSecurity.redressNumber"
                                    className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                                    isFocused2 || (formData.airportSecurity?.redressNumber && formData.airportSecurity?.redressNumber !== "Not provided")
                                        ? 'top-1 transform -translate-x-3 scale-75 text-blue-500' // Label moves up and scales down when focused
                                        : 'top-1/2 transform -translate-y-1/2 text-black'
                                    }`}
                                >
                                    Redress Number
                                </label>
                                <input
                                    type="text"
                                    id="airportSecurity.redressNumber"
                                    value={formData.airportSecurity?.redressNumber || ''}
                                    onChange={handleChange}
                                    className="w-full shadow shadow-gray-400 rounded-xl h-16 pl-5 pt-3 pb-1 text-base"
                                    onFocus={() => setIsFocused2(true)}
                                    autoComplete='off'
                                    onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset if input is empty
                                />
                                <FaInfoCircle 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black cursor-pointer"
                                    onClick={() => {
                                        setModalTitle('Redress Number');
                                        setModalMessage('This is a unique number the Department of Homeland Security (DHS) assigns to a passenger to promote resolution with previous watch list alerts.');
                                        setShowModal(true);
                                    }}
                                />
                            </div>
                            {fieldErrors?.redressNumber && 
                                <p className="text-red-500 text-[0.7rem] font-serif">
                                    {fieldErrors.redressNumber}
                                </p>
                            }
                        </div>
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
                                        color="#fff" // Customize the color
                                        loading={loading} 
                                        size={7} // Customize the size
                                        margin={2} // Customize the margin between circles
                                    />
                                    : 'Save'
                                }
                            </p>
                        </button>
                        <p className={`text-[0.7rem] text-center font-serif -mt-4 text-green-500 transform transition-all duration-700 ease-in-out ${
                                updateUserSuccess 
                                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 -translate-y-5 pointer-events-none'
                                }`
                            }
                        >
                            {updateUserSuccess}
                        </p>

                        <p className={`text-[0.7rem] text-center font-serif -mt-4 text-red-500 transform transition-all duration-700 ease-in-out ${
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

                <AnimatePresence>
                    {showModal &&
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
                                ref={modalRef}
                                className='rounded-xl px-4 pb-4 pt-10 flex flex-col gap-3 bg-white w-96 max-w-[90%] relative'
                            >
                                <X
                                    className="cursor-pointer text-[#48aadf] absolute left-2 top-2 p-2 rounded-full text-[20rem] bg-[#48aadf13] 
                                    w-8 h-8"
                                    onClick={() => setShowModal(false)}
                                />
                                <h1 className='font-medium text-lg'>{modalTitle}</h1>
                                <p className='text-sm'>{modalMessage}</p>
                                <button
                                    type='button'
                                    className='bg-[#48aadf] py-2 px-5 mt-4 text-white cursor-pointer rounded-full font-semibold'
                                    onClick={() => setShowModal(false)}
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
