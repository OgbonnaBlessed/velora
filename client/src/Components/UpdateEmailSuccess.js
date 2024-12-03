import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateEmailSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent user from going back to the previous page
        const handlePopState = () => {
            navigate('/signin', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className='bg-white fixed w-full h-full inset-0 z-20 flex justify-center'>
            <div className='pt-16 w-[30rem] max-w-[90%] flex flex-col gap-5'>
                <div
                    className='bg-[#48aadf13] absolute left-3 top-3 p-2.5 rounded-full cursor-pointer text-[#48aadf]'
                    onClick={() => {
                        navigate('/signin');
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
                <h1 className='text-black font-medium text-2xl text-center'>
                    Your email has been successfully updated.
                </h1>
                <p className='text-center text-sm'>
                    Kindly sign in before you proceed further
                </p>
                <button
                    className='bg-[#48aadf] rounded-full py-3 w-full text-white font-semibold cursor-pointer'
                    onClick={() => navigate('/signin')}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default UpdateEmailSuccess;