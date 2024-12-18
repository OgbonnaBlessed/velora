import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

const DebitCard = () => {
    const [saveCard, setSaveCard] = useState(false);
    const [formData, setFormData] = useState({});

    const handleCheckboxChange = () => {
        setSaveCard(!saveCard);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

  return (
    <div className='flex flex-col'>
        <div className="flex gap-4 items-center">
            <img
                src={`${process.env.PUBLIC_URL}/images/master-card.png`}
                alt="Mastercard"
                className="w-12"
            />
            <img
                src="https://img.icons8.com/color/48/000000/visa.png"
                alt="Visa"
                className="h-12 w-12"
            />
            <img
                src={`${process.env.PUBLIC_URL}/images/verve.svg`}
                alt="Verve"
                className="w-16"
            />
        </div>
        <div className='flex flex-col gap-4 py-5'>
            <div className='flex flex-col gap-1 w-fit'>
                <h2 className='font-semibold text-sm'>Name on card</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    placeholder='Ogbonna Blessed'
                    className='shadow shadow-[#48aadf] rounded bg-white px-3 py-2'
                />
            </div>
            <div className='flex flex-col gap-1 w-fit'>
                <h2 className='font-semibold text-sm'>Debit/Credit card number</h2>
                <input 
                    type="number" 
                    autoComplete='off'
                    placeholder='0000 0000 0000 0000'
                    className='shadow shadow-[#48aadf] rounded bg-white px-3 py-2'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Expiration date</h2>
                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        autoComplete='off'
                        placeholder="MM"
                        maxLength={2}
                        className="rounded-md px-3 py-2 w-20 shadow-sm shadow-[#48aadf] inset-0"
                    />
                    <input 
                        type="number" 
                        autoComplete='off'
                        placeholder="YYYY"
                        maxLength={4}
                        className="rounded-md px-3 py-2 w-20 shadow-sm shadow-[#48aadf] inset-0"
                    />
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='text-sm font-semibold'>Security code</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    className='px-3 py-2 bg-white shadow shadow-[#48aadf] rounded w-fit'
                />
            </div>
        </div>
        <div className='flex flex-col gap-4 py-5 border-t-2 border-white'>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Country/Territory</h2>
                <div className='relative w-fit'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <select 
                        id="country"
                        className='bg-white shadow shadow-[#48aadf] rounded-md py-3 px-3 sm:w-72 w-52 text-black appearance-none text-base cursor-pointer'
                    >
                        <option value="United states">United states</option>
                        <option value="United kingdom">United kingdom</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="Uganda">Uganda</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Home address</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    placeholder='Address'
                    className='px-3 py-2 rounded shadow shadow-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>City</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    placeholder='City'
                    className='px-3 py-2 rounded shadow shadow-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>State</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    placeholder='State'
                    className='px-3 py-2 rounded shadow shadow-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>ZIP code</h2>
                <input 
                    type="text" 
                    autoComplete='off'
                    placeholder='ZIP'
                    className='px-3 py-2 rounded shadow shadow-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="saveCard" 
                    checked={saveCard} 
                    onClick={handleCheckboxChange} 
                    onChange={handleChange}
                    className="hidden" // Hide the default checkbox
                />
                <label 
                    htmlFor="saveCard" 
                    className="flex items-center cursor-pointer"
                >
                    <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2  transition-all duration-300
                            ${saveCard 
                                ? 'border-[#4078bc] bg-[#4078bc]' 
                                : 'border-gray-400'
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute w-3.5 h-3.5 text-white transition-opacity duration-300 
                            ${saveCard ? 'opacity-100' : 'opacity-0'}`
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
                        Remember card for future use.       
                    </span>
                </label>
            </div>
        </div>
    </div>
  )
}

export default DebitCard
