/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCheck, ChevronDown, Loader2 } from "lucide-react"; // Importing icons from lucide-react library
import React, { useEffect, useRef, useState } from "react"; // Importing hooks and components from React
import DebitCard from "../Components/DebitCard"; // Importing DebitCard component
import ClickToPay from "../Components/ClickToPay"; // Importing ClickToPay component
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importing routing hooks from react-router-dom
import { useDispatch, useSelector } from 'react-redux'; // Importing Redux hooks for state management
import { listItems, subListItems } from "../Data/ListItems"; // Importing data for list items
import { countries } from '../Data/Locations' // Importing country data
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'; // Redux actions for user updates
import { motion } from "framer-motion"; // Importing motion for animation from framer-motion library
import { BounceLoader } from "react-spinners";

const CarCheckOutPage = () => {
  // React router hooks to access location and navigation properties
  const location = useLocation();
  const navigate = useNavigate();

  // Redux hooks to access the dispatch function and user state
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  
  // State variables to manage form data, loading state, errors, etc.
  const [receiveSMS, setRecieveSMS] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [visible, setVisible] = useState('debit-card');
  const [validationError, setValidationError] = useState(false);

  // References to DOM elements for tabs
  const indicatorRef = useRef(null);
  const tabContainerRef = useRef(null);

  const car = location?.state?.car
  const total = location?.state?.total

  // Side effect to populate the formData state with currentUser's data
  useEffect(() => {
    if (currentUser) {
      const userData = {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          middleName: currentUser.middleName || '',
          number: currentUser.number || '',
          countryCode: currentUser.countryCode || '',
          DOB: currentUser.DOB || '',
          travelDocument: {
          country: currentUser.travelDocument?.country || '',
        },
      };
      setFormData(userData); // Update form data state
    }
  }, [currentUser]); // Re-run the effect when currentUser changes

  // Function to handle changes in the debit card form
  const handleDebitCardChange = (updatedData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedData, // Update formData with the new debit card data
    }));
  };

  // Function to handle validation error changes
  const handleValidateError = (hasError) => {
    setValidationError(hasError);
  }

  // Generic handler for form input changes (handles nested objects like formData.location.city)
  const handleChange = (e) => {
    const { id, value } = e.target;
      
    // Split nested keys (e.g., "location.city") into an array
    setFormData((prev) => {
    const keys = id.split('.'); // Split nested keys
    let updatedData = { ...prev }; // Make a copy of formData

    let currentLevel = updatedData;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentLevel[key] = value; // Set the final value for the nested key
      } else {
        currentLevel[key] = { ...currentLevel[key] }; // Create new object for each nested level
        currentLevel = currentLevel[key];
      }
    });

    return updatedData;
    });
  };

  // Handler for phone number input to only allow digits
  const handleNumberChange = (e) => {
    const { value } = e.target;
  
    // Check if the input is a valid phone number (only digits)
    const isValid = /^\d*$/.test(value);
    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        number: value, // Update the phone number in formData
      }));
    }
  };

  // Function to validate the date of birth
  const isValidDOB = (month, day, year) => {
    if (!month || !day || !year) return false;

    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    // Validate month, day, year ranges
    if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear() - 16) {
      return false;
    }

    // Check for valid date
    const date = new Date(y, m - 1, d); // JS months are 0-indexed
    return date.getMonth() + 1 === m && date.getDate() === d && date.getFullYear() === y;
  };

  // Handle checkbox change for receiving SMS
  const handleCheckboxChange = () => {
    setRecieveSMS(!receiveSMS); // Toggle receiveSMS state
  }

  // Function to handle tab switching
  const OpenTab = (tabName) => {
    setVisible(tabName);
  };

  // Function to update the underline indicator position
  const updateIndicator = () => {
    const tabs = tabContainerRef.current?.querySelectorAll("p");
    if (!tabs) return; // Exit if tabs are undefined

    // Find the active tab based on visible state
    const activeTab = Array.from(tabs).find(
      (tab) => tab.textContent.toLowerCase().replace(/\s+/g, "-") === visible
    );

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`; // Set indicator width
      indicatorRef.current.style.left = `${offsetLeft}px`; // Set indicator position
    }
  };

  // Side effect to update indicator on visible state change
  useEffect(() => {
    updateIndicator();
  }, [visible]);

  // Run once on component mount
  useEffect(() => {
    // Update on initial mount
    updateIndicator();

    // Create a ResizeObserver to watch for changes
    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    if (tabContainerRef.current) {
      observer.observe(tabContainerRef.current);
    }

    // Cleanup the observer
    return () => observer.disconnect();
  }, []);

  // Helper function to calculate car duration in minutes
  const getCarDuration = (car) => {
    const startTime = new Date(car?.start?.dateTime).getTime();
    const endTime = new Date(car?.end?.dateTime).getTime();
    
    if (isNaN(startTime) || isNaN(endTime)) {
      console.error("Invalid start or end time");
      return null;
    }
    
    return (endTime - startTime) / (1000 * 60); // Duration in minutes
  };

  // Helper function to calculate arrival date from start time and duration
  const getArrivalDate = (car) => {
    const startTime = new Date(car?.start?.dateTime).getTime();
    const durationInMinutes = getCarDuration(car);
    
    if (startTime && durationInMinutes !== null) {
      const arrivalTime = startTime + (durationInMinutes * 60 * 1000);
      return new Date(arrivalTime);
    }
    
    return null;
  };

  // Usage
  const arrivalDate = getArrivalDate(car);

  // Helper function to format time as 'hour:minute AM/PM'
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  }).format(new Date(date));

  // Helper function to format date as 'Month Day, Year'
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  // Handle form submission for booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      setUpdateUserError('Please fill in all required fields.');
      return;
    }

    // Validate phone number format
    if (!/^\d{10,15}$/.test(formData.number)) {
      setUpdateUserError('Please enter a valid phone number.');
      return;
    }

    // Validate date of birth format
    const [month, day, year] = formData.DOB?.split('/') || [];
    if (!isValidDOB(month, day, year)) {
      setUpdateUserError('Please provide a valid Date of Birth.');
      return;
    }

    // If validation errors exist, stop submission
    if (validationError) {
      setUpdateUserError('Please fix the highlighted errors before submitting.');
      return;
    }

    try {
      dispatch(updateStart());
      setLoading(true);

      // Send form data and flight data to backend for booking
      const res = await fetch(`/api/user/book-car/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, car, total }),
      });
              
      const data = await res.json();
              
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        setLoading(false);
  
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Update successful");
        
        // Redirect to booking confirmation page
        setTimeout(() => {
          setTimeout(() => {
            navigate('/booking-completed', { state: { fromCheckout: true } });
          }, 1000);

          setLoading(false);
        }, 5000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  // Auto-clear success and error messages after a delay
  useEffect(() => {
    if (updateUserSuccess || updateUserError) {
      const timer = setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
      }, 3000);
  
      return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }
  }, [updateUserSuccess, updateUserError]);

  useEffect(() => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 5000);
  }, []);

  if (pageLoading) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center'>
        <BounceLoader
          color="#48aadf"
          loading={pageLoading}
        />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: .5,
        ease: "easeInOut"
      }}
      className="flex flex-col-reverse lg:flex-row bg-white rounded-lg overflow-hidden items-start gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 font-Grotesk"
    >

      {/* Left Section - Checkout Form */}
      <form 
        onSubmit={handleSubmit}
        className="w-full flex-1 flex flex-col gap-5 lg:w-2/3 relative"
      >
        <div className="w-full flex-1 p-6 bg-blue-100 rounded-3xl flex flex-col gap-5">
          {/* Container for the whole form with padding, background color, shadow, and rounded corners */}

          <div className="flex flex-col gap-2">
            {/* Section for the title and description */}
            <h2 className="sm:text-2xl text-xl font-semibold">Who's traveling?</h2>
            {/* Heading for the form section */}
            <p className="text-sm">Traveler names must match government-issued photo ID exactly.</p>
            {/* Instructional text below the title */}
          </div>

          <div className="flex flex-col gap-4">
            {/* Container for the input fields for names and phone number */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center">
              {/* A responsive grid layout for First name, Middle name, and Last name */}

              {/* First name input */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-sm">First name</h2>
                <input 
                  type="text" 
                  placeholder="Ogbonna"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="rounded-md bg-white p-3 border-b-2 border-[#48aadf]"
                />
              </div>

              {/* Middle name input */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-sm">Middle name</h2>
                <input 
                  type="text" 
                  placeholder="Chibuike"
                  id="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="rounded-md bg-white p-3 border-b-2 border-[#48aadf]"
                />
              </div>

              {/* Last name input */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-sm">Last name</h2>
                <input 
                  type="text" 
                  placeholder="Blessed"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="rounded-md bg-white p-3 border-b-2 border-[#48aadf]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Container for Country code and Phone number inputs */}
              <div className="flex flex-col lg:flex-row gap-5 fl">
                {/* Country code input */}
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-sm">Country/Territory Code</h2>
                  <div className='relative w-fit'>
                    {/* Chevron Down Icon for the dropdown */}
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <select 
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={(e) => handleChange(e)}
                      className='bg-white border-b-2 border-[#48aadf] rounded-md py-3 px-3 bg-transparent w-52 sm:w-72 text-black appearance-none text-base cursor-pointer'
                    >
                      {countries.map((country, i) => (
                        <option 
                          key={i} 
                          value={country.phone_code}
                        >
                          {country.name} {country.phone_code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone number input */}
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-sm">Phone number</h2>
                  <input 
                    type="text" 
                    id="number"
                    placeholder="123456789"
                    value={formData.number !== 'Not provided' ? formData.number : ''}
                    onChange={(e) => handleNumberChange(e)}
                    autoComplete="off"
                    className="rounded-md bg-white p-3 border-b-2 border-[#48aadf]"
                  />
                </div>
              </div>

              {/* Checkbox for receiving SMS alerts */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="receiveSMS" 
                  checked={receiveSMS} 
                  onClick={handleCheckboxChange} 
                  onChange={handleChange}
                  className="hidden" // Hide the default checkbox
                />
                <label 
                  htmlFor="receiveSMS" 
                  className="flex items-center cursor-pointer"
                >
                  {/* Custom checkbox design */}
                  <div 
                    className={`relative w-4 h-4 flex items-center justify-center flex-wrap rounded border-2 transition-all duration-300
                      ${receiveSMS 
                        ? 'border-[#4078bc] bg-[#4078bc]' 
                        : 'border-gray-400'
                      }`
                    }
                  >
                    {/* Checkmark SVG when checkbox is checked */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                        ${receiveSMS 
                          ? 'opacity-100' 
                          : 'opacity-0'
                        }`
                      }
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-black text-sm">
                    Receive text alerts about this trip.       
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {/* Passport input */}
              <h2 className="font-medium text-sm">
                Passport
              </h2>
              <div className='relative w-fit'>
                {/* Chevron Down Icon for the dropdown */}
                <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                <select 
                  id="travelDocument.country"
                  value={formData.travelDocument?.country}
                  onChange={(e) => handleChange(e)}
                  className='bg-white border-b-2 border-[#48aadf] rounded-md py-3 px-3 bg-transparent sm:w-72 w-52 text-black appearance-none text-base cursor-pointer'
                >
                  {countries.map((country, i) => (
                    <option 
                      key={i} 
                      value={country.name}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date of Birth section */}
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium">
                Date of Birth
              </h2>
              <div className="flex items-center gap-4">
                {/* Month input */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Month</p>
                  <input 
                    type="number" 
                    id="DOB"
                    placeholder="MM"
                    value={formData.DOB === 'Not provided' ? '' : formData.DOB?.split('/')[0]}
                    maxLength={2} // Limit to 2 digits
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                      setFormData((prev) => ({
                        ...prev,
                        DOB: `${value}/${prev.DOB?.split('/')[1] || ''}/${prev.DOB?.split('/')[2] || ''}`,
                      }));
                    }}
                    className="rounded-md p-3 sm:w-20 w-16 border-b-2 border-[#48aadf] inset-0"
                  />
                </div>

                {/* Day input */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Day</p>
                  <input 
                    type="number" 
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
                    className="rounded-md p-3 sm:w-20 w-16 border-b-2 border-[#48aadf] inset-0"
                  />
                </div>

                {/* Year input */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Year</p>
                  <input 
                    type="number" 
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
                    className="rounded-md p-3 sm:w-20 w-16 border-b-2 border-[#48aadf] inset-0"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="flex flex-col gap-1 mt-5">
              <h2 className="font-semibold sm:text-xl text-lg">How would you like to pay?</h2>
              <div className="flex flex-col gap-2 relative">
                {/* Container for payment method options */}
                <div
                  className='relative flex items-center text-[0.915rem] text-nowrap w-fit text-sm font-semibold text-[#000000e3] font-Grotesk'
                  ref={tabContainerRef}
                >
                  {/* Debit card option */}
                  <p
                    className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
                    onClick={() => OpenTab('debit-card')}
                  >
                    Debit card
                  </p>
                  {/* Click to pay option */}
                  <p
                    className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
                    onClick={() => OpenTab('click-to-pay')}
                  >
                    Click to pay
                  </p>

                  {/* Underline Indicator */}
                  <div
                    ref={indicatorRef}
                    className="absolute bottom-0 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out"
                  />
                </div>

                {/* Conditional rendering for payment methods */}
                {visible === 'debit-card' && 
                  <DebitCard 
                    onDataChange={handleDebitCardChange} 
                    onValidationError={handleValidateError}
                  />
                }
                {visible === 'click-to-pay' && <ClickToPay/>}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-100 rounded-3xl p-6 flex flex-col gap-4 relative">
          {/* Wrapper div for the card-like component, styled with blue background, shadows, rounded corners, padding, and flexible layout */}
          
          <div className="flex flex-col gap-3">
            {/* Section displaying the header and cancellation information */}
            <h1 className="font-semibold sm:text-2xl text-xl">Review and book your Trip</h1>
            {/* Main heading for the section, styled with a medium font weight and responsive size */}
            
            <div className="flex sm:items-center items-start gap-2">
              {/* Container for the "Free cancellation" text and icon */}
              <CheckCheck className="rounded-full bg-white p-1 text-gray-500"/>
              {/* CheckCheck icon styled with a rounded border, white background, padding, and gray color */}
              <p className="text-sm">Free cancellation within 24 hours of booking!</p>
              {/* Text explaining the cancellation policy */}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Section containing the ordered list of trip details */}
            <ol className="flex flex-col gap-2 text-sm">
              {/* Ordered list of items (such as trip details) */}
              {listItems.map((item, index) => (
                <>
                  {/* Iterating over the listItems array and displaying each item */}
                  <li key={index} className="flex gap-2">
                    <span>{index + 1}.</span> {item}
                    {/* List item with numbering and the actual content */}
                  </li>
                  
                  {/* Check if it's the third item (index === 2) and show a sublist if true */}
                  {index === 2 &&
                    <ul className="list-disc -mt-1 ml-10">
                      {/* Sublist displayed under the third item */}
                      {subListItems.map((subItem, i) => (
                        <li key={i}>
                          {subItem}
                          {/* Iterating over the subListItems array to show each sub-item */}
                        </li>
                      ))}
                    </ul>
                  }
                </>
              ))}
            </ol>

            <p className="text-sm">
              {/* Text explaining the acknowledgment of privacy statements */}
              By clicking on the button below, I acknowledge that I have reviewed the {" "}
              <Link 
                to='/policy'
                className="text-[#48aadf]"
              >
                Privacy Statement
              </Link> and {" "}
              <Link 
                to='/user-data-deletion-policy'
                className="text-[#48aadf]"
              >
                User data policy
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-[#48aadf]/50 cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'} hover:bg-[#48aadf]/50 active:scale-90 rounded-lg py-3 w-80 max-w-full self-center mt-8 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 relative text-sm sm:text-base`}
            >
              {/* Button to complete booking, with dynamic styling based on loading state */}
              {loading ? (
                <>
                  <span>Completing booking...</span>
                  <Loader2 className="animate-spin w-6 h-6 text-white absolute right-3" />
                </>
              ) : (
                'Complete Booking'
              )}
            </button>
          </div>

          <p 
            className={`text-[0.7rem] absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-red-500 transform transition-all duration-700 ease-in-out 
              ${
                updateUserError 
                ? 'opacity-1 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-5 pointer-events-none'
              }`
            }
          >
            {/* Error message if there is an updateUserError */}
            {updateUserError}
            {/* Conditionally rendering the error message, showing or hiding it based on updateUserError */}
          </p>
        </div>
      </form>

      {/* Right Section - Price Summary */}
      <div className="w-full bg-blue-100 p-5 rounded-3xl flex flex-col lg:w-1/3">
        {/* This is the container for the Price Summary section, styled with blue background, shadow, padding, and rounded corners.
            On larger screens, the width is set to 1/3 using Tailwind's lg:w-1/3 class, and it takes up full width on smaller screens. */}

        <div className="py-3 border-b-2 border-white">
          {/* Header section for flight details, with top and bottom padding and a white border separating it from the rest of the content */}
          
          <p className="font-medium">
           {car?.start?.locationCode} to {car?.end?.address?.cityName}
          </p>
          
          <p className="text-sm">
            {formatDate(car?.start?.dateTime)} | {" "} 
            {`${formatTime(car?.start?.dateTime)} - ${formatTime(car?.end?.dateTime)}`}
          </p>
          
          <p className="text-sm">Arrives {formatDate(arrivalDate)}</p>
          {/* Displays the formatted arrival date of the flight */}
        </div>

        <div className="flex flex-col gap-2 pt-3">
          {/* Container for the price summary section, with flex column layout and some spacing between items */}
          
          <div>
            <p className="font-semibold">Your Price Summary</p>
            {/* Header text indicating that this section shows the price summary */}
            <p>
              Traveler {car?.vehicle?.seats?.map((seat) => (<>{seat.count}</>))}: {car?.vehicle?.seats?.map((seat) => (<>{seat.count > 1 ? 'Adults' : 'Adult'}</>))}
            </p>
            {/* Text indicating that this price is for the first adult traveler */}
          </div>

          <p className="text-xl font-semibold">${total.toFixed(2)}</p>
          {/* The total price is displayed here with a fixed number of decimal points, ensuring two decimals with .toFixed(2) */}
        </div>
      </div>
    </motion.div>
  );
};

export default CarCheckOutPage;