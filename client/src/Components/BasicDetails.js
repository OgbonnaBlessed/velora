import { ArrowLeft, ChevronDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';

const BasicDetails = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGenderChange = (gender) => {
        setFormData((prev) => ({ ...prev, gender }));
    };

    useEffect(() => {
        if (currentUser) {
            const userData = {
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                bio: currentUser.bio || '',
                DOB: currentUser.DOB || '',
                gender: currentUser.gender || '',
                needs: currentUser.needs || '',
            };
            setFormData(userData);
            setInitialData(userData); // Keep a copy of the original data to compare changes.
        }

        setIsFocused1(!!currentUser.firstName);
        setIsFocused2(!!currentUser.lastName);
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const isValidDOB = (month, day, year) => {
        if (!month || !day || !year) return false;
    
        // Convert to numbers
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        const y = parseInt(year, 10);
    
        // Check for valid ranges
        if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear() - 16) {
            return false;
        }
    
        // Check for valid dates
        const date = new Date(y, m - 1, d); // JS months are 0-indexed
        return date.getMonth() + 1 === m && date.getDate() === d && date.getFullYear() === y;
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

        if (!formData.firstName) {
            setUpdateUserError('Kindly enter your first name');
            return;
        }

        if (!formData.lastName) {
            setUpdateUserError('Kindly enter your last name');
            return;
        }

        // Validate DOB
        const [month, day, year] = formData.DOB?.split('/') || [];
        if (!isValidDOB(month, day, year)) {
            setUpdateUserError('Please provide a valid Date of Birth (MM/DD/YYYY)');
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
    <div className='bg-gray-100 flex-1 rounded-3xl relative p-14 flex flex-col w-full items-center gap-5'>
        <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => navigate(-1)}
        >
            <ArrowLeft/>
        </div>

        <div className='flex flex-col gap-1'>
            <h1 className='font-medium sm:text-3xl text-2xl self-center'>Basic information</h1>
            <p className='text-sm'>Make sure this information matches your travel ID, like your passport or license.</p>
        </div>
        <form 
            className='flex flex-col gap-5'
            onSubmit={handleSubmit}
        >
            <div className='flex flex-col gap-1'>
                <h3 className='font-medium'>Full name</h3>
                <div className='flex flex-col gap-3'>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="firstName"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused1
                                ? 'top-1 transform -translate-x-2 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            First name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName ?? currentUser.firstName}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused1(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused1(false)} // Reset if input is empty
                        />
                    </div>
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="lastName"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused2
                                ? 'top-1 transform -translate-x-2 scale-75' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            Last name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName ?? currentUser.lastName}
                            onChange={handleChange}
                            className="w-full border border-black bg-transparent rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused2(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset if input is empty
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>About you</h3>
                <div className='flex flex-col border border-black rounded-xl p-3 w-72'>
                    <p className='text-sm'>Bio</p>
                    <textarea 
                        id="bio" 
                        onChange={handleChange}
                        value={formData.bio === 'Not provided' ? '' : formData.bio}
                        className='bg-transparent w-full resize-none min-h-32'
                        placeholder='Help future hosts get to know you better'
                    ></textarea>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>Date of Birth</h3>
                <div className='flex items-center w-72 justify-between'>
                    <div className='border border-black py-2 px-3 rounded-xl flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Month</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='MM'
                            value={formData.DOB === 'Not provided' ? '' : formData.DOB?.split('/')[0]}
                            maxLength={2} // Limit to 2 digits
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                  ...prev,
                                  DOB: `${value}/${prev.DOB?.split('/')[1] || ''}/${prev.DOB?.split('/')[2] || ''}`,
                                }));
                              }}
                            className='bg-transparent w-16'
                        />
                    </div>
                    <div className='border border-black py-2 px-3 rounded-xl flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Day</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='DD'
                            value={formData.DOB?.split('/')[1] || ''}
                            maxLength={2} // Limit to 2 digits
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                  ...prev,
                                  DOB: `${prev.DOB?.split('/')[0] || ''}/${value}/${prev.DOB?.split('/')[2] || ''}`,
                                }));
                            }}
                            className='bg-transparent w-16'
                        />
                    </div>
                    <div className='border border-black py-2 px-3 rounded-xl flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Year</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='YYYY'
                            value={formData.DOB?.split('/')[2] || ''}
                            maxLength={4} // Limit to 4 digits
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                    ...prev,
                                    DOB: `${prev.DOB?.split('/')[0] || ''}/${prev.DOB?.split('/')[1] || ''}/${value}`,
                                }));
                            }}
                            className='bg-transparent w-16'
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>Gender</h3>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="male" 
                            checked={formData.gender === 'male'}
                            onChange={() => handleGenderChange('male')}
                        />
                        <label 
                            htmlFor="male"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Male
                        </label>
                    </div>
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="female" 
                            checked={formData.gender === 'female'}
                            onChange={() => handleGenderChange('female')}
                        />
                        <label 
                            htmlFor="female"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Female
                        </label>
                    </div>
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="unspecified" 
                            checked={formData.gender === 'unspecified'}
                            onChange={() => handleGenderChange('unspecified')}
                        />
                        <label 
                            htmlFor="unspecified"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Unspecified (X)
                        </label>
                    </div>
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="undisclose" 
                            checked={formData.gender === 'undisclose'}
                            onChange={() => handleGenderChange('undisclose')}
                        />
                        <label 
                            htmlFor="undisclose"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Undisclose (U)
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>Accessibility needs</h3>
                <div className='relative w-fit'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <label 
                        htmlFor="needs"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Choose an option
                    </label>
                    <select 
                        id="needs"
                        value={formData.needs ?? "Not provided"} // Set the value to reflect the current state
                        onChange={(e) => handleChange(e)} // Handle state updates
                        className='border border-black pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md w-72 text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="Not provided">Not provided</option>
                        <option value="No, I don't have accessibility needs">No, I don't have accessibility needs</option>
                        <option value="Yes, I have accessibility needs">Yes, I have accessibility needs</option>
                        <option value="Rather not say">Rather not say</option>
                    </select>
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

export default BasicDetails