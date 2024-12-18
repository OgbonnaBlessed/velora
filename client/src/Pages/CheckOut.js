import { CheckCheck, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DebitCard from "../Components/DebitCard";
import ClickToPay from "../Components/ClickToPay";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [receiveSMS, setRecieveSMS] = useState(false);
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState('debit-card');
  const indicatorRef = useRef(null);
  const tabContainerRef = useRef(null);

  const handleCheckboxChange = () => {
    setRecieveSMS(!receiveSMS);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
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

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const listItems = [
    "Review your trip details to make sure the dates and times are correct.",
    "Check your spelling. Flight passenger names must match government-issued photo ID exactly.",
    "Review the terms of your booking:"
  ];  

  const subListItems = [
    "If you book a fare that allows changes, the airline may charge a change or cancel fee, plus any fare difference. Airlines set change and cancel policies and fee amounts. We may collect these change or cancel fees, which are then passed on to the airline.",
    "Tickets are refundable with a penalty fee of $200 for itinerary cancellations.",
    "Fares are not guaranteed until ticketed.",
    "A change fee of $50 per ticket is charged by the airline for all itinerary changes.",
    "Federal law forbids the carriage of hazardous materials aboard aircraft in your luggage or on your person.",
    "In case of a no-show or cancellation, you may be entitled to a refund of airport taxes and fees included in the price of the flight purchased. In this instance, you can request such a refund from us, and we will submit your request to the airline on your behalf."
  ]

  return (
    <div className="flex flex-col-reverse lg:flex-row bg-white rounded-lg overflow-hidden items-start gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10">
      {/* Left Section - Checkout Form */}
      <form 
        onSubmit={handleSubmit}
        className="w-full flex-1 flex flex-col gap-5 lg:w-2/3">
        <div className="w-full flex-1 p-6 bg-blue-50 rounded-xl flex flex-col gap-5">
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
                  className="rounded-md bg-white px-3 py-2 shadow shadow-[#48aadf]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-sm">Middle name</h2>
                <input 
                  type="text" 
                  placeholder="Chibuike"
                  className="rounded-md bg-white px-3 py-2 shadow shadow-[#48aadf]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-sm">Last name</h2>
                <input 
                  type="text" 
                  placeholder="Blessed"
                  className="rounded-md bg-white px-3 py-2 shadow shadow-[#48aadf]"
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
                      id="country-code"
                      className='bg-white shadow shadow-[#48aadf] rounded-md py-3 px-3 bg-transparent w-52 sm:w-72 text-black appearance-none text-base cursor-pointer'
                    >
                      <option value="+1" className="py-5">United states +1</option>
                      <option value="+44">United kingdom +44</option>
                      <option value="+234">Nigeria +234</option>
                      <option value="+380">Ukraine +380</option>
                      <option value="+256">Uganda +256</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-sm">Phone number</h2>
                  <input 
                    type="text" 
                    placeholder="9088776346"
                    className="rounded-md bg-white px-3 py-2 shadow shadow-[#48aadf]"
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
                  id="needs"
                  className='bg-white shadow shadow-[#48aadf] rounded-md py-3 px-3 bg-transparent sm:w-72 w-52 text-black appearance-none text-base cursor-pointer'
                >
                  <option value="Not provided">Not provided</option>
                  <option value="No, I don't have accessibility needs">No, I don't have accessibility needs</option>
                  <option value="Yes, I have accessibility needs">Yes, I have accessibility needs</option>
                  <option value="Rather not say">Rather not say</option>
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
                    placeholder="MM"
                    maxLength={2}
                    className="rounded-md px-3 py-2 sm:w-20 w-16 shadow-sm shadow-[#48aadf] inset-0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Day</p>
                  <input 
                    type="number" 
                    placeholder="DD"
                    maxLength={2}
                    className="rounded-md px-3 py-2 sm:w-20 w-16 shadow-sm shadow-[#48aadf] inset-0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Year</p>
                  <input 
                    type="number" 
                    placeholder="YYYY"
                    maxLength={4}
                    className="rounded-md px-3 py-2 sm:w-20 w-16 shadow-sm shadow-[#48aadf] inset-0"
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

                {visible === 'debit-card' && <DebitCard/>}
                {visible === 'click-to-pay' && <ClickToPay/>}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col gap-4">
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
              className="bg-[#48aadf] w-fit self-center rounded-md text-white font-semibold py-3 px-8 cursor-pointer mt-5"
            >
              Complete Booking
            </button>
          </div>
        </div>
      </form>

      {/* Right Section - Price Summary */}
      <div className="w-full bg-blue-50 p-5 rounded-xl flex flex-col lg:w-1/3">
        <h3 className="text-xl font-semibold">Roundtrip Flight</h3>
        <div className="py-3 border-b-2 border-white">
          <p className="font-medium">Algiers (ALG) to Lagos (LOS)</p>
          <p className="text-sm">Dec 30, 2024 | 4:45pm - 12:25pm</p>
          <p className="text-sm">Arrives Dec 31, 2024</p>
        </div>
        <div className="flex flex-col gap-2 pt-3">
          <div>
            <p className="font-semibold">Your Price Summary</p>
            <p>Traveler 1: Adult</p>
          </div>
          <p className="text-xl font-semibold">$1,763.30</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;