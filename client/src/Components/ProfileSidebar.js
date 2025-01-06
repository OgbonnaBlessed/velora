/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios";
import { CalendarCog, Camera, ChevronRight, CreditCardIcon, SettingsIcon, StarIcon } from "lucide-react";
import React, { useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess, updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import { AnimatePresence, motion } from "framer-motion";
import { FiMoreHorizontal } from 'react-icons/fi';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dddvbg9tm/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "velora";

const ProfileSidebar = () => {
    const { currentUser, error } = useSelector((state) => state.user);
    const [tab, setTab] = useState("details");
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [sidebar, setSidebar] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const filePickerRef = useRef();
    const sidebarRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                setImageFile(file);
                setImageFileUrl(URL.createObjectURL(file));
            } else {
                setUpdateUserError("Only image files are allowed");
                setImageFile(null);
            }
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImageToCloudinary();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile]);

    const handleSubmit = async (imageUrl) => {
        
        try {
            dispatch(updateStart());
            const res = await axios.put(
                `/api/user/update/${currentUser._id}`,
                { profilePicture: imageUrl },
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (res.status === 200) {
                dispatch(updateSuccess(res.data));
                setUpdateUserSuccess("image uploaded successfully");
            } else {
                dispatch(updateFailure(res.data.message));
                setUpdateUserError(res.data.message);
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const uploadImageToCloudinary = async () => {
        setImageFileUploading(true);
        setImageFileUploadProgress(0);
    
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
        try {
            const res = await axios.post(CLOUDINARY_URL, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setImageFileUploadProgress(progress);
                },
            });
    
            const imageUrl = res.data.secure_url;
            console.log(imageUrl);
            setImageFileUrl(imageUrl);
    
            setImageFileUploading(false);
            setImageFileUploadProgress(0);
            handleSubmit(imageUrl);  // Call the submit function after the image upload completes
        } catch (error) {
            setUpdateUserError("Image upload failed. Please try again.");
            setImageFileUploading(false);
        }
    };
    
    const handleSignOut = async () => {
        try {
            const res = await axios.post("/api/user/signout");
            if (res.status === 200) {
            dispatch(signOutSuccess());
            } else {
            console.log(res.data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    useEffect(() => {
        if (updateUserSuccess || updateUserError || error || imageFileUploadError) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess(null);
                setUpdateUserError(null);
                setImageFileUploadError(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [updateUserSuccess, updateUserError, error, imageFileUploadError]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
    
        if (tabFromUrl) {
          setTab(tabFromUrl);
        }
    }, [location.search]);

    useEffect(() => {
        const closeSidebar = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebar(false);
            }
        }
  
        document.addEventListener('mousedown', closeSidebar);
  
        return () => {
          document.removeEventListener('mousedown', closeSidebar);
        }
    }, []);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

  return (
    <>
        <FiMoreHorizontal 
            className="xl:hidden block fixed left-5 top-36 bg-white shadow shadow-gray-300 rounded-md p-2 text-3xl cursor-pointer"
            onClick={() => setSidebar(!sidebar)}
        />

        <div className='max-xl:hidden xl:w-72 xl:flex flex-col gap-10'>
            <div className='flex items-start gap-3'>
                <div className='relative'>
                    <input 
                        type="file" 
                        accept='image/*' 
                        onChange={handleImageChange} 
                        ref={filePickerRef}
                        className='hidden'
                    />
                    <img 
                        src={imageFileUrl || currentUser.profilePicture} 
                        alt="profile picture" 
                        className={`w-14 h-14 rounded-full transition-all duration-300 ease-in-out
                            ${imageFileUploading ? 'opacity-[0.4]' : 'opacity-100'}`
                        }
                        style={{
                            opacity: imageFileUploading ? (0.4 + (imageFileUploadProgress / 250)) : 1
                        }}
                    />
                        {imageFileUploading && (
                            <div className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center">
                                <CircularProgressbar
                                    value={imageFileUploadProgress || 0}
                                    text={`${imageFileUploadProgress}%`}
                                    strokeWidth={5}
                                    styles={{
                                        path: {
                                            stroke: `rgba(64, 120, 188, ${imageFileUploadProgress / 100})`,
                                        },
                                        text: {
                                            fill: "white",
                                            fontSize: "0.8rem",
                                            fontWeight: "bold",
                                            dominantBaseline: "central", // Vertically align text
                                            textAnchor: "middle", // Horizontally align text
                                        },
                                    }}
                                />
                            </div>
                        )}
                    <Camera 
                        className='absolute bg-gray-300 rounded-full p-1 text-[#48aadf] bottom-0 right-0 cursor-pointer'
                        onClick={() => filePickerRef.current.click()}
                    />
                </div>
                <div>
                    <h2 className='font-medium'>Welcome, {currentUser.firstName}</h2>
                    <p className='text-sm'>{currentUser.email}</p>
                </div>
            </div>

            <p 
                className={`text-[0.7rem] -mt-8 text-green-500 transform transition-all duration-700 ease-in-out 
                    ${
                        updateUserSuccess 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-5 pointer-events-none'
                    }`
                }
            >
                {updateUserSuccess}
            </p>

            <p 
                className={`text-[0.7rem] -mt-8 text-red-500 self-start transform transition-all duration-700 ease-in-out 
                    ${
                        updateUserError 
                        ? 'opacity-1 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-5 pointer-events-none'
                    }`
                }
            >
                {updateUserError}
            </p>

            <div className='flex flex-col gap-5'>
                <Link 
                    to='/profile?tab=details'
                    className={`relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20 
                        ${tab === 'details' ? 'border-0' : ''}`
                    }
                >
                    <FaUser className='text-xl'/>
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Profile</h2>
                        <p className='text-[0.7rem]'>Provide your personal details and travel documents</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>
                <Link 
                    to='/profile?tab=payment'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <CreditCardIcon className='text-xl'/>
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Payment methods</h2>
                        <p className='text-[0.7rem]'>View saved payment methods</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>
                <Link 
                    to='/profile?tab=reviews'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <StarIcon className='text-xl'/>
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Reviews</h2>
                        <p className='text-[0.7rem]'>Read reviews you've shared</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>
                <Link
                    to='/profile?tab=bookings'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <CalendarCog className='text-xl'/>
                    <div className="w-[70%]">
                        <h2 className="font-medium">Manage Bookings</h2>
                        <p className="text-[0.7rem]">Manage your bookings</p>
                    </div>
                    <ChevronRight className="text-3xl absolute right-2" />
                </Link>
                <Link 
                    to='/profile?tab=settings'
                    className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                >
                    <SettingsIcon className='text-xl'/>
                    <div className='w-[70%]'>
                        <h2 className='font-medium'>Security and settings</h2>
                        <p className='text-[0.7rem]'>Update your email or password</p>
                    </div>
                    <ChevronRight className='text-3xl absolute right-2'/>
                </Link>
                <div className='text-lg font-medium h-20 w-full flex items-center justify-center'>
                    <p 
                        className='cursor-pointer text-[#4078bc] text-lg font-medium'
                        onClick={handleSignOut}
                    >
                        Sign out
                    </p> 
                </div>
            </div>
        </div>

        <AnimatePresence>
            {sidebar && 
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: .5,
                        ease: "easeInOut"
                    }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001]"
                >
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: .5,
                            ease: "easeInOut"
                        }}
                        ref={sidebarRef}
                        className='flex flex-col gap-7 w-[20rem] pointer-events-auto max-w-[90%] bg-white rounded-2xl z-[10002] px-6 py-4'
                    >
                        <div className='flex items-start gap-3'>
                            <div className='relative'>
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    onChange={handleImageChange} 
                                    ref={filePickerRef}
                                    className='hidden'
                                />
                                <img 
                                    src={imageFileUrl || currentUser.profilePicture} 
                                    alt="profile picture" 
                                    className={`w-14 h-14 rounded-full transition-all duration-300 ease-in-out
                                        ${imageFileUploading ? 'opacity-[0.4]' : 'opacity-100'}`
                                    }
                                    style={{
                                        opacity: imageFileUploading ? (0.4 + (imageFileUploadProgress / 250)) : 1
                                    }}
                                />
                                    {imageFileUploading && (
                                        <div className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center">
                                            <CircularProgressbar
                                                value={imageFileUploadProgress || 0}
                                                text={`${imageFileUploadProgress}%`}
                                                strokeWidth={5}
                                                styles={{
                                                    path: {
                                                        stroke: `rgba(64, 120, 188, ${imageFileUploadProgress / 100})`,
                                                    },
                                                    text: {
                                                        fill: "white",
                                                        fontSize: "0.8rem",
                                                        fontWeight: "bold",
                                                        dominantBaseline: "central", // Vertically align text
                                                        textAnchor: "middle", // Horizontally align text
                                                    },
                                                }}
                                            />
                                        </div>
                                    )}
                                <Camera 
                                    className='absolute bg-gray-300 rounded-full p-1 text-[#48aadf] bottom-0 right-0 cursor-pointer'
                                    onClick={() => filePickerRef.current.click()}
                                />
                            </div>
                            <div>
                                <h2 className='font-medium'>Welcome, {currentUser.firstName}</h2>
                                <p className='text-sm'>{currentUser.email}</p>
                            </div>
                        </div>

                        <p 
                            className={`text-[0.7rem] -mt-8 text-green-500 transform transition-all duration-700 ease-in-out
                                ${
                                    updateUserSuccess 
                                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 -translate-y-5 pointer-events-none'
                                }`
                            }
                        >
                            {updateUserSuccess}
                        </p>

                        <p 
                            className={`text-[0.7rem] -mt-8 text-red-500 self-start transform transition-all duration-700 ease-in-out 
                                ${
                                    updateUserError 
                                    ? 'opacity-1 translate-y-0 pointer-events-auto' 
                                    : 'opacity-0 -translate-y-5 pointer-events-none'
                                }`
                            }
                        >
                            {updateUserError}
                        </p>

                        <div className='flex flex-col gap-4'>
                            <Link 
                                to='/profile?tab=details'
                                className={`relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20 
                                    ${tab === 'details' ? 'border-0' : ''}`
                                }
                                onClick={toggleSidebar}
                            >
                                <FaUser className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Profile</h2>
                                    <p className='text-[0.7rem]'>Provide your personal details and travel documents</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            <Link 
                                to='/profile?tab=payment'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <CreditCardIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Payment methods</h2>
                                    <p className='text-[0.7rem]'>View saved payment methods</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            <Link 
                                to='/profile?tab=reviews'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <StarIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Reviews</h2>
                                    <p className='text-[0.7rem]'>Read reviews you've shared</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            <Link
                                to='/profile?tab=bookings'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <CalendarCog className='text-xl'/>
                                <div className="w-[70%]">
                                    <h2 className="font-medium">Manage Bookings</h2>
                                    <p className="text-[0.7rem]">Manage your bookings</p>
                                </div>
                                <ChevronRight className="text-3xl absolute right-2" />
                            </Link>
                            <Link 
                                to='/profile?tab=settings'
                                className='relative flex items-center gap-5 shadow shadow-gray-300 rounded-2xl py-3 px-4 h-20'
                                onClick={toggleSidebar}
                            >
                                <SettingsIcon className='text-xl'/>
                                <div className='w-[70%]'>
                                    <h2 className='font-medium'>Security and settings</h2>
                                    <p className='text-[0.7rem]'>Update your email or password</p>
                                </div>
                                <ChevronRight className='text-3xl absolute right-2'/>
                            </Link>
                            <div className='text-lg font-medium w-full flex items-center justify-center'>
                                <p 
                                    className='cursor-pointer text-[#4078bc] text-lg font-medium'
                                    onClick={() => {
                                        handleSignOut()
                                        toggleSidebar()
                                    }}
                                >
                                    Sign out
                                </p> 
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </>
  );
};

export default ProfileSidebar;