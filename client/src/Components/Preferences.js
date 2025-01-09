// Importing necessary libraries and components
import { ChevronDown, X } from 'lucide-react'; // Importing icons for UI (Chevron and Close icon)
import React, { useEffect, useState } from 'react'; // React hooks
import { useDispatch, useSelector } from 'react-redux'; // For Redux state management
import { useNavigate } from 'react-router-dom'; // For navigation between routes
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'; // Redux actions for user updates
import { SyncLoader } from 'react-spinners'; // Loading spinner component
import { countries } from '../Data/Locations'; // List of countries (presumably for a dropdown or selection)
import { motion } from 'framer-motion'; // For animations (potentially for page transitions)

// Main component for Preferences
const Preferences = () => {
    // Extracting the current user from the global Redux state
    const { currentUser } = useSelector((state) => state.user);
    
    // Local state for managing form data, initial data, and loading/error states
    const [formData, setFormData] = useState({}); 
    const [initialData, setInitialData] = useState({}); // For comparing with new data to detect changes
    const [updateUserError, setUpdateUserError] = useState(null); // Error state for update failure
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // Success state for successful update
    const [loading, setLoading] = useState(false); // Loading state for async actions
    
    // Hooks for navigation and Redux dispatch
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect to set initial data when currentUser is available
    useEffect(() => {
        if (currentUser) {
            // Populate formData with current user preferences, fallback to empty string if data is missing
            const userData = {
                preference: {
                    country: currentUser.preference?.country || '', // Optional chaining to prevent errors if data is undefined
                    seatPreference: currentUser.preference?.seatPreference || '',
                    specialAssisstance: currentUser.preference?.specialAssisstance || '',
                },
            };
            setFormData(userData); // Setting the state for formData
            setInitialData(userData); // Keeping a copy of the initial data to compare against
        }
    }, [currentUser]); // Dependency array ensures this effect runs when currentUser changes
    
    // Handle change of any form field (including nested fields like "preference.country")
    const handleChange = (e) => {
        const { id, value } = e.target; // Destructure id and value from event target (e.g., form inputs)

        setFormData((prev) => {
            const keys = id.split('.'); // Split id for nested keys (e.g., 'preference.country')
            let updatedData = { ...prev }; // Copy of the previous formData to avoid mutating state

            // Traverse and update nested keys
            let currentLevel = updatedData; 
            keys.forEach((key, index) => {
                if (index === keys.length - 1) { // If we are at the last key, update its value
                    currentLevel[key] = value;
                } else {
                    currentLevel[key] = { ...currentLevel[key] }; // Create a new object at each level
                    currentLevel = currentLevel[key]; // Move to the next level for further changes
                }
            });

            return updatedData; // Return the updated form data
        });
    };

    // Handle the form submission for updating user preferences
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)

        setUpdateUserError(null); // Reset any previous errors
        setUpdateUserSuccess(null); // Reset previous success messages

        // Check if there are any changes in the form data by comparing it with initialData
        const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData); // Deep comparison to detect changes
        if (isUnchanged) {
            setUpdateUserError('No changes made'); // If no changes, show an error message
            return; // Exit the function early to avoid making unnecessary API calls
        }

        try {
            dispatch(updateStart()); // Dispatch start action to update the state (e.g., setting loading state)
            setLoading(true); // Set loading state to true while awaiting the response

            // Making an API call to update user data
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT', // PUT request to update the user's preferences
                headers: {
                    'Content-Type': 'application/json', // Specify that we're sending JSON data
                },
                body: JSON.stringify(formData), // Send the updated form data as the request body
            });

            const data = await res.json(); // Parse the response data

            // Check if the response was not ok (i.e., error occurred)
            if (!res.ok) {
                dispatch(updateFailure(data.message)); // Dispatch failure action with error message
                setUpdateUserError(data.message); // Set error state to display error message
                console.log(data); // Log error for debugging
                setLoading(false); // Stop loading
            } else {
                // On success, dispatch success action with the returned data
                dispatch(updateSuccess(data)); 
                setUpdateUserSuccess("Update successful"); // Set success message
                setLoading(false); // Stop loading

                // Redirect to the profile page after 3 seconds (to allow the user to see the success message)
                setTimeout(() => {
                    navigate('/profile?tab=details');
                }, 3000);
            }
        } catch (error) {
            dispatch(updateFailure(error.message)); // Dispatch failure action if API call fails
            setUpdateUserError(error.message); // Set error state to display error message
        }
    };

    // useEffect to handle clearing success/error messages after 3 seconds
    useEffect(() => {
        if (updateUserSuccess || updateUserError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null); // Reset success message
                setUpdateUserError(null); // Reset error message
            }, 3000); // Delay before clearing messages

            // Cleanup timer on component unmount or state change
            return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError]); // Run the effect when success or error messages change

  return (
    <motion.div
        // Initial motion properties for fading in the component
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            duration: .5, // The duration of the fade effect
            ease: "easeInOut" // Ease for smooth transition
        }}
    >
        {/* Wrapper div with fixed positioning and a full-screen white background */}
        <div className='fixed inset-0 bg-white z-[10000] flex justify-center items-center'>
            <form 
                className='flex flex-col gap-3 w-[28rem] max-w-[90%]' // Centered form with responsive width
                onSubmit={handleSubmit} // On form submit, the handleSubmit function is called
            >
                {/* Close button with an X icon */}
                <div 
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate('/profile?tab=details') // Navigate back to the profile details tab
                    }}
                >
                    <X /> {/* Close icon */}
                </div>
                
                {/* Title */}
                <h1 className='font-medium text-xl'>Preferences</h1>
                
                {/* Description text */}
                <p className='text-sm'>
                    Kindly set your preferences, to allow us get the best flights and hotels for you.
                </p>

                {/* Country selection dropdown */}
                <div className='relative w-full'>
                    {/* Chevron icon indicating dropdown */}
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    
                    {/* Country label */}
                    <label 
                        htmlFor="preference.country"
                        className='text-[0.7rem] absolute top-1.5 left-3'
                    >
                        Country
                    </label>

                    {/* Country dropdown */}
                    <select 
                        id="preference.country"
                        value={formData.preference?.country || ''} // Bind the dropdown value to the state
                        onChange={handleChange} // Update state when a new country is selected
                        className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        {/* Map through the countries and display each as an option */}
                        {countries.map((country, index) => (
                            <option 
                                key={index} 
                                value={country.name} // Value of the option is the country name
                            >
                                {country.name} {/* Display country name */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Seat preference dropdown */}
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
                        value={formData.preference?.seatPreference || ''} // Bind the dropdown value to the state
                        onChange={handleChange} // Update state when a new seat preference is selected
                        className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="No preference">No preference</option>
                        <option value="Window">Window</option>
                        <option value="Aisle">Aisle</option>
                    </select>
                </div>

                {/* Special assistance dropdown */}
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
                        value={formData.preference?.specialAssisstance || ''} // Bind the dropdown value to the state
                        onChange={handleChange} // Update state when a new special assistance option is selected
                        className='w-full shadow shadow-gray-400 pt-6 pb-3 px-3 pr-5 bg-transparent rounded-md text-black appearance-none text-base cursor-pointer'
                    >
                        {/* Various options for special assistance */}
                        <option value="None">None</option>
                        <option value="Blind">Blind</option>
                        <option value="Blind With Dog">Blind With Dog</option>
                        <option value="Deaf">Deaf</option>
                        <option value="Deaf With Dog">Deaf With Dog</option>
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
                                color="#fff" // Loading spinner color
                                loading={loading} 
                                size={7} // Size of the loader
                                margin={2} // Margin between circles in the loader
                            />
                            : 'Save' // Button text when not loading
                        }
                    </p>
                </button>

                {/* Success message */}
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

                    {/* Error message */}
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
    </motion.div>
  )
}

export default Preferences