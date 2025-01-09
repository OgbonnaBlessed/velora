import { ChevronDown, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { SyncLoader } from 'react-spinners';
import { countries } from '../Data/Locations';
import { motion } from 'framer-motion';

const TravelDocument = () => {
  // Access the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State hooks to manage local state for form fields, errors, loading, etc.
  const [isFocused3, setIsFocused3] = useState(false); // State for managing input focus (used for styling)
  const [formData, setFormData] = useState({}); // Holds the current form data
  const [initialData, setInitialData] = useState({}); // Holds initial data to check if changes were made
  const [updateUserError, setUpdateUserError] = useState(null); // Holds error messages
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // Holds success messages
  const [loading, setLoading] = useState(false); // Tracks loading state for form submission
  const dispatch = useDispatch(); // Redux dispatch to trigger actions
  const navigate = useNavigate(); // React router navigation hook

  // Effect hook that runs when the currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Initialize form data with the current user's travel document information
      const userData = {
        travelDocument: {
          country: currentUser.travelDocument?.country || '',
          passportNumber: currentUser.travelDocument?.passportNumber || '',
          expirationDate: currentUser.travelDocument?.expirationDate || '',
        },
      };
      setFormData(userData); // Set the formData with userData
      setInitialData(userData); // Store initial data to compare for changes later
    }
  }, [currentUser]); // Re-run this effect when currentUser changes

  // Handle form field change and update the formData state
  const handleChange = (e) => {
    const { id, value } = e.target; // Get the input ID and value

    setFormData((prev) => {
      const keys = id.split('.'); // Split the ID into parts (e.g., "location.city")
      let updatedData = { ...prev };

      // Traverse and update nested keys based on the split ID
      let currentLevel = updatedData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          currentLevel[key] = value; // Set value at the deepest level
        } else {
          currentLevel[key] = { ...currentLevel[key] }; // Ensure nested structure is preserved
          currentLevel = currentLevel[key];
        }
      });

      return updatedData; // Return updated data to set in state
    });
  };

  // Handle date change for expiration date input fields
  const handleDateChange = (value, index) => {
    setFormData((prev) => {
      const parts = prev.travelDocument?.expirationDate?.split('/') || ['', '', '']; // Split date into parts (MM/DD/YYYY)
      parts[index] = value.replace(/\D/g, ''); // Remove non-digit characters

      return {
        ...prev,
        travelDocument: {
          ...prev.travelDocument,
          expirationDate: parts.join('/'), // Join parts back into a valid expiration date
        },
      };
    });
  };

  // Validate the expiration date (MM/DD/YYYY)
  const isValidExpirationDate = (month, day, year) => {
    if (!month || !day || !year) return false; // Ensure all fields are filled

    // Parse integers for month, day, and year
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    // Validate the ranges for month, day, and year
    if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < new Date().getFullYear()) {
      return false;
    }

    // Validate the actual date using JavaScript's Date object
    const date = new Date(y, m - 1, d); // JS months are 0-indexed
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  // Handle form submission
  const handleSubmit = async (e) =>{
    e.preventDefault(); // Prevent default form submission behavior
    setUpdateUserError(null); // Reset error messages
    setUpdateUserSuccess(null); // Reset success messages

    // Check if there are any changes to the form data
    const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
    if (isUnchanged) {
      setUpdateUserError('No changes made'); // Inform the user that no changes were made
      return;
    }

    // Extract expiration date and validate it
    const expirationDate = formData.travelDocument.expirationDate || '';
    const [month, day, year] = expirationDate.split('/');

    if (!isValidExpirationDate(month, day, year)) {
      setUpdateUserError('Please provide a valid Expiration Date (MM/DD/YYYY)'); // Show error if date is invalid
      return;
    }

    // Dispatch start action for user update
    try {
      dispatch(updateStart());
      setLoading(true); // Set loading state to true

      // Send PUT request to update user data
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const data = await res.json();

      // If the update failed, dispatch failure action and show error
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        console.log(data);
        setLoading(false); // Reset loading state

      } else {
        // If the update was successful, dispatch success action and show success message
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Update successful");
        setLoading(false); // Reset loading state
        
        // Redirect to profile details page after 3 seconds
        setTimeout(() => {
          navigate('/profile?tab=details');
        }, 3000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message)); // Handle error during the request
      setUpdateUserError(error.message);
    }
  };

  // UseEffect hook to reset success and error messages after 3 seconds
  useEffect(() => {
    if (updateUserSuccess || updateUserError) {
      const timer = setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
      }, 3000); // Reset messages after 3 seconds
    
      // Cleanup the timer if component unmounts or state changes before 3 seconds
      return () => clearTimeout(timer);
    }
  }, [updateUserSuccess, updateUserError]); 

  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state for opacity (hidden)
      animate={{ opacity: 1 }} // Final state for opacity (visible)
      exit={{ opacity: 0 }} // State when component exits (hidden)
      transition={{
        duration: .5, // Transition duration of 0.5 seconds
        ease: "easeInOut" // Easing function for smooth animation
      }}
    >
      {/* Container for the modal, covering the entire screen */}
      <div className='fixed inset-0 bg-white z-[10001] flex justify-center items-center'>
        {/* The form for updating the travel documents */}
        <form 
          className='flex flex-col gap-5 w-[28rem] max-w-[90%]' // Form styling: column layout, responsive width
          onSubmit={handleSubmit} // Trigger form submit on this event
        >
          {/* Close button */}
          <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => {
              navigate('/profile?tab=details'); // Navigate back to the profile details tab
            }}
          >
            <X /> {/* Close icon */}
          </div>
          
          {/* Title of the modal */}
          <h1 className='font-medium text-xl'>Travel documents</h1>
          
          {/* Description text for the modal */}
          <p className='text-sm'>
            Your passport is essential for international travel. We'll share reminders about travel restrictions and passport validity that may impact your trip.
          </p>
          
          {/* Passport information section */}
          <div className='flex flex-col gap-3'>
            <h1 className='font-medium text-lg'>Passport</h1>
            
            {/* Country selector */}
            <div className='relative w-full'>
              <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
              <label 
                htmlFor="travelDocument.country" // Label for the country dropdown
                className='text-[0.7rem] absolute top-1.5 left-3'
              >
                Country
              </label>
              
              {/* Dropdown for selecting the country */}
              <select 
                id="travelDocument.country"
                value={formData.travelDocument?.country || ''} // Set the value to reflect the current state
                onChange={(e) => handleChange(e)} // Handle state updates
                className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
              >
                {countries.map((country, i) => (
                  <option key={i} value={country.name}>{country.name}</option> // Display countries in the dropdown
                ))}
              </select>
            </div>
            
            {/* Passport number input field */}
            <div className='rounded-xl w-full h-14 relative'>
              <label
                htmlFor="travelDocument.passportNumber"
                className={`absolute left-4 transition-all duration-500 ease-in-out cursor-text ${
                  isFocused3 || (formData.travelDocument?.passportNumber && formData.travelDocument?.passportNumber !== "Not provided")
                    ? 'top-[0.05rem] scale-75 text-[#48aadf] transform -translate-x-4' // Label moves up and scales down when focused
                    : 'top-1/2 transform -translate-y-1/2 text-black'
                }`}
              >
                Passport number
              </label>
              
              {/* Passport number input */}
              <input
                type="text"
                id="travelDocument.passportNumber"
                value={formData.travelDocument?.passportNumber === "Not provided" 
                  ? "" 
                  : formData.travelDocument?.passportNumber || "" // Handle case when no passport number is provided
                }
                onChange={handleChange} // Update the form state on input change
                className="w-full shadow shadow-gray-400 rounded-lg h-14 px-4 py-3 text-base"
                onFocus={() => setIsFocused3(true)} // Mark field as focused
                autoComplete='off'
                onBlur={(e) => { // Handle blur event when user leaves the input
                  if (!e.target.value || e.target.value === "Not provided") {
                    setFormData((prev) => ({
                      ...prev,
                      travelDocument: {
                        ...prev.travelDocument,
                        passportNumber: "Not provided", // Reset passport number if input is empty
                      },
                    }));
                  }
                  setIsFocused3(false); // Remove focus state
                }}
              />
            </div>
          </div>
          
          {/* Expiration date section */}
          <div className='flex flex-col gap-3 w-full'>
            <h1 className='font-medium text-lg'>Expiration date</h1>
            
            {/* Expiration date inputs for month, day, and year */}
            <div className='w-full flex items-center justify-between'>
              {/* Month input */}
              <div className='flex flex-col gap-1 shadow shadow-gray-400 p-2 rounded-md'>
                <p className='text-[0.7rem]'>Month</p>
                <input 
                  type="text" 
                  id="travelDocument.expirationDate.month"
                  placeholder='MM'
                  value={formData.travelDocument?.expirationDate === 'Not provided' 
                    ? '' 
                    : formData.travelDocument?.expirationDate?.split('/')[0] || ''
                  }
                  maxLength={2} // Limit to 2 digits for the month
                  onChange={(e) => handleDateChange(e.target.value, 0)} // Update month value in state
                  autoComplete='off'
                  className='sm:w-24 w-16 bg-transparent'
                />
              </div>
              
              {/* Day input */}
              <div className='flex flex-col gap-1 shadow shadow-gray-400 p-2 rounded-md'>
                <p className='text-[0.7rem]'>Day</p>
                <input 
                  type="text" 
                  id="travelDocument.expirationDate.day"
                  autoComplete='off'
                  placeholder='DD'
                  value={formData.travelDocument?.expirationDate?.split('/')[1] || ''}
                  maxLength={2} // Limit to 2 digits for the day
                  onChange={(e) => handleDateChange(e.target.value, 1)} // Update day value in state
                  className='sm:w-24 w-16 bg-transparent'
                />
              </div>
              
              {/* Year input */}
              <div className='flex flex-col gap-1 shadow shadow-gray-400 p-2 rounded-md'>
                <p className='text-[0.7rem]'>Year</p>
                <input 
                  type="text" 
                  id="travelDocument.expirationDate.year"
                  autoComplete='off'
                  placeholder='YYYY'
                  value={formData.travelDocument?.expirationDate?.split('/')[2] || ''}
                  maxLength={4} // Limit to 4 digits for the year
                  onChange={(e) => handleDateChange(e.target.value, 2)} // Update year value in state
                  className='sm:w-24 w-16 bg-transparent'
                />
              </div>
            </div>
            
            {/* Submit button */}
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
                      color="#fff" // Customize the color of the loader
                      loading={loading} 
                      size={7} // Set the size of the loader
                      margin={2} // Set margin between loader circles
                    />
                  : 'Save'
                }
              </p>
            </button>
          </div>
          
          {/* Success message */}
          <p className={`text-[0.7rem] text-center font-serif -mt-4 text-green-500 transform transition-all duration-700 ease-in-out ${
              updateUserSuccess 
                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-5 pointer-events-none'
            }`}
          >
            {updateUserSuccess}
          </p>

          {/* Error message */}
          <p className={`text-[0.7rem] text-center font-serif -mt-4 text-red-500 transform transition-all duration-700 ease-in-out ${
              updateUserError 
                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-5 pointer-events-none'
            }`}
          >
            {updateUserError}
          </p>
        </form>
      </div>
    </motion.div>
  )
}

export default TravelDocument