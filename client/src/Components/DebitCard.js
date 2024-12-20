import { ChevronDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { countries } from '../Data/Locations';
import { useSelector } from 'react-redux';

const DebitCard = ({ onDataChange, onValidationError }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [saveCard, setSaveCard] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        paymentCard: { cardName: '', cardNumber: '', expirationDate: '', securityCode: '' },
        location: { address: '', city: '', zip: '', state: '', region: '' },
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                    paymentCard: {
                    cardName: currentUser.paymentCard?.cardName || '',
                    cardNumber: currentUser.paymentCard?.cardNumber || '',
                    expirationDate: currentUser.paymentCard?.expirationDate || '',
                    securityCode: currentUser.paymentCard?.securityCode || '',
                },
                    location: {
                    address: currentUser.location?.address || '',
                    city: currentUser.location?.city || '',
                    zip: currentUser.location?.zip || '',
                    state: currentUser.location?.state || '',
                    region: currentUser.location?.region || '',
                },
            });
        }
    }, [currentUser]);
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => {
            const keys = id.split('.');
            let updatedData = { ...prev };
            let currentLevel = updatedData;
            keys.forEach((key, idx) => {
                if (idx === keys.length - 1) {
                    currentLevel[key] = value;
                } else {
                    currentLevel[key] = { ...currentLevel[key] };
                    currentLevel = currentLevel[key];
                }
            });
            onDataChange(updatedData);
            return updatedData;
        });
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'cardName':
                return value.trim() ? '' : 'Card name cannot be empty.';
            case 'cardNumber':
                return value.replace(/\s/g, '').length === 16 ? '' : 'Card number must be 16 digits.';
            case 'expirationDate': {
                const [month, year] = value.split('/');
                const currentDate = new Date();
                const expirationDate = new Date(`${year}-${month}-01`);
                return month && year && expirationDate > currentDate ? '' : 'Expiration date must be in the future.';
            }
            case 'securityCode':
                return /^\d{3,4}$/.test(value) ? '' : 'Security code must be 3 or 4 digits.';
            default:
                return '';
        }
    };
    
    const validateFields = () => {
        const newErrors = {};
        Object.entries(formData.paymentCard).forEach(([field, value]) => {
            const error = validateField(field, value);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleValidation = (e) => {
        const { id, value } = e.target;
        const field = id.split('.').pop();
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));

        if (error) {
            // Clear the error after 3 seconds
            setTimeout(() => {
                setErrors((prev) => {
                    const { [field]: _, ...rest } = prev;
                    return rest;
                });
            }, 3000);
        }
    };
    
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        handleChange({ target: { id: 'paymentCard.cardNumber', value } });
    };
    
    const handleDateChange = (value, index) => {
        setFormData((prev) => {
            const parts = prev.paymentCard?.expirationDate?.split('/') || ['', ''];
            parts[index] = value.replace(/\D/g, '');
            const updatedData = {
                ...prev,
                paymentCard: { ...prev.paymentCard, expirationDate: parts.join('/') },
            };
            onDataChange(updatedData);
            return updatedData;
        });
    };

    const handleCheckboxChange = () => {
        setSaveCard(!saveCard);
    }

    useEffect(() => {
        const isValid = validateFields();
        onValidationError(!isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, onValidationError]);

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
                    id='paymentCard.cardName'
                    value={formData.paymentCard?.cardName}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidation(e);
                    }}
                    autoComplete='off'
                    placeholder='Card name'
                    className='border-b-2 border-[#48aadf] rounded-md bg-white p-3'
                />
                {errors.cardName && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.cardName}
                    </p>
                }
            </div>
            <div className='flex flex-col gap-1 w-fit'>
                <h2 className='font-semibold text-sm'>Debit/Credit card number</h2>
                <input 
                    type="text" 
                    id='paymentCard.cardNumber'
                    value={formData.paymentCard?.cardNumber}
                    onChange={(e) => {
                        handleCardNumberChange(e);
                        handleValidation(e);
                    }}
                    maxLength={19} // 16 digits + 3 spaces
                    autoComplete='off'
                    placeholder='0000 0000 0000 0000'
                    className='border-b-2 border-[#48aadf] rounded-md bg-white px-3 p-3'
                />
                {errors.cardNumber && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.cardNumber}
                    </p>
                }
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Expiration date</h2>
                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        id='paymentCard.expirationDate.month'
                        autoComplete='off'
                        placeholder="MM"
                        maxLength={2}
                        value={formData.paymentCard?.expirationDate === 'Not provided' 
                            ? '' 
                            : formData.paymentCard?.expirationDate?.split('/')[0] || ''
                        }
                        onChange={(e) => {
                            handleDateChange(e.target.value, 0);
                            handleValidation({ target: { id: 'paymentCard.expirationDate', value: `${e.target.value}/${formData.paymentCard?.expirationDate?.split('/')[1] || ''}` } });
                        }}
                        className="rounded-md p-3 w-20 border-b-2 border-[#48aadf] inset-0"
                    />
                    <input 
                        type="number" 
                        autoComplete='off'
                        placeholder="YYYY"
                        maxLength={4}
                        value={formData.paymentCard?.expirationDate?.split('/')[1] || ''}
                        onChange={(e) => {
                            handleDateChange(e.target.value, 1);
                            handleValidation({ target: { id: 'paymentCard.expirationDate', value: `${formData.paymentCard?.expirationDate?.split('/')[0] || ''}/${e.target.value}` } });
                        }}
                        className="rounded-md p-3 w-20 border-b-2 border-[#48aadf] inset-0"
                    />
                </div>
                {errors.expirationDate && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.expirationDate}
                    </p>
                }
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='text-sm font-semibold'>Security code</h2>
                <input 
                    type="text" 
                    id='paymentCard.securityCode'
                    autoComplete='off'
                    value={formData.paymentCard?.securityCode}
                    onChange={(e) => {
                        handleChange(e)
                        handleValidation(e)
                    }}
                    className='p-3 bg-white border-b-2 border-[#48aadf] rounded-md w-fit'
                />
                {errors.securityCode && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.securityCode}
                    </p>
                }
            </div>
        </div>
        <div className='flex flex-col gap-4 py-5 border-t-2 border-white'>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Country/Territory</h2>
                <div className='relative w-fit'>
                    <ChevronDown className='absolute right-3 p-1 top-1/2 transform -translate-y-1/2 pointer-events-none'/>
                    <select 
                        id="location.region"
                        value={formData.location?.region || ''}
                        onChange={handleChange}
                        className='bg-white border-b-2 border-[#48aadf] rounded-md py-3 px-3 sm:w-72 w-52 text-black appearance-none text-base cursor-pointer'
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
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Home address</h2>
                <input 
                    type="text" 
                    id='location.address'
                    value={formData.location?.address || ''}
                    onChange={handleChange}
                    autoComplete='off'
                    placeholder='Address'
                    className='p-3 rounded-md border-b-2 border-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>City</h2>
                <input 
                    type="text" 
                    id='location.city'
                    value={formData.location?.city || ''}
                    onChange={handleChange}
                    autoComplete='off'
                    placeholder='City'
                    className='p-3 rounded-md border-b-2 border-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>State</h2>
                <input 
                    type="text" 
                    id='location.state'
                    value={formData.location?.state || ''}
                    onChange={handleChange}
                    autoComplete='off'
                    placeholder='State'
                    className='p-3 rounded-md border-b-2 border-[#48aadf] bg-white w-fit'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>ZIP code</h2>
                <input 
                    type="text" 
                    id='location.zip'
                    value={formData.location?.zip || ''}
                    onChange={handleChange}
                    autoComplete='off'
                    placeholder='ZIP'
                    className='p-3 rounded-md border-b-2 border-[#48aadf] bg-white w-fit'
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
                                ${saveCard 
                                    ? 'opacity-100' 
                                    : 'opacity-0'
                                }`
                            }
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M5 13l4 4L19 7" 
                            />
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