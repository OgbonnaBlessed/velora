import { ChevronDown, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { SyncLoader } from 'react-spinners';

const TravelDocument = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isFocused3, setIsFocused3] = useState(false);
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const userData = {
        travelDocument: {
          country: currentUser.travelDocument?.country || '',
          passportNumber: currentUser.travelDocument?.passportNumber || '',
          expirationDate: currentUser.travelDocument?.expirationDate || '',
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

  const handleDateChange = (value, index) => {
    setFormData((prev) => {
      const parts = prev.travelDocument?.expirationDate?.split('/') || ['', '', ''];
      parts[index] = value.replace(/\D/g, ''); // Allow only numeric input
      return {
        ...prev,
        travelDocument: {
          ...prev.travelDocument,
          expirationDate: parts.join('/'),
        },
      };
    });
  };

  const isValidExpirationDate = (month, day, year) => {
    if (!month || !day || !year) return false;
  
    // Parse integers
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);
  
    // Validate month, day, year ranges
    if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < new Date().getFullYear()) {
      return false;
    }
  
    // Validate actual date
    const date = new Date(y, m - 1, d); // JS months are 0-indexed
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
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

    const expirationDate = formData.travelDocument.expirationDate || '';
    const [month, day, year] = expirationDate.split('/');

    if (!isValidExpirationDate(month, day, year)) {
      setUpdateUserError('Please provide a valid Expiration Date (MM/DD/YYYY)');
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
          className='flex flex-col gap-5 w-[28rem] max-w-[90%]'
          onSubmit={handleSubmit}
        >
          <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => {
              navigate('/profile?tab=details');
            }}
          >
            <X />
          </div>
          <h1 className='font-medium text-xl'>Travel documents</h1>
          <p className='text-sm'>
            Your passport is essential for international travel. We'll share reminders about travel restrictions and passport validity that may impact your trip.
          </p>
          <div className='flex flex-col gap-3'>
              <h1 className='font-medium text-lg'>Passport</h1>
              <div className='relative w-full'>
                <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                <label 
                  htmlFor="travelDocument.country"
                  className='text-[0.7rem] absolute top-1.5 left-3'
                >
                  Country
                </label>
                <select 
                  id="travelDocument.country"
                  value={formData.travelDocument?.country || ''} // Set the value to reflect the current state
                  onChange={(e) => handleChange(e)} // Handle state updates
                  className='w-full border border-black pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                >
                  <option value="United state">United state</option>
                  <option value="Canada">Canada</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United kingdom">United kingdom</option>
                </select>
              </div>
              <div className='rounded-xl w-full h-14 relative'>
                <label
                  htmlFor="travelDocument.passportNumber"
                  className={`absolute left-4 transition-all duration-300 ease-in-out cursor-text ${
                  isFocused3 || (formData.travelDocument?.passportNumber && formData.travelDocument?.passportNumber !== "Not provided")
                    ? 'top-[0.05rem] scale-75 text-[#48aadf] transform -translate-x-4' // Label moves up and scales down when focused
                    : 'top-1/2 transform -translate-y-1/2 text-black'
                  }`}
                >
                  Passport number
                </label>
                <input
                  type="text"
                  id="travelDocument.passportNumber"
                  value={formData.travelDocument?.passportNumber === "Not provided" ? "" : formData.travelDocument?.passportNumber || ""}
                  onChange={handleChange}
                  className="w-full border border-black rounded-lg h-14 pl-4 pt-3 pb-1 text-base"
                  onFocus={() => setIsFocused3(true)}
                  autoComplete='off'
                  onBlur={(e) => {
                    if (!e.target.value || e.target.value === "Not provided") {
                      setFormData((prev) => ({
                        ...prev,
                        travelDocument: {
                          ...prev.travelDocument,
                          passportNumber: "Not provided",
                        },
                      }));
                    }
                    setIsFocused3(false);
                  }}
                />
              </div>
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <h1 className='font-medium text-lg'>Expiration date</h1>
            <div className='w-full flex items-center justify-between'>
              <div className='flex flex-col gap-1 border border-black p-2 rounded-md'>
                <p className='text-[0.7rem]'>Month</p>
                <input 
                  type="text" 
                  id="travelDocument.expirationDate.month"
                  placeholder='MM'
                  value={formData.travelDocument?.expirationDate === 'Not provided' 
                    ? '' 
                    : formData.travelDocument?.expirationDate?.split('/')[0] || ''
                  }
                  maxLength={2} // Limit to 4 digits
                  onChange={(e) => handleDateChange(e.target.value, 0)}
                  autoComplete='off'
                  className='sm:w-24 w-16 bg-transparent'
                />
              </div>
              <div className='flex flex-col gap-1 border border-black p-2 rounded-md'>
                <p className='text-[0.7rem]'>Day</p>
                <input 
                  type="text" 
                  id="travelDocument.expirationDate.day"
                  autoComplete='off'
                  placeholder='DD'
                  value={formData.travelDocument?.expirationDate?.split('/')[1] || ''}
                  maxLength={2} // Limit to 4 digits
                  onChange={(e) => handleDateChange(e.target.value, 1)}
                  className='sm:w-24 w-16 bg-transparent'
                />
              </div>
                <div className='flex flex-col gap-1 border border-black p-2 rounded-md'>
                  <p className='text-[0.7rem]'>Year</p>
                  <input 
                    type="text" 
                    id="travelDocument.expirationDate.year"
                    autoComplete='off'
                    placeholder='YYYY'
                    value={formData.travelDocument?.expirationDate?.split('/')[2] || ''}
                    maxLength={4} // Limit to 4 digits
                    onChange={(e) => handleDateChange(e.target.value, 2)}
                    className='sm:w-24 w-16 bg-transparent'
                  />
                </div>
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
          </div>
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
        </form>
      </div>
    </div>
  )
}

export default TravelDocument