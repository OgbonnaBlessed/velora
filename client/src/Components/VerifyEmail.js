import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

const VerifyEmail = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [modalMessage, setModalMessage] = useState(null);
    const [timer, setTimer] = useState(30); // Countdown timer in seconds
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [isFocused2, setIsFocused2] = useState(false);
    const navigate = useNavigate();

    const handleResendCode = async () => {

        try {
            const response = await fetch('/api/auth/resend-code', {
                method: 'POST',
                body: JSON.stringify({ email: currentUser.email }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success === true) {
                setTimer(30); // Reset the timer to 30s after successful resend
                setCanResend(false); // Disable the resend button until the next timer

            } else {
                setModalMessage(result.message);
            }

        } catch (error) {
            console.error('Error resending OTP:', error);
            setModalMessage(error.message);
        }
    };

    const handleVerifyCode = async () => {
        if (otp.length !== 4) {
            setModalMessage('Kindly enter a valid code');
            return;
        }
    
        try {
            setLoading(true);

            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email, code: otp }),
            });
        
            const data = await res.json();
        
            if (res.ok) {
                navigate('/password-reset')
        
            } else {
                console.error('Verification failed:', data.message);
                setModalMessage(data.message);
            }
    
            setLoading(false);

        } catch (error) {
          console.error('Error verifying code:', error);
        }
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    useEffect(() => {
        if (timer === 0) {
            setCanResend(true); // Enable the resend button when timer reaches zero
            return;
        }

        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [timer]);

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
    <>
        <div className='bg-white fixed w-full h-full inset-0 z-20 flex justify-center'>
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
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

                <>
                    <h1 className='text-2xl font-semibold'>Let's confirm your email</h1>
                    <p className='text-sm'>
                        To continue, enter the secure code we sent to <b>{currentUser.email}</b>. Check junk mail if it's not in your inbox
                    </p>
                    <div className='rounded-xl w-full h-14 relative'>
                        <label
                            htmlFor="token"
                            className={`absolute left-5 transition-all duration-300 ease-in-out cursor-text ${
                            isFocused2
                                ? 'top-[0.05rem] scale-75 text-[#48aadf] transform -translate-x-2' // Label moves up and scales down when focused
                                : 'top-1/2 transform -translate-y-1/2 text-black'
                            }`}
                        >
                            4-digit code
                        </label>
                        <input
                            type="number"
                            id="token"
                            value={otp}
                            className="w-full border border-black rounded-xl h-14 pl-5 pt-3 pb-1 text-base"
                            onFocus={() => setIsFocused2(true)}
                            onChange={handleOtpChange}
                            autoComplete='off'
                            onBlur={(e) => !e.target.value && setIsFocused2(false)} // Reset if input is empty
                        />
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
                        disabled={loading}
                        className={`w-full py-3 text-white rounded-full border-none outline-none flex items-center justify-center gap-2 transition-all duration-300 ease-in-out
                            ${loading ? 'bg-[#48aadf96] cursor-not-allowed' : 'bg-[#48aadf] cursor-pointer'}`
                        }
                        onClick={handleVerifyCode}
                    >
                    {loading 
                        ? <SyncLoader 
                            color="#fff" // Customize the color
                            loading={loading} 
                            size={7} // Customize the size
                            margin={2} // Customize the margin between circles
                            />
                        : 'Continue'
                    }
                    </button>
                    {canResend 
                    ?  <button
                            className='w-full rounded-full py-3 cursor-pointer font-semibold hover:bg-[#48aadf13] text-[#48aadf] transition-all duration-300 ease-in-out'
                            onClick={handleResendCode}
                        >
                            Resend another secured code
                        </button>
                    :   <p className='text-center font-semibold'>
                            Your can request for a new code in {timer}s
                        </p>
                    }
                </>
            </div>

        </div>
    </>
  )
}

export default VerifyEmail