import { ArrowLeft, ChevronDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';

const ContactDetails = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [isFocused7, setIsFocused7] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    }

    useEffect(() => {
        if (currentUser) {
            const userData = {
                number: currentUser.number || '',
                countryCode: currentUser.countryCode || '',
                emergency: {
                    name: currentUser.emergency?.name || '',
                    countryCode: currentUser.emergency?.countryCode || '',
                    phoneNumber: currentUser.emergency?.phoneNumber || '',
                },
                location: {
                    address: currentUser.location?.address || '',
                    city: currentUser.location?.city || '',
                    zip: currentUser.location?.zip || '',
                    state: currentUser.location?.state || '',
                    region: currentUser.location?.region || '',
                }
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
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
    
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
        if (updateUserSuccess || updateUserError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null);
                setUpdateUserError(null);
            }, 3000); // 3 seconds
      
          // Cleanup the timer if the component unmounts or the state changes before 5 seconds
          return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError]);

  return (
    <div className='bg-blue-50 bg-opacity-50 flex-1 rounded-3xl relative p-14 flex flex-col w-full items-center gap-5'>
        <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => navigate(-1)}
        >
            <ArrowLeft/>
        </div>

        <div className='flex flex-col gap-1'>
            <h1 className='font-medium sm:text-3xl text-2xl self-center'>Contact</h1>
            <p className='text-sm'>Receive account activity alerts and trip updates by sharing this information.</p>
        </div>
        <form 
            className='flex flex-col gap-10'
            onSubmit={handleSubmit}
        >
            <div className='flex flex-col gap-1'>
                <h3 className='font-medium'>Mobile number</h3>
                <div className='flex flex-col gap-4'>
                    <div className='flex max-sm:flex-col gap-3'>
                        <div className='relative w-fit'>
                            <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                            <label 
                                htmlFor="countryCode"
                                className='text-[0.7rem] absolute top-2 left-3'
                            >
                                Country code
                            </label>
                            <select 
                                id="countryCode"
                                value={formData.countryCode ?? currentUser.countryCode}
                                onChange={(e) => handleChange(e)} // Handle state updates
                                className='border border-black pt-5 pb-2 px-3 pr-5 bg-transparent rounded-xl w-72 text-black appearance-none text-base cursor-pointer'
                            >
                                <option value="+1">United states +1</option>
                                <option value="+44">United kingdom +44</option>
                                <option value="+234">Nigeria +234</option>
                                <option value="+380">Ukraine +380</option>
                                <option value="+256">Uganda +256</option>
                            </select>
                        </div>
                        <div className='rounded-xl w-72 h-14 relative'>
                            <label
                                htmlFor="number"
                                className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                                isFocused1 || (formData.number && formData.number !== "Not provided")
                                    ? 'top-1 transform -translate-x-3 scale-75' // Label moves up and scales down when focused
                                    : 'top-1/2 transform -translate-y-1/2'
                                }`}
                            >
                                Phone number
                            </label>
                            <input
                                type="text"
                                id="number"
                                value={formData.number === 'Not provided' ? '' : formData.number}
                                onChange={handleChange}
                                className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                                onFocus={() => setIsFocused1(true)}
                                autoComplete='off'
                                onBlur={(e) => !e.target.value && setIsFocused1(false)} // Reset if input is empty
                            />
                        </div>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            id="SMS" 
                            checked={isChecked}
                            onClick={handleCheckboxChange}
                            className='hidden'
                        />
                        <label htmlFor="SMS" className="flex items-start cursor-pointer">
                            <div className={`relative w-5 h-5 flex items-center justify-center rounded border-2 
                                    transition-all duration-300 
                                    ${isChecked ? 'border-[#4078bc] bg-[#4078bc]' : 'border-black'} `
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`absolute w-4.5 h-4 text-white transition-opacity duration-300 
                                        ${isChecked ? 'opacity-100' : 'opacity-0'}`
                                    }
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-2 text-black text-sm -mt-0.5">
                                <p className='font-semibold text-sm'>Send me SMS updates</p>
                                <p className='text-[0.7rem] -mt-1'>Messaging and data rates may apply.</p>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1'>
                    <h3 className='font-semibold'>Emergency contact</h3>
                    <p className='text-sm -mt-1'>Trusted person in case of emergency</p>
                </div>
                <div className='rounded-xl w-72 h-14 relative'>
                    <label
                        htmlFor="emergency.name"
                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                        isFocused2 || (formData.emergency?.name && formData.emergency?.name !== "Not provided")
                            ? 'top-1 transform -translate-x-3 scale-75' // Label moves up and scales down when focused
                            : 'top-1/2 transform -translate-y-1/2'
                        }`}
                    >
                        Contact name
                    </label>
                    <input
                        type="text"
                        id="emergency.name"
                        value={formData.emergency?.name || ''}
                        onChange={handleChange}
                        className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                        onFocus={() => setIsFocused2(true)}
                        autoComplete='off'
                        onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset if input is empty
                    />
                </div>
                <div className='flex max-sm:flex-col items-center gap-3'>
                    <div className='relative w-fit'>
                        <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                        <label 
                            htmlFor="emergency.countryCode"
                            className='text-[0.7rem] absolute top-2 left-3'
                        >
                            Country code
                        </label>
                        <select 
                            id="emergency.countryCode"
                            value={formData.emergency?.countryCode || ''}
                            onChange={handleChange}
                            className='border border-black pt-5 pb-2 px-3 pr-5 bg-transparent rounded-xl w-72 text-black appearance-none text-base cursor-pointer'
                        >
                            <option value="+1">United states +1</option>
                            <option value="+44">United kingdom +44</option>
                            <option value="+234">Nigeria +234</option>
                            <option value="+380">Ukraine +380</option>
                            <option value="+256">Uganda +256</option>
                        </select>
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="emergency.phoneNumber"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused3 || (formData.emergency?.phoneNumber && formData.emergency?.phoneNumber !== "Not provided")
                                ? 'top-1 transform -translate-x-3 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="emergency.phoneNumber"
                            value={formData.emergency?.phoneNumber || ''}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused3(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused3(false)} // Reset if input is empty
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>Email</h3>
                <p className='text-sm'>{currentUser.email}</p>
                <p className='text-sm'>You can change your email in {" "} 
                    <span 
                        className='text-[#48aadf] cursor-pointer'
                        onClick={() => navigate('/profile?tab=settings')}
                    >
                        settings
                    </span>
                </p>
            </div>
            <div className='flex flex-col gap-3'>
                <h3 className='font-semibold'>Address</h3>
                <div className='flex flex-col gap-3'>
                    <div className='relative w-fit'>
                        <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                        <label 
                            htmlFor="location.region"
                            className='text-[0.7rem] absolute top-2 left-3'
                        >
                            Country/Region
                        </label>
                        <select 
                            id="location.region"
                            value={formData.location?.region || ''}
                            onChange={handleChange} // Handle state updates
                            className='border border-black pt-5 pb-2 px-3 pr-5 bg-transparent rounded-xl w-72 text-black appearance-none text-base cursor-pointer'
                        >
                            <option value="United state">United state</option>
                            <option value="United kingdom">United kingdom</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="Uganda">Uganda</option>
                        </select>
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.address"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused4 || (formData.location?.address && formData.location?.address !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            Address
                        </label>
                        <input
                            type="text"
                            id="location.address"
                            value={formData.location?.address || ''}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused4(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused4(false)} // Reset if input is empty
                        />
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.city"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused5 || (formData.location?.city && formData.location?.city !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            City
                        </label>
                        <input
                            type="text"
                            id="location.city"
                            value={formData.location?.city || ''}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused5(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused5(false)} // Reset if input is empty
                        />
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.state"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused6 || (formData.location?.state && formData.location?.state !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            State
                        </label>
                        <input
                            type="text"
                            id="location.state"
                            value={formData.location?.state || ''}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused6(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused6(false)} // Reset if input is empty
                        />
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.zip"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused7 || (formData.location?.zip && formData.location?.zip !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            ZIP code
                        </label>
                        <input
                            type="text"
                            id="location.zip"
                            value={formData.location?.zip || ''}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused7(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused7(false)} // Reset if input is empty
                        />
                    </div>
                </div>
            </div>
            <button 
                type="submit"
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
        </form>
        <p className={`text-[0.7rem] -mt-4 text-green-500 transform transition-all duration-700 ease-in-out ${
                updateUserSuccess 
                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`
            }
        >
            {updateUserSuccess}
        </p>

        <p className={`text-[0.7rem] -mt-4 text-red-500 transform transition-all duration-700 ease-in-out ${
                updateUserError 
                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`
            }
        >
            {updateUserError}
        </p>
    </div>
  )
}

export default ContactDetails