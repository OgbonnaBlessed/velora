import { ChevronDown } from 'lucide-react' // Importing the ChevronDown icon from the 'lucide-react' library.
import React, { useEffect, useState } from 'react' // Importing React and necessary hooks.
import { countries } from '../Data/Locations'; // Importing country data.
import { useSelector } from 'react-redux'; // Importing the useSelector hook from Redux for state management.

const DebitCard = ({ onDataChange, onValidationError }) => {
    // Accessing the currentUser data from the Redux state.
    const { currentUser } = useSelector((state) => state.user);
    
    // State to track whether the "Save Card" checkbox is checked.
    const [saveCard, setSaveCard] = useState(false);
    
    // State to store form validation errors.
    const [errors, setErrors] = useState({});
    
    // State to store form data for the debit card and address fields.
    const [formData, setFormData] = useState({
        paymentCard: { cardName: '', cardNumber: '', expirationDate: '', securityCode: '' },
        location: { address: '', city: '', zip: '', state: '', region: '' },
    });

    // Effect to populate form fields with current user data when available.
    useEffect(() => {
        if (currentUser) {
            setFormData({
                paymentCard: {
                    cardName: currentUser.paymentCard?.cardName || '', // Default to an empty string if data is unavailable.
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
    }, [currentUser]); // Dependency ensures this effect runs only when currentUser changes.

    // Function to handle form data updates when inputs change.
    const handleChange = (e) => {
        const { id, value } = e.target; // Extract the input's ID and value.
        setFormData((prev) => {
            const keys = id.split('.'); // Split ID to access nested fields (e.g., 'paymentCard.cardName').
            let updatedData = { ...prev }; // Create a copy of the previous state.
            let currentLevel = updatedData;

            // Traverse through the object hierarchy to update the nested field.
            keys.forEach((key, idx) => {
                if (idx === keys.length - 1) {
                    currentLevel[key] = value; // Update the final field with the new value.
                } else {
                    currentLevel[key] = { ...currentLevel[key] };
                    currentLevel = currentLevel[key]; // Move deeper into the object.
                }
            });

            onDataChange(updatedData); // Notify parent component about data changes.
            return updatedData; // Update the formData state.
        });
    };

    // Function to validate individual fields based on their type.
    const validateField = (field, value) => {
        switch (field) {
            case 'cardName':
                return value.trim() ? '' : 'Card name cannot be empty.'; // Ensure the card name is not empty.
            case 'cardNumber':
                return value.replace(/\s/g, '').length === 16 ? '' : 'Card number must be 16 digits.'; // Check card number length.
            case 'expirationDate': {
                const [month, year] = value.split('/'); // Split expiration date into month and year.
                const currentDate = new Date();
                const expirationDate = new Date(`${year}-${month}-01`);
                return month && year && expirationDate > currentDate ? '' : 'Expiration date must be in the future.';
            }
            case 'securityCode':
                return /^\d{3,4}$/.test(value) ? '' : 'Security code must be 3 or 4 digits.'; // Check security code format.
            default:
                return '';
        }
    };

    // Function to validate all fields in the form.
    const validateFields = () => {
        const newErrors = {}; // Object to store validation errors.
        Object.entries(formData.paymentCard).forEach(([field, value]) => {
            const error = validateField(field, value); // Validate each field.
            if (error) newErrors[field] = error; // Add errors to the object if present.
        });
        setErrors(newErrors); // Update the state with validation errors.
        return Object.keys(newErrors).length === 0; // Return true if no errors are found.
    };

    // Function to handle validation for individual inputs in real time.
    const handleValidation = (e) => {
        const { id, value } = e.target; // Extract the input's ID and value.
        const field = id.split('.').pop(); // Get the field name from the ID.
        const error = validateField(field, value); // Validate the field.
        setErrors((prev) => ({ ...prev, [field]: error })); // Update the errors state.

        if (error) {
            // Clear the error message after 3 seconds.
            setTimeout(() => {
                setErrors((prev) => {
                    const { [field]: _, ...rest } = prev;
                    return rest; // Remove the error from the state.
                });
            }, 3000);
        }
    };

    // Function to handle formatting and updating the card number input.
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters.
        value = value.replace(/(.{4})/g, '$1 ').trim(); // Format as groups of 4 digits.
        handleChange({ target: { id: 'paymentCard.cardNumber', value } }); // Update the state.
    };

    // Function to handle updates to the expiration date input.
    const handleDateChange = (value, index) => {
        setFormData((prev) => {
            const parts = prev.paymentCard?.expirationDate?.split('/') || ['', '']; // Split the date into parts.
            parts[index] = value.replace(/\D/g, ''); // Update the specific part (month or year).
            const updatedData = {
                ...prev,
                paymentCard: { ...prev.paymentCard, expirationDate: parts.join('/') },
            };
            onDataChange(updatedData); // Notify the parent component.
            return updatedData; // Update the state.
        });
    };

    // Function to toggle the "Save Card" checkbox state.
    const handleCheckboxChange = () => {
        setSaveCard(!saveCard); // Toggle the state between true and false.
    };

    // Effect to validate fields whenever formData changes.
    useEffect(() => {
        const isValid = validateFields(); // Validate all fields.
        onValidationError(!isValid); // Notify the parent component if there are errors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, onValidationError]); // Dependencies ensure this effect runs on formData changes.

  return (
    <div className='flex flex-col'>
        {/* Section for card logos */}
        <div className="flex gap-4 items-center">
            {/* Mastercard logo */}
            <img
                src={`${process.env.PUBLIC_URL}/images/master-card.png`}
                alt="Mastercard"
                className="w-12"
            />
            {/* Visa logo */}
            <img
                src="https://img.icons8.com/color/48/000000/visa.png"
                alt="Visa"
                className="h-12 w-12"
            />
            {/* Verve logo */}
            <img
                src={`${process.env.PUBLIC_URL}/images/verve.svg`}
                alt="Verve"
                className="w-16"
            />
        </div>

        {/* Form inputs for card details */}
        <div className='flex flex-col gap-4 py-5'>
            {/* Name on card input */}
            <div className='flex flex-col gap-1 w-fit'>
                <h2 className='font-semibold text-sm'>Name on card</h2>
                <input 
                    type="text" 
                    id='paymentCard.cardName'
                    value={formData.paymentCard?.cardName}
                    onChange={(e) => {
                        handleChange(e); // Handle form value update
                        handleValidation(e); // Validate the input
                    }}
                    autoComplete='off'
                    placeholder='Card name'
                    className='border-b-2 border-[#48aadf] rounded-md bg-white p-3'
                />
                {/* Error message for name */}
                {errors.cardName && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.cardName}
                    </p>
                }
            </div>

            {/* Card number input */}
            <div className='flex flex-col gap-1 w-fit'>
                <h2 className='font-semibold text-sm'>Debit/Credit card number</h2>
                <input 
                    type="text" 
                    id='paymentCard.cardNumber'
                    value={formData.paymentCard?.cardNumber}
                    onChange={(e) => {
                        handleCardNumberChange(e); // Format and update card number
                        handleValidation(e); // Validate the input
                    }}
                    maxLength={19} // Limit card number to 16 digits + spaces
                    autoComplete='off'
                    placeholder='0000 0000 0000 0000'
                    className='border-b-2 border-[#48aadf] rounded-md bg-white px-3 p-3'
                />
                {/* Error message for card number */}
                {errors.cardNumber && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.cardNumber}
                    </p>
                }
            </div>

            {/* Expiration date inputs */}
            <div className='flex flex-col gap-1'>
                <h2 className='font-semibold text-sm'>Expiration date</h2>
                <div className="flex items-center gap-4">
                    {/* Month input */}
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
                            handleDateChange(e.target.value, 0); // Update month
                            handleValidation({
                                target: { 
                                    id: 'paymentCard.expirationDate', 
                                    value: `${e.target.value}/${formData.paymentCard?.expirationDate?.split('/')[1] || ''}` 
                                }
                            });
                        }}
                        className="rounded-md p-3 w-20 border-b-2 border-[#48aadf] inset-0"
                    />
                    {/* Year input */}
                    <input 
                        type="number" 
                        autoComplete='off'
                        placeholder="YYYY"
                        maxLength={4}
                        value={formData.paymentCard?.expirationDate?.split('/')[1] || ''}
                        onChange={(e) => {
                            handleDateChange(e.target.value, 1); // Update year
                            handleValidation({
                                target: { 
                                    id: 'paymentCard.expirationDate', 
                                    value: `${formData.paymentCard?.expirationDate?.split('/')[0] || ''}/${e.target.value}` 
                                }
                            });
                        }}
                        className="rounded-md p-3 w-20 border-b-2 border-[#48aadf] inset-0"
                    />
                </div>
                {/* Error message for expiration date */}
                {errors.expirationDate && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.expirationDate}
                    </p>
                }
            </div>

            {/* Security code input */}
            <div className='flex flex-col gap-1'>
                <h2 className='text-sm font-semibold'>Security code</h2>
                <input 
                    type="text" 
                    id='paymentCard.securityCode'
                    autoComplete='off'
                    value={formData.paymentCard?.securityCode}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidation(e);
                    }}
                    className='p-3 bg-white border-b-2 border-[#48aadf] rounded-md w-fit'
                />
                {/* Error message for security code */}
                {errors.securityCode && 
                    <p className="text-red-500 text-[0.7rem]">
                        {errors.securityCode}
                    </p>
                }
            </div>
        </div>

        {/* Address details */}
        <div className='flex flex-col gap-4 py-5 border-t-2 border-white'>
            {/* Country/Territory dropdown */}
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
                            <option key={i} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Home address, city, state, ZIP code inputs */}
            {/* Repeatable pattern for address fields */}
            {["address", "city", "state", "zip"].map((field) => (
                <div className='flex flex-col gap-1' key={field}>
                    <h2 className='font-semibold text-sm'>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </h2>
                    <input 
                        type="text" 
                        id={`location.${field}`}
                        value={formData.location?.[field] || ''}
                        onChange={handleChange}
                        autoComplete='off'
                        placeholder={field}
                        className='p-3 rounded-md border-b-2 border-[#48aadf] bg-white w-fit'
                    />
                </div>
            ))}

            {/* Save card checkbox */}
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="saveCard" 
                    checked={saveCard} 
                    onClick={handleCheckboxChange} 
                    onChange={handleChange}
                    className="hidden"
                />
                <label 
                    htmlFor="saveCard" 
                    className="flex items-center cursor-pointer"
                >
                    <div className={`relative w-4 h-4 flex items-center justify-center rounded border-2 transition-all duration-300
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