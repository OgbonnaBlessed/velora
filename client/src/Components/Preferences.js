import { ChevronDown, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { SyncLoader } from 'react-spinners';

const Preferences = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            const userData = {
                preference: {
                country: currentUser.preference?.country || '',
                seatPreference: currentUser.preference?.seatPreference || '',
                specialAssisstance: currentUser.preference?.specialAssisstance || '',
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
    <div>
        <div className='fixed inset-0 bg-white z-20 flex justify-center items-center'>
            <form 
                className='flex flex-col gap-3 w-[28rem] max-w-[90%]'
                onSubmit={handleSubmit}
            >
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate('/profile?tab=details')
                    }}
                >
                    <X />
                </div>
                
                <h1 className='font-medium text-xl'>Preferences</h1>
                <p className='text-sm'>
                    Kindly set your preferences, to allow us get the best flights or hotels for you.
                </p>
                <div className='relative w-full'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <label 
                        htmlFor="preference.country"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Country
                    </label>
                    <select 
                        id="preference.country"
                        value={formData.preference?.country || ''} // Set the value to reflect the current state
                        onChange={handleChange} // Handle state updates
                        className='w-full border border-black pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="United state">United state</option>
                        <option value="Canada">Canada</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="United kingdom">United kingdom</option>
                    </select>
                </div>
                <div className='relative w-full'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <label 
                        htmlFor="preference.seatPreference"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Seat preference
                    </label>
                    <select 
                        id="preference.seatPreference"
                        value={formData.preference?.seatPreference || ''} // Set the value to reflect the current state
                        onChange={handleChange} // Handle state updates
                        className='w-full border border-black pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="No preference">No preference</option>
                        <option value="Window">Window</option>
                        <option value="Aisle">Aisle</option>
                    </select>
                </div>
                <div className='relative w-full'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <label 
                        htmlFor="preference.specialAssisstance"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Special assisstance
                    </label>
                    <select 
                        id="preference.specialAssisstance"
                        value={formData.preference?.specialAssisstance || ''} // Set the value to reflect the current state
                        onChange={handleChange} // Handle state updates
                        className='w-full border border-black pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="None">None</option>
                        <option value="Blind">Blind</option>
                        <option value="Blind With Dog">None</option>
                        <option value="Deaf">Deaf</option>
                        <option value="Deaf">Deaf With Dog</option>
                        <option value="Meet and Assist">Meet and Assist</option>
                        <option value="Wheelchair - Can Walk and Ascend / Descend Stairs">
                            Wheelchair - Can Walk and Ascend / Descend Stairs
                        </option>
                        <option value="Wheelchair - Cannot Ascend / Descend Stairs">
                            Wheelchair - Cannot Ascend / Descend Stairs
                        </option>
                        <option value="Wheelchair - Immobile">Wheelchair - Immobile</option>
                        <option value="Wheelchair - On-Board-wheelchair">Wheelchair - On-Board-wheelchair</option>
                        <option value="With Infant">With Infant</option>
                        <option value="Help Language">Help Language</option>
                        <option value="Baggage Bulky">Baggage Bulky</option>
                    </select>
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
                <div>
                    <p className={`text-[0.7rem] text-center font-serif text-green-500 transform transition-all duration-700 ease-in-out ${
                            updateUserSuccess 
                                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                : 'opacity-0 -translate-y-5 pointer-events-none'
                            }`
                        }
                    >
                        {updateUserSuccess}
                    </p>

                    <p className={`text-[0.7rem] text-center font-serif text-red-500 transform 
                    transition-all duration-700 ease-in-out ${
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
        </div>
    </div>
  )
}

export default Preferences