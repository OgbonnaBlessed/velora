import { ArrowLeft, ChevronDown } from 'lucide-react'; // Importing icons for UI components
import React, { useEffect, useState } from 'react'; // Importing React hooks
import { useNavigate } from 'react-router-dom'; // For navigation between routes
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'; // Redux actions for updating user state
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks to access and modify global state
import { SyncLoader } from 'react-spinners'; // Loader for indicating async operations
import { countries } from '../Data/Locations'; // Importing a list of countries for selection
import ScrollToTop from './ScrollToTop'; // Component to scroll to the top of the page on navigation
import { motion } from 'framer-motion'; // For animations in UI components

// Main functional component
const ContactDetails = () => {
    const { currentUser } = useSelector((state) => state.user); // Access current user data from Redux store
    const [isFocused1, setIsFocused1] = useState(false); // Tracks focus state for input fields (can be used for styling)
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [isFocused7, setIsFocused7] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // Tracks the state of a checkbox
    const [formData, setFormData] = useState({}); // Stores user-entered form data
    const [initialData, setInitialData] = useState({}); // Stores the original data for comparison
    const [updateUserError, setUpdateUserError] = useState(null); // Tracks any error during user update
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // Tracks success messages during user update
    const [loading, setLoading] = useState(false); // Indicates whether an async operation is in progress
    const navigate = useNavigate(); // Hook for navigating to other routes
    const dispatch = useDispatch(); // Redux dispatch for triggering actions

    // Toggles the state of the checkbox
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    // Initializes form data with the current user's details
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
                },
            };
            setFormData(userData);
            setInitialData(userData); // Keep a copy of the original data for later comparison
        }
    }, [currentUser]); // Runs when currentUser changes

    // Handles changes to form inputs and updates nested form data structure
    const handleChange = (e) => {
        const { id, value } = e.target; // Extract input ID and value
    
        setFormData((prev) => {
            const keys = id.split('.'); // Split nested keys like "location.city"
            let updatedData = { ...prev }; // Create a copy of the current form data
    
            // Traverse and update nested keys
            let currentLevel = updatedData;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    currentLevel[key] = value; // Update the target property
                } else {
                    currentLevel[key] = { ...currentLevel[key] }; // Create a copy of nested objects
                    currentLevel = currentLevel[key]; // Traverse deeper
                }
            });
    
            return updatedData; // Return the updated data
        });
    };

    // Handles form submission to update user details
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null); // Clear previous error messages
        setUpdateUserSuccess(null); // Clear previous success messages
    
        // Check if changes were made by comparing current data with initial data
        const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
        if (isUnchanged) {
            setUpdateUserError('No changes made');
            return;
        }
    
        try {
            dispatch(updateStart()); // Dispatch start of update action
            setLoading(true); // Show loading spinner
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send updated form data
            });
        
            const data = await res.json(); // Parse JSON response
        
            if (!res.ok) {
                dispatch(updateFailure(data.message)); // Dispatch failure action
                setUpdateUserError(data.message); // Display error message
                console.log(data); // Log error for debugging
                setLoading(false); // Hide loading spinner
            } else {
                dispatch(updateSuccess(data)); // Dispatch success action
                setUpdateUserSuccess("Update successful"); // Display success message
                setLoading(false);

                // Redirect to profile page after a delay
                setTimeout(() => {
                    navigate('/profile?tab=details');
                }, 3000);
            }
        } catch (error) {
            dispatch(updateFailure(error.message)); // Dispatch failure action on error
            setUpdateUserError(error.message); // Display error message
        }
    };

    // Clears success or error messages after 3 seconds
    useEffect(() => {
        if (updateUserSuccess || updateUserError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null); // Clear success message
                setUpdateUserError(null); // Clear error message
            }, 3000); // 3 seconds delay
      
            // Cleanup timer if component unmounts or state changes
            return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError]); // Runs when success or error state changes

  return (
    <motion.div 
        // Animation settings for smooth fade-in and fade-out effects
        initial={{ opacity: 0 }} // Initial state: hidden
        animate={{ opacity: 1 }} // Animation: fully visible
        exit={{ opacity: 0 }} // Exit animation: fade out
        transition={{
            duration: .5, // Animation duration: 0.5 seconds
            ease: "easeInOut" // Smooth easing function for animation
        }}
        className='bg-blue-100 flex-1 rounded-3xl relative p-14 flex flex-col w-full items-center gap-5'
    >
        {/* ScrollToTop component ensures the page scrolls to the top when rendered */}
        <ScrollToTop />

        {/* Back button with an arrow icon to navigate to the previous page */}
        <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => navigate(-1)} // Navigate back one step in history
        >
            <ArrowLeft />
        </div>

        {/* Header section with title and description */}
        <div className='flex flex-col gap-1'>
            <h1 className='font-medium sm:text-3xl text-2xl self-center'>Contact</h1>
            <p className='text-sm'>Receive account activity alerts and trip updates by sharing this information.</p>
        </div>

        {/* Form for submitting contact details */}
        <form 
            className='flex flex-col gap-10'
            onSubmit={handleSubmit} // Handles form submission
        >
            {/* Section for entering mobile number */}
            <div className='flex flex-col gap-1'>
                <h3 className='font-medium'>Mobile number</h3>
                <div className='flex flex-col gap-4'>
                    <div className='flex max-sm:flex-col gap-3'>

                        {/* Country code dropdown */}
                        <div className='relative w-fit'>
                            <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none' />
                            <label 
                                htmlFor="countryCode"
                                className='text-[0.7rem] absolute top-2 left-3'
                            >
                                Country code
                            </label>
                            <select 
                                id="countryCode" // Field ID
                                value={formData.countryCode ?? currentUser.countryCode} // Use formData or fallback to currentUser value
                                onChange={(e) => handleChange(e)} // Update formData on change
                                className='border-b-2 border-[#48aadf] bg-white pt-5 pb-2 px-3 pr-5 bg-transparent rounded-lg w-72 text-black appearance-none text-base cursor-pointer'
                            >
                                {/* Map over countries data to render each option */}
                                {countries.map((country, index) => (
                                    <option 
                                        key={index} // Unique key for each option
                                        value={country.phone_code} // Country's phone code as the value
                                    >
                                        {country.name} {country.phone_code} {/* Display country name and code */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phone number input field */}
                        <div className='rounded-lg w-72 h-14 relative'>
                            <label
                                htmlFor="number"
                                className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                                    isFocused1 || (formData.number && formData.number !== "Not provided")
                                        ? 'top-1 transform -translate-x-3 scale-75' // Moves label up when focused or filled
                                        : 'top-1/2 transform -translate-y-1/2' // Centered label when not focused
                                }`}
                            >
                                Phone number
                            </label>
                            <input
                                type="text"
                                id="number" // Field ID
                                value={formData.number === 'Not provided' ? '' : formData.number} // Handle "Not provided" case
                                onChange={handleChange} // Update formData on change
                                className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                                onFocus={() => setIsFocused1(true)} // Set focus state
                                autoComplete='off'
                                onBlur={(e) => !e.target.value && setIsFocused1(false)} // Reset focus state if input is empty
                            />
                        </div>
                    </div>

                    {/* Checkbox for opting into SMS updates */}
                    <div>
                        <input 
                            type="checkbox" 
                            id="SMS" // Field ID
                            checked={isChecked} // Checkbox state
                            onClick={handleCheckboxChange} // Toggle checkbox state
                            className='hidden' // Hidden native checkbox
                        />
                        <label 
                            htmlFor="SMS" 
                            className="flex items-start cursor-pointer"
                        >
                            {/* Custom checkbox styling */}
                            <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 
                                    transition-all duration-300 
                                    ${isChecked 
                                        ? 'border-[#4078bc] bg-[#4078bc]' // Active state styles
                                        : 'border-gray-500' // Inactive state styles
                                    }`
                                }
                            >
                                {/* Checkmark icon, shown when checkbox is checked */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                                        ${isChecked ? 'opacity-100' : 'opacity-0'}` // Toggle icon visibility
                                    }
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M5 13l4 4L19 7" // Checkmark path
                                    />
                                </svg>
                            </div>

                            {/* Checkbox label text */}
                            <span className="ml-2 text-black text-sm -mt-0.5">
                                <p className='font-semibold text-sm'>Send me SMS updates</p>
                                <p className='text-[0.7rem] -mt-1'>Messaging and data rates may apply.</p>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {/* Emergency Contact Section */}
                <div className='flex flex-col gap-1'>
                    {/* Section Title */}
                    <h3 className='font-semibold'>Emergency contact</h3>
                    {/* Subtitle/Description */}
                    <p className='text-sm -mt-1'>Trusted person in case of emergency</p>
                </div>

                {/* Contact Name Input */}
                <div className='rounded-xl w-72 h-14 relative'>
                    <label
                        htmlFor="emergency.name"
                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                        isFocused2 || (formData.emergency?.name && formData.emergency?.name !== "Not provided")
                            ? 'top-1 transform -translate-x-3 scale-75' // Label floats up and shrinks when focused or has value
                            : 'top-1/2 transform -translate-y-1/2' // Default centered position
                        }`}
                    >
                        Contact name
                    </label>
                    <input
                        type="text"
                        id="emergency.name"
                        value={formData.emergency?.name || ''} // Handles optional chaining and default empty string
                        onChange={handleChange} // Updates the formData state
                        className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                        onFocus={() => setIsFocused2(true)} // Sets focus state to true
                        autoComplete='off' // Prevents browser auto-complete
                        onBlur={(e) => !e.target.value && setIsFocused2(false)} // Resets focus state if input is empty
                    />
                </div>

                {/* Contact Phone Details */}
                <div className='flex max-sm:flex-col items-center gap-3'>
                    {/* Country Code Dropdown */}
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
                            value={formData.emergency?.countryCode || ''} // Defaults to empty if undefined
                            onChange={handleChange} // Updates formData state
                            className='border-b-2 border-[#48aadf] bg-white pt-5 pb-2 px-3 pr-5 bg-transparent rounded-lg w-72 text-black appearance-none text-base cursor-pointer'
                        >
                            {countries.map((country, index) => (
                                <option 
                                    key={index} 
                                    value={country.phone_code} // Sets value as the country phone code
                                >
                                    {country.name} {country.phone_code} {/* Displays country name and code */}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Phone Number Input */}
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="emergency.phoneNumber"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused3 || (formData.emergency?.phoneNumber && formData.emergency?.phoneNumber !== "Not provided")
                                ? 'top-1 transform -translate-x-3 scale-75' // Label floats up and shrinks when focused or has value
                                : 'top-1/2 transform -translate-y-1/2' // Default centered position
                            }`}
                        >
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="emergency.phoneNumber"
                            value={formData.emergency?.phoneNumber || ''} // Handles optional chaining and default empty string
                            onChange={handleChange} // Updates the formData state
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused3(true)} // Sets focus state to true
                            autoComplete='off' // Prevents browser auto-complete
                            onBlur={(e) => !e.target.value && setIsFocused3(false)} // Resets focus state if input is empty
                        />
                    </div>
                </div>

                {/* Email Section */}
                <div className='flex flex-col gap-1'>
                    {/* Email Title */}
                    <h3 className='font-semibold'>Email</h3>
                    {/* Current User's Email */}
                    <p className='text-sm'>{currentUser.email}</p>
                    {/* Instructions to Change Email */}
                    <p className='text-sm'>
                        You can change your email in{" "} 
                        <span 
                            className='text-[#48aadf] cursor-pointer'
                            onClick={() => navigate('/profile?tab=settings')} // Redirects user to settings page
                        >
                            settings
                        </span>
                    </p>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {/* Section Title */}
                <h3 className='font-semibold'>Address</h3>

                {/* Address Form Fields */}
                <div className='flex flex-col gap-3'>
                    
                    {/* Country/Region Dropdown */}
                    <div className='relative w-fit'>
                        {/* Dropdown Icon */}
                        <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none' />
                        
                        {/* Label for Country/Region */}
                        <label 
                            htmlFor="location.region"
                            className='text-[0.7rem] absolute top-2 left-3'
                        >
                            Country/Region
                        </label>

                        {/* Dropdown Menu */}
                        <select 
                            id="location.region"
                            value={formData.location?.region || ''} // Controlled component to handle state
                            onChange={handleChange} // Updates the state when the selection changes
                            className='border-b-2 border-[#48aadf] pt-5 pb-2 px-3 pr-5 bg-white rounded-lg w-72 text-black appearance-none text-base cursor-pointer'
                        >
                            {/* Dynamically rendering country options */}
                            {countries.map((country, index) => (
                                <option key={index} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Address Input Field */}
                    <div className='rounded-xl w-72 h-14 relative'>
                        {/* Label for Address with animation */}
                        <label
                            htmlFor="location.address"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused4 || (formData.location?.address && formData.location?.address !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75' // Shrinks and moves up when focused or filled
                                : 'top-1/2 transform -translate-y-1/2'
                            }`}
                        >
                            Address
                        </label>
                        
                        {/* Input Field */}
                        <input
                            type="text"
                            id="location.address"
                            value={formData.location?.address || ''} // Controlled input
                            onChange={handleChange} // Update the state on change
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused4(true)} // Set focus state
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused4(false)} // Reset focus if input is empty
                        />
                    </div>

                    {/* Similar structure for City, State, and ZIP code fields */}
                    {/* City Input Field */}
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.city"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused5 || (formData.location?.city && formData.location?.city !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75'
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
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused5(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused5(false)}
                        />
                    </div>

                    {/* State Input Field */}
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.state"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused6 || (formData.location?.state && formData.location?.state !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75'
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
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused6(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused6(false)}
                        />
                    </div>

                    {/* ZIP Code Input Field */}
                    <div className='rounded-xl w-72 h-14 relative'>
                        <label
                            htmlFor="location.zip"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused7 || (formData.location?.zip && formData.location?.zip !== "Not provided")
                                ? 'top-1 transform -translate-x-1 scale-75'
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
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused7(true)}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused7(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                className={`py-3 text-white font-semibold w-32 rounded-full outline-none mt-5 self-center shrink-button 
                    transition-all duration-300 ease-in-out
                    ${loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`
                }
            >
                {/* Conditional Rendering for Loading Spinner or Button Text */}
                <p>
                    {loading 
                        ? <SyncLoader 
                            color="#fff" // Loader color
                            loading={loading} 
                            size={7} // Loader size
                            margin={2} // Space between circles
                        />
                        : 'Save'
                    }
                </p>
            </button>
        </form>

        {/* Update Success Message */}
        <p 
            className={`text-[0.7rem] -mt-4 text-green-500 transform transition-all duration-700 ease-in-out 
                ${updateUserSuccess 
                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`
            }
        >
            {updateUserSuccess}
        </p>

        {/* Update Failure Message */}
        <p 
            className={`text-[0.7rem] -mt-4 text-red-500 transform transition-all duration-700 ease-in-out 
                ${updateUserError 
                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`
            }
        >
            {updateUserError}
        </p>
    </motion.div>
  )
}

export default ContactDetails