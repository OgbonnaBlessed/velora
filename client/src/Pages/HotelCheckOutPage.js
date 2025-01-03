import { CheckCheck, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DebitCard from "../Components/DebitCard";
import ClickToPay from "../Components/ClickToPay";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { listItems, subListItems } from "../Data/ListItems";
import { countries } from '../Data/Locations'
import { SyncLoader } from 'react-spinners';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const HotelCheckOutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [receiveSMS, setRecieveSMS] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [visible, setVisible] = useState('debit-card');
  const [validationError, setValidationError] = useState(false);
  const indicatorRef = useRef(null);
  const tabContainerRef = useRef(null);
  const { hotelDetails, total } = location.state;
  console.log(hotelDetails);

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
      setFormData(userData);
    }
  }, [currentUser]);

  const handleDebitCardChange = (updatedData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleValidateError = (hasError) => {
    setValidationError(hasError);
  }

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

  const handleNumberChange = (e) => {
    const { value } = e.target;
  
    // Allow only digits or an empty field
    const isValid = /^\d*$/.test(value);
    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        number: value,
      }));
    }
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

  const handleCheckboxChange = () => {
    setRecieveSMS(!receiveSMS);
  }

  const OpenTab = (tabname) => {
    setVisible(tabname);
  }

  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll('p');
    const activeTab = Array.from(tabs).find(
      (tab) => tab.textContent.toLowerCase().replace(/\s+/g, '-') === visible
    );

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);

  // Helper to format time
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  }).format(new Date(date));

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const formatWord = (word) => {
    return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (!formData.firstName || !formData.lastName) {
      setUpdateUserError('Please fill in all required fields.');
      return;
    }

    // Validate phone number specifically
    if (!/^\d{10,15}$/.test(formData.number)) {
      setUpdateUserError('Please enter a valid phone number.');
      return;
    }

    // Validate DOB
    const [month, day, year] = formData.DOB?.split('/') || [];
    if (!isValidDOB(month, day, year)) {
      setUpdateUserError('Please provide a valid Date of Birth.');
      return;
    }

    if (validationError) {
      setUpdateUserError('Please fix the highlighted errors before submitting.');
      return;
    }

    try {
      dispatch(updateStart());
      setLoading(true);

      const res = await fetch(`/api/user/book/${currentUser._id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, hotelDetails }), // Sending both formData and flight
      });
            
      const data = await res.json();
            
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        console.log(data.message);
        setLoading(false);
  
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Update successful");
        setLoading(false);

        setTimeout(() => {
          navigate('/booking-completed');
        }, 3000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      console.log(error);
    }
  }

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

  useEffect(() => {
    if (location.state === null) {
      navigate('/hotel-search');
    }
  }, [location.state, navigate]);

  return (
    <div className="flex flex-col-reverse lg:flex-row bg-white rounded-lg overflow-hidden items-start gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10">

      {/* Left Section - Checkout Form */}
      <form 
        onSubmit={handleSubmit}
        className="w-full flex-1 flex flex-col gap-5 lg:w-2/3 relative">
        <div className="w-full flex-1 p-6 bg-blue-100 shadow shadow-[#48aadf] rounded-3xl flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="sm:text-2xl text-xl font-semibold">Who's traveling?</h2>
            <p className="text-sm">Traveler names must match government-issued photo ID exactly.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center ">
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
              <div className="flex flex-col lg:flex-row gap-5 fl">
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-sm">Country/Territory Code</h2>
                  <div className='relative w-fit'>
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
                  <div 
                    className={`relative w-4 h-4 flex items-center justify-center flex-wrap rounded border-2 transition-all duration-300
                      ${receiveSMS 
                        ? 'border-[#4078bc] bg-[#4078bc]' 
                        : 'border-gray-400'
                      }`
                    }
                  >
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
              <h2 className="font-medium text-sm">
                Passport
              </h2>
              <div className='relative w-fit'>
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

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium">
                Date of Birth
              </h2>
              <div className="flex items-center gap-4">
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
                <div
                  className='relative flex items-center text-[0.915rem] text-nowrap w-fit text-sm font-semibold text-[#000000e3] font-Grotesk'
                  ref={tabContainerRef}
                >
                  <p
                    className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
                    onClick={() => OpenTab('debit-card')}
                  >
                    Debit card
                  </p>
                  <p
                    className="py-2 px-4 cursor-pointer transition-all duration-500 ease-in-out"
                    onClick={() => OpenTab('click-to-pay')}
                  >
                    Click to pay
                  </p>

                  {/* Underline Indicator */}
                  <div
                    ref={indicatorRef}
                    className="absolute bottom-0 h-[2px] bg-white shadow shadow-gray-300 rounded-full transition-all duration-300 ease-in-out"
                  />
                </div>

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
        <div className="bg-blue-100 shadow shadow-[#48aadf] rounded-3xl p-6 flex flex-col gap-4 relative">
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold sm:text-2xl text-xl">Review and book your Trip</h1>
            <div className="flex sm:items-center items-start gap-2">
              <CheckCheck className="rounded-full bg-white p-1 text-gray-500"/>
              <p className="text-sm">Free cancellation within 24 hours of booking!</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <ol className="flex flex-col gap-2 text-sm">
              {listItems.map((item, index) => (
                <>
                  <li key={index} className="flex gap-2">
                    <span>{index + 1}.</span> {item}
                  </li>
                  {index === 2 &&
                    <ul className="list-disc -mt-1 ml-10">
                      {subListItems.map((subItem, i) => (
                        <li key={i}>
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  }
                </>
              ))}
            </ol>
            <p className="text-sm">
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
              className={`w-52 max-w-full py-3 text-white font-semibold outline-none mt-5 self-center text-sm rounded-full shrink-button 
                  transition-all duration-300 ease-in-out
                ${loading 
                  ? 'bg-[#48aadf96] cursor-not-allowed' 
                  : 'bg-[#48aadf] cursor-pointer'
                }`
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
                  : 'Complete Booking'
                }
              </p>
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
            {updateUserError}
          </p>
        </div>
      </form>

      {/* Right Section - Price Summary */}
      <div className="w-full bg-blue-100 shadow shadow-[#48aadf] p-5 rounded-3xl flex flex-col lg:w-1/3">
        <div className="py-3 border-b-2 border-white">
          <p className="font-medium">
            {hotelDetails?.data[0]?.hotel?.name} • {hotelDetails?.data[0]?.hotel?.cityCode}
          </p>
          <p className="text-sm">
            {formatDate(hotelDetails?.data[0].offers[0]?.checkInDate)} | {formatDate(hotelDetails?.data[0].offers[0]?.checkOutDate)}
          </p>
          <p className="text-sm">
            Arrives at {formatTime(hotelDetails?.data[0].offers[0]?.policies?.cancellations[0]?.deadline)}
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-3">
          <div>
            <p className="font-semibold">Your Price Summary</p>
            <span className='font-semibold'>Guests: </span> {hotelDetails?.data[0].offers[0]?.guests?.adults} {hotelDetails?.data[0].offers[0]?.guests?.adults > 1 ? 'Adults' : 'Adult'}
          </div>
          <p className="text-xl font-semibold">{total.toFixed(2)} {hotelDetails?.data[0].offers[0]?.price?.currency}</p>
        </div>
      </div>
    </div>
  );
};

export default HotelCheckOutPage;