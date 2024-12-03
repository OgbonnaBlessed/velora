import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { 
  updateFailure, 
  updateStart, 
  updateSuccess, 
} from '../redux/user/userSlice';

const UpdateEmail = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isFocused3, setIsFocused3] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData['email'])) {
            setModalMessage("Please enter a valid email address.");
            return;
        }
    
        setLoading(true);
    
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // This ensures cookies are sent with the request
            });
    
            const data = await res.json();
            console.log(data);
    
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setModalMessage(data.message);
            } else {
                navigate('/email-update-success');
                dispatch(updateSuccess(data));
            }
        } catch (error) {
            setModalMessage(error.message);
            dispatch(updateFailure(error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    // Automatically hide modal after 3 seconds
    useEffect(() => {
        if (modalMessage) {

        const timer = setTimeout(() => {
            setModalMessage(null);
        }, 3000); // 3 seconds
    
        // Cleanup the timer if the component unmounts or the state changes before 5 seconds
        return () => clearTimeout(timer);
        }

    }, [modalMessage]);

  return (
    <div className='bg-white fixed w-full h-full inset-0 z-20 flex justify-center'>
        <form onSubmit={handleSubmit} className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
            <div 
                className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <ArrowLeft />
            </div>

            <div className='flex items-center justify-center gap-1 w-full mb-5'>
                <img 
                    src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                    alt="Velora logo" 
                    className='w-14 bg-black p-1 rounded-md'
                />
            </div>
            <h1 className='text-3xl font-semibold'>Change Email</h1>
            <p className='text-sm'>
                Your new email will be used for all communications regarding your bookingd, account updates, and other important information. Please ensure it's correct.
            </p>
            <div className='w-full flex flex-col gap-5'>
                <div className='relative text-black'>
                    <label
                        htmlFor="current-email"
                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-3`}
                    >
                        Current email
                    </label>
                    <input 
                        id='current-email'
                        type='email'
                        value={currentUser.email}
                        className="w-full border border-black rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                        readOnly
                    />
                </div>
                <div className='relative text-black'>
                    <label
                        htmlFor="email"
                        className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                        isFocused3
                            ? 'top-[0.01rem] scale-75 text-[#48aadf] transform -translate-x-2' // Label moves up and scales down when focused
                            : 'top-1/2 transform -translate-y-1/2 text-black'
                        }`}
                    >
                        New email
                    </label>
                    <input 
                        id='email'
                        type='email'
                        autoComplete='off'
                        onFocus={() => setIsFocused3(true)}
                        onBlur={(e) => !e.target.value && setIsFocused3(false)} // Reset if input is empty
                        onChange={handleChange} 
                        className="w-full border border-black rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                    />
                </div>
            </div>

            <p className={`text-[0.7rem] text-red-500 transform transition-all duration-700 ease-in-out ${
                    modalMessage 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-5 pointer-events-none'
                    }`
                }
            >
                {modalMessage}
            </p>

            <button 
                type="submit"
                disabled={loading}
                className='w-full rounded-full cursor-pointer py-3 text-white font-semibold bg-[#48aadf]'
            >
                {loading 
                    ? <SyncLoader 
                        color="#fff" // Customize the color
                        loading={loading} 
                        size={7} // Customize the size
                        margin={2} // Customize the margin between circles
                        />
                    : 'Update email'
                }
            </button>
        </form>
    </div>
  )
}

export default UpdateEmail