import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import ConnectedDevices from './ConnectedDevices';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';

const ProfileSettings = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [deleteAccountModal, setDeleteAccountModal] = useState(false);
    const [displayConnectedDevices, setDisplayConnectedDevices] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleConfirmEmail = async () => {
        try {
            const res = await fetch('/api/auth/confirm-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.error(data.message);
                setModalMessage(data.message);
                setShowModal(true);
            }
    
        } catch (error) {
          console.error('Error sending reset email:', error);
        }
    };

    const handleSendConfirmEmail = async () => {
        try {
            const res = await fetch('/api/auth/confirm-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentUser.email }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.error(data.message);
                setModalMessage(data.message);
                setShowModal(true);
            }

            navigate('/verify-email');
    
        } catch (error) {
          console.error('Error sending reset email:', error);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
    
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
        
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
          dispatch(deleteUserFailure(error.message))
        }
    } 
    
  return (
    <div className='bg-blue-100 rounded-3xl sm:p-14 p-5 sm:flex-1 flex flex-col gap-10 max-w-full'>
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
                <h1 className='font-semibold sm:text-3xl text-2xl'>Sign-in and security</h1>
                <p className='text-sm'>
                    Keep your account safe with a secure password and by signing out of devices you're not actively using.
                </p>
            </div>
            <div className='flex flex-col gap-5'>
                <div 
                    className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg w-72 max-w-full relative shadow shadow-gray-300'
                    onClick={() => {
                        handleConfirmEmail();
                        navigate('/verify-user-email');
                    }}
                >
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Email</h2>
                        <p className='text-sm'>{currentUser.email}</p>
                    </div>
                    <ChevronRight/>
                </div>
                <div 
                    className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'
                    onClick={() => {
                        handleSendConfirmEmail();
                        navigate('/verify-email');
                    }}
                >
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Change password</h2>
                    </div>
                    <ChevronRight/>
                </div>
                <div className='flex flex-col gap-5 '>
                    <div 
                        className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'
                        onClick={() => setDisplayConnectedDevices(!displayConnectedDevices)}
                    >
                        <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                        <div>
                            <h2 className='font-semibold'>Connected devices</h2>
                        </div>
                        <ChevronRight className={`transition-all duration-300 ease-in-out 
                                ${displayConnectedDevices ? 'rotate-90' : ''}`
                            }
                        />
                    </div>
                    <div className={`overflow-hidden ml-5 transition duration-300 ease-in-out 
                            ${displayConnectedDevices ? 'max-h-screen' : 'h-0'}`
                        }
                    >
                        <ConnectedDevices/>
                    </div>
                </div>
            </div>
        </div>

        <div className='flex flex-col gap-5'>
            <div>
                <h1 className='font-semibold sm:text-3xl text-2xl'>Account management</h1>
                <p className='text-sm'>Control other options to manage your data, like deleting your account.</p>
            </div>
            <div className='flex flex-col gap-5'>
                <div className='bg-white py-3 px-4 flex items-center justify-between cursor-pointer rounded-lg h-16 w-72 max-w-full relative shadow shadow-gray-300'>
                    <div className='bg-[#48aadf] h-[70%] w-1.5 rounded-r-xl absolute left-0'></div>
                    <div>
                        <h2 className='font-semibold'>Traveler arranger</h2>
                    </div>
                    <ChevronRight/>
                </div>
                <p 
                    className='hover:underline text-[#1158a6] text-sm cursor-pointer w-fit'
                    onClick={() => {
                        setDeleteAccountModal(!deleteAccountModal);
                        setModalMessage('Your data will be permanently deleted from Velora')
                    }}
                >
                    Delete account
                </p>
                <p className='text-sm'>Permanently delete your Velora account and data.</p>
            </div>
        </div>

        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                    duration: .5,
                        ease: 'easeInOut'
                    }}
                    exit={{ opacity: 0 }}
                    className="fixed left-0 right-0 top-0 bottom-0 z-[10000] bg-black/25 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                        duration: .5,
                        ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                    >
                        <X
                        className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                        onClick={() => setShowModal(false)}
                        />
                        <p className="font-serif pt-2 text-center">{modalMessage}</p>
                        <div className="actions">
                        <button 
                            type="button" 
                            className={`bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out 
                            shrink-button`
                            }
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence> 

        <AnimatePresence>
            {deleteAccountModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                    duration: .5,
                        ease: 'easeInOut'
                    }}
                    exit={{ opacity: 0 }}
                    className="fixed left-0 right-0 top-0 bottom-0 z-[10000] bg-black/25 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                        duration: .5,
                        ease: 'easeInOut'
                        }}
                        exit={{ opacity: 0 }}
                        className="relative bg-[#ECECEC] p-5 pt-8 rounded-xl .transition-all { transition: all 0.3s ease-in-out; } w-64 max-w-[90%] flex justify-center items-center flex-col gap-4"
                    >
                        <X
                        className="cursor-pointer text-black absolute left-2 top-2 p-2 rounded-full text-[2rem] bg-[#48aadf13] w-8 h-8"
                        onClick={() => setDeleteAccountModal(false)}
                        />
                        <p className="font-serif pt-2 text-center">{modalMessage}</p>
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" 
                                className={`bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out 
                                shrink-button`
                                }
                                onClick={() => {
                                    setShowModal(false);
                                    handleDeleteUser();
                                }}
                            >
                                Delete
                            </button>
                            <button 
                                type="button" 
                                className={`bg-[#48aadf] py-2 px-5 text-white cursor-pointer rounded-full transition-all duration-300 ease-in-out 
                                shrink-button`
                                }
                                onClick={() => setDeleteAccountModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence> 
    </div>
  )
}

export default ProfileSettings