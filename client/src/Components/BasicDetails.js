import { ArrowLeft, ChevronDown } from 'lucide-react' // Importing icons for UI.
import React, { useEffect, useState } from 'react' // Importing React and useState, useEffect hooks.
import { useNavigate } from 'react-router-dom' // useNavigate for programmatically navigating to different routes.
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'; // Redux actions for user update.
import { useDispatch, useSelector } from 'react-redux'; // useDispatch to dispatch actions, useSelector to select from Redux state.
import { SyncLoader } from 'react-spinners'; // Loading spinner component to indicate processing.
import ScrollToTop from './ScrollToTop'; // Component that scrolls to the top when navigating.
import { motion } from 'framer-motion' // For animation and motion transitions.

const BasicDetails = () => {
    const { currentUser } = useSelector((state) => state.user); // Selects the current user from Redux store.
    const [isFocused1, setIsFocused1] = useState(false); // Track if the first input field is focused.
    const [isFocused2, setIsFocused2] = useState(false); // Track if the second input field is focused.
    const [formData, setFormData] = useState({}); // Stores the form input data.
    const [initialData, setInitialData] = useState({}); // Keeps a copy of the original data for comparison.
    const [updateUserError, setUpdateUserError] = useState(null); // State to store any error during update.
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // State to store success message.
    const [loading, setLoading] = useState(false); // State to manage loading spinner.
    const navigate = useNavigate(); // Hook for navigation.
    const dispatch = useDispatch(); // Hook to dispatch actions.

    const handleGenderChange = (gender) => { 
        setFormData((prev) => ({ ...prev, gender })); // Updates gender in formData state.
    };

    // useEffect hook to run once the component mounts and when currentUser is updated.
    useEffect(() => {
        if (currentUser) {
            const userData = { // Initializes formData with currentUser values.
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                bio: currentUser.bio || '',
                DOB: currentUser.DOB || '',
                gender: currentUser.gender || '',
                needs: currentUser.needs || '',
            };
            setFormData(userData); // Set the form data with the current user values.
            setInitialData(userData); // Store initial data for later comparison.
        }

        setIsFocused1(!!currentUser.firstName); // Check if first name is present.
        setIsFocused2(!!currentUser.lastName); // Check if last name is present.
    }, [currentUser]); // Dependencies array to run this effect when currentUser changes.

    const handleChange = (e) => { 
        setFormData({ ...formData, [e.target.id]: e.target.value }); // Updates formData when any input changes.
    };

    // Function to validate the user's Date of Birth (DOB).
    const isValidDOB = (month, day, year) => {
        if (!month || !day || !year) return false; // Return false if any part of DOB is missing.

        // Convert values to integers and check if they're valid numbers.
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        const y = parseInt(year, 10);

        // Ensure month, day, and year fall within valid ranges.
        if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear() - 16) {
            return false; // Invalid date ranges.
        }

        // Create a date object and check if the date matches the input.
        const date = new Date(y, m - 1, d); // JS months are 0-indexed.
        return date.getMonth() + 1 === m && date.getDate() === d && date.getFullYear() === y; // Validate date.
    };

    // Function to handle form submission (update user data).
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior.
        setUpdateUserError(null); // Resets previous error message.
        setUpdateUserSuccess(null); // Resets previous success message.

        // Check if the form data is unchanged from the initial data.
        const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);
        if (isUnchanged) {
            setUpdateUserError('No changes made'); // Show error if no changes were made.
            return;
        }

        // Validate required fields.
        if (!formData.firstName) {
            setUpdateUserError('Kindly enter your first name'); // Error if first name is missing.
            return;
        }

        if (!formData.lastName) {
            setUpdateUserError('Kindly enter your last name'); // Error if last name is missing.
            return;
        }

        // Validate DOB if provided.
        const [month, day, year] = formData.DOB?.split('/') || [];
        if (!isValidDOB(month, day, year)) {
            setUpdateUserError('Please provide a valid Date of Birth (MM/DD/YYYY)'); // Error for invalid DOB.
            return;
        }
    
        try {
          dispatch(updateStart()); // Dispatch the start action for updating user.
          setLoading(true); // Set loading state to true.
            const res = await fetch(`/api/user/update/${currentUser._id}`, { // Send PUT request to update user data.
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            const data = await res.json(); // Parse response JSON.
        
            if (!res.ok) { // If the response is not OK, show error.
                dispatch(updateFailure(data.message)); // Dispatch failure action to Redux.
                setUpdateUserError(data.message); // Display error message.
                setLoading(false); // Set loading state to false.
        
            } else {
                dispatch(updateSuccess(data)); // Dispatch success action to Redux.
                setUpdateUserSuccess("Update successful"); // Display success message.
                setLoading(false); // Set loading state to false.

                // Navigate to the profile page after 3 seconds.
                setTimeout(() => {
                    navigate('/profile?tab=details');
                }, 3000);
            }
        } catch (error) {
          dispatch(updateFailure(error.message)); // Dispatch failure if an error occurs.
          setUpdateUserError(error.message); // Display error message.
        }
    };

    // useEffect hook to handle success or error messages, and clear them after 3 seconds.
    useEffect(() => {
        if (updateUserSuccess || updateUserError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null); // Clear success message after 3 seconds.
                setUpdateUserError(null); // Clear error message after 3 seconds.
            }, 3000);
      
          // Cleanup the timer if the component unmounts or the state changes before 3 seconds
          return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError]); // Run when updateUserSuccess or updateUserError changes.

  return (
    <motion.div 
        initial={{ opacity: 0 }} // Initial state of opacity (hidden)
        animate={{ opacity: 1 }} // Final state of opacity (visible)
        exit={{ opacity: 0 }} // Exit animation state (hidden)
        transition={{
            duration: .5, // Duration of the animation (0.5 seconds)
            ease: "easeInOut" // Easing function for smooth transition
        }}
        className='bg-blue-100 flex-1 rounded-3xl relative p-14 flex flex-col w-full items-center gap-5'
    >

        {/* Component to scroll to the top of the page when it mounts */}
        <ScrollToTop/> 

        {/* Back navigation button */}
        <div 
            className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
            onClick={() => navigate(-1)} // Navigate to the previous page when clicked
        >

            {/* Left arrow icon component for navigation */}
            <ArrowLeft/> 
        </div>

        {/* Title and description for the form section */}
        <div className='flex flex-col gap-1'>
            <h1 className='font-medium sm:text-3xl text-2xl self-center'>Basic information</h1>
            <p className='text-sm'>Make sure this information matches your travel ID, like your passport or license.</p>
        </div>

        {/* Form for user input */}
        <form 
            className='flex flex-col gap-5'
            onSubmit={handleSubmit} // Handle form submission
        >
            {/* Full name input fields */}
            <div className='flex flex-col gap-1'>
                <h3 className='font-medium'>Full name</h3>
                <div className='flex flex-col gap-3'>
                    {/* First name input field with label */}
                    <div className='rounded-lg w-72 h-14 relative'>
                        <label
                            htmlFor="firstName"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused1
                                ? 'top-1 transform -translate-x-2 scale-75' // Moves and scales down label when focused
                                : 'top-1/2 transform -translate-y-1/2' // Centered label when not focused
                            }`}
                        >
                            First name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName ?? currentUser.firstName} // Display current value or fallback
                            onChange={handleChange} // Handle changes in the input field
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused1(true)} // Focus event to move the label up
                            autoComplete='off' // Disable browser autofill
                            onBlur={(e) => !e.target.value && setIsFocused1(false)} // Reset label position if input is empty
                        />
                    </div>

                    {/* Last name input field with label */}
                    <div className='rounded-lg w-72 h-14 relative'>
                        <label
                            htmlFor="lastName"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused2
                                ? 'top-1 transform -translate-x-2 scale-75' // Moves and scales down label when focused
                                : 'top-1/2 transform -translate-y-1/2' // Centered label when not focused
                            }`}
                        >
                            Last name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName ?? currentUser.lastName} // Display current value or fallback
                            onChange={handleChange} // Handle changes in the input field
                            className="w-full border-b-2 border-[#48aadf] bg-white rounded-lg h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused2(true)} // Focus event to move the label up
                            autoComplete='off' // Disable browser autofill
                            onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset label position if input is empty
                        />
                    </div>
                </div>
            </div>

            {/* Bio input section */}
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>About you</h3>
                <div className='flex flex-col border-b-2 border-[#48aadf] bg-white rounded-lg p-3 w-72'>
                    <p className='text-sm'>Bio</p>
                    <textarea 
                        id="bio" 
                        onChange={handleChange} // Handle changes in bio field
                        value={formData.bio === 'Not provided' ? '' : formData.bio} // Fallback to empty if not provided
                        className='bg-transparent w-full resize-none min-h-32'
                        placeholder='Help future hosts get to know you better' // Placeholder for the textarea
                    ></textarea>
                </div>
            </div>

            {/* Date of birth input section */}
            <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>Date of Birth</h3>
                <div className='flex items-center w-72 justify-between'>
                    {/* Month input */}
                    <div className='border-b-2 border-[#48aadf] bg-white py-2 px-3 rounded-lg flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Month</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='MM' // Placeholder for month
                            value={formData.DOB === 'Not provided' ? '' : formData.DOB?.split('/')[0]} // Display month part of DOB
                            maxLength={2} // Limit input to 2 digits for month
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                    ...prev,
                                    DOB: `${value}/${prev.DOB?.split('/')[1] || ''}/${prev.DOB?.split('/')[2] || ''}`, // Update DOB state
                                }));
                            }}
                            className='bg-transparent w-16'
                        />
                    </div>

                    {/* Day input */}
                    <div className='border-b-2 border-[#48aadf] bg-white py-2 px-3 rounded-lg flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Day</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='DD' // Placeholder for day
                            value={formData.DOB?.split('/')[1] || ''} // Display day part of DOB
                            maxLength={2} // Limit input to 2 digits for day
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                    ...prev,
                                    DOB: `${prev.DOB?.split('/')[0] || ''}/${value}/${prev.DOB?.split('/')[2] || ''}`, // Update DOB state
                                }));
                            }}
                            className='bg-transparent w-16'
                        />
                    </div>

                    {/* Year input */}
                    <div className='border-b-2 border-[#48aadf] bg-white py-2 px-3 rounded-lg flex flex-col gap-1'>
                        <p className='text-[0.7rem]'>Year</p>
                        <input 
                            type="text"
                            id='DOB'
                            autoComplete='off'
                            placeholder='YYYY' // Placeholder for year
                            value={formData.DOB?.split('/')[2] || ''} // Display year part of DOB
                            maxLength={4} // Limit input to 4 digits for year
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                setFormData((prev) => ({
                                    ...prev,
                                    DOB: `${prev.DOB?.split('/')[0] || ''}/${prev.DOB?.split('/')[1] || ''}/${value}`, // Update DOB state
                                }));
                            }}
                            className='bg-transparent w-16'
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                {/* Label and input fields for the 'Gender' section */}
                <h3 className='font-semibold'>Gender</h3>
                <div className='flex flex-col gap-2'>
                    {/* Male radio button */}
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="male" 
                            checked={formData.gender === 'male'} // If the selected gender matches 'male', this radio button will be checked
                            onChange={() => handleGenderChange('male')} // Handle gender change by passing 'male' as the selected gender
                        />
                        <label 
                            htmlFor="male"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Male
                        </label>
                    </div>
                    {/* Female radio button */}
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="female" 
                            checked={formData.gender === 'female'} // If the selected gender matches 'female', this radio button will be checked
                            onChange={() => handleGenderChange('female')} // Handle gender change by passing 'female' as the selected gender
                        />
                        <label 
                            htmlFor="female"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Female
                        </label>
                    </div>
                    {/* Unspecified gender radio button */}
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="unspecified" 
                            checked={formData.gender === 'unspecified'} // If the selected gender matches 'unspecified', this radio button will be checked
                            onChange={() => handleGenderChange('unspecified')} // Handle gender change by passing 'unspecified' as the selected gender
                        />
                        <label 
                            htmlFor="unspecified"
                            className='text-sm cursor-pointer radio-label'
                        >
                            Unspecified (X)
                        </label>
                    </div>
                    {/* Undisclosed gender radio button */}
                    <div className='flex items-center gap-5 radio-container'>
                        <input 
                            type="radio" 
                            id="undisclose" 
                            checked={formData.gender === 'undisclose'} // If the selected gender matches 'undisclose', this radio button will be checked
                            onChange={() => handleGenderChange('undisclose')} // Handle gender change by passing 'undisclose' as the selected gender
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
                {/* Label and input fields for 'Accessibility needs' section */}
                <h3 className='font-semibold'>Accessibility needs</h3>
                <div className='relative w-fit'>
                    {/* ChevronDown icon for dropdown */}
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    {/* Label for the select dropdown */}
                    <label 
                        htmlFor="needs"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Choose an option
                    </label>
                    {/* Accessibility needs dropdown */}
                    <select 
                        id="needs"
                        value={formData.needs ?? "Not provided"} // Set the value of the select dropdown based on the formData state or default to "Not provided"
                        onChange={(e) => handleChange(e)} // Handle state updates on changing the selected option
                        className='border-b-2 border-[#48aadf] bg-white pt-5 pb-1 px-3 pr-5 bg-transparent rounded-md w-72 text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="Not provided">Not provided</option> {/* Default option */}
                        <option value="No, I don't have accessibility needs">No, I don't have accessibility needs</option> {/* Option for no needs */}
                        <option value="Yes, I have accessibility needs">Yes, I have accessibility needs</option> {/* Option for having needs */}
                        <option value="Rather not say">Rather not say</option> {/* Option for opting out of providing information */}
                    </select>
                </div>
            </div>
            {/* Submit button */}
            <button 
                type="submit" // Submit the form
                className={`py-3 text-white font-semibold w-32 rounded-full outline-none mt-5 self-center shrink-button 
                    transition-all duration-300 ease-in-out
                    ${loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`} // Button color and disabled state based on loading state
            >
                <p>
                    {/* Display loading spinner or "Save" text based on the loading state */}
                    {loading 
                        ? <SyncLoader 
                            color="#fff" // Customize the color of the spinner
                            loading={loading} 
                            size={7} // Customize the size of the spinner
                            margin={2} // Customize the margin between circles in the spinner
                        />
                        : 'Save' // Text to display when not loading
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

export default BasicDetails