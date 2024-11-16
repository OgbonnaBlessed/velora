import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleDown, FaBars, FaBell, FaBriefcase, FaCar, FaClone, FaGlobe, FaHotel, FaSearch, FaTelegramPlane } from 'react-icons/fa'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [services, setServices] = useState(false);
    const [sidebarServices, setSidebarServices] = useState(false);
    const sidebarRef = useRef(null);
    const servicesRef = useRef(null);
    const sidebarServicesRef = useRef(null);

    // Function to toggle the services drop down
    const toggleServices = () => {
        setServices(!services);
    };

    // Function to toggle the services drop down
    const toggleSidebarServices = () => {
        setSidebarServices(!sidebarServices);
    };

    const toggleSidebar = () => {
        // Check if the sidebar is open and the services dropdown is visible
        if (sidebarServices === true) {
            // Close the services dropdown first
            setSidebarServices(false);
            
            // Delay closing the sidebar to allow the dropdown to close smoothly
            setTimeout(() => {
                setIsOpen(false);
            }, 800); // 800ms delay for the transition
        } else {
            // Toggle the sidebar normally
            setIsOpen((prev) => !prev);
        }
    };

    useEffect(() => {
        const closeSidebar = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false);
          }

          if (servicesRef.current && !servicesRef.current.contains(event.target)) {
            setServices(false);
          }

          if (sidebarServicesRef.current && !sidebarServicesRef.current.contains(event.target)) {
            setSidebarServices(false);
          }
        }
  
        document.addEventListener('mousedown', closeSidebar);
  
        return () => {
          document.removeEventListener('mousedown', closeSidebar);
        }
    }, []);

  return (
    <nav ref={sidebarRef} >
        <div className='lg:px-20 px-6 py-6 bg-[#48aadf] flex justify-between items-center font-medium z-50'>
            <div className='flex items-center gap-14'>

                {/* Logo */}
                <Link 
                    to='/'
                    className='flex items-center gap-1'
                >
                    <img 
                        src={`${process.env.PUBLIC_URL}/images/logo.png`} 
                        alt="Valero logo" 
                        className='w-8 bg-black p-1 rounded-md'
                    />
                    <h1 className='text-xl font-sans text-white'>valero</h1>
                </Link>

                <div className='relative' ref={servicesRef}>
                    <div 
                        className='hidden lg:flex items-center gap-1 text-white cursor-pointer text-[.9rem]'
                        onClick={() => setServices(!services)}
                    >
                        <p>view services</p>
                        <FaAngleDown />
                    </div>
                    <div className={`hidden absolute top-8  bg-white rounded-xl lg:flex flex-col transition-all duration-700 ease-in-out transform
                        ${services ? 'w-64 h-96 translate-y-0' : 'w-0 h-0 -translate-y-3'} overflow-hidden shadow shadow-black font-normal text-sm`}>
                        <div className='flex flex-col py-3 w-full border-b-2 border-gray-400'>
                            <Link 
                                to='/stays'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaHotel className='text-2xl'/>
                                    <p>Stays</p>
                                </div>
                            </Link>
                            <Link 
                                to='/roundtrip'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaTelegramPlane className='text-2xl'/>
                                    <p>Flights</p>
                                </div>
                            </Link>
                            <Link 
                                to='/cars'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaCar className='text-2xl'/>
                                    <p>Cars</p>
                                </div>
                            </Link>
                            <Link 
                                to='/packages'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaBriefcase className='text-2xl'/>
                                    <p>Packages</p>
                                </div>
                            </Link>
                            <Link 
                                to='/things'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaClone className='text-2xl'/>
                                    <p>Things to do</p>
                                </div>
                            </Link>
                        </div>
                        <div className='flex flex-col py-3 w-full'>
                            <Link 
                                to='/deals'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                Deals
                            </Link>
                            <Link 
                                to='/meeting'
                                className='pl-5 py-3 w-full hover:bg-gray-200 transition-colors duration-300 ease-in-out'
                                onClick={toggleServices}
                            >
                                Groups & meeting
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className='hidden lg:flex items-center gap-14 text-white text-[.9rem]'>
                <div className='flex gap-2 items-center cursor-pointer'>
                    <FaGlobe/>
                    <p>English</p>
                </div>
                <Link to='/'>List your property</Link>
                <Link>Trips</Link>
                <Link
                    to='/notifications'
                    className='text-xl'
                >
                    <FaBell/>
                </Link>
                <Link to='/signin'>
                    Sign in
                </Link>
            </div>
            <div 
                className='lg:hidden'
                onClick={toggleSidebar}
            >
                <FaBars/>
            </div>
        </div>

        {/* Sidebar */}
        <aside 
            ref={sidebarServicesRef} 
            className={`absolute top-[4.8rem] left-0 w-96 max-w-full h-[100vh] bg-gradient-to-b bg-[#4078bc] text-white lg:hidden transition-all duration-700 ease-in-out transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            }
        >
            <nav className='flex flex-col space-y-8 mt-4 justify-center items-center'>
                <Link 
                    to="/signup" 
                    className="text-white relative"
                    onClick={toggleSidebar}
                >
                    <button
                        className='rounded-full bg-[#48aadf] px-10 py-2 cursor-pointer'
                    >
                        Sign up
                    </button> 
                </Link>
                <Link 
                    to="/notifications" 
                    className="text-white relative self-start px-6"
                    onClick={toggleSidebar}
                >
                    Notifications 
                </Link>
                <div className='flex flex-col space-y-4 mt-4 p-4 border border-x-0 border-y-gray-400 w-[100%]'>
                    <div className='relative flex flex-col gap-4'>
                        <div
                            className='flex items-center gap-2'
                            onClick={toggleSidebarServices}
                        >
                            <FaSearch /> View services
                        </div>
                        <div className={`lg:hidden  bg-[#48aadf] rounded-xl flex flex-col transition-all duration-700 ease-in-out transform
                            ${sidebarServices ? 'h-96' : 'h-0'} overflow-hidden font-normal text-sm`}>
                            <div className='flex flex-col py-3 w-full border-b-2 border-gray-400'>
                                <Link 
                                    to='/stays'
                                    className='pl-5 py-3 w-full hover:bg-[gray-200] hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaHotel className='text-2xl'/>
                                        <p>Stays</p>
                                    </div>
                                </Link>
                                <Link 
                                    to='/roundtrip'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaTelegramPlane className='text-2xl'/>
                                        <p>Flights</p>
                                    </div>
                                </Link>
                                <Link 
                                    to='/cars'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaCar className='text-2xl'/>
                                        <p>Cars</p>
                                    </div>
                                </Link>
                                <Link 
                                    to='/packages'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaBriefcase className='text-2xl'/>
                                        <p>Packages</p>
                                    </div>
                                </Link>
                                <Link 
                                    to='/things'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaClone className='text-2xl'/>
                                        <p>Things to do</p>
                                    </div>
                                </Link>
                            </div>
                            <div className='flex flex-col py-3 w-full'>
                                <Link 
                                    to='/deals'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    Deals
                                </Link>
                                <Link 
                                    to='/meeting'
                                    className='pl-5 py-3 w-full hover:bg-gray-200 hover:text-black transition-colors duration-300 ease-in-out'
                                    onClick={toggleSidebar}
                                >
                                    Groups & meeting
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/shop" 
                        className='text-white flex items-center gap-2'
                        onClick={toggleSidebar}
                    >
                        <FaGlobe /> English
                    </Link>
                </div>
                <div className='flex flex-col space-y-8 px-6 pb-4 border-0 w-full'>
                    <Link 
                        to="/property" 
                        className=''
                        onClick={toggleSidebar}
                    >
                        List your property
                    </Link>
                    <Link 
                        to="/trips" 
                        className=''
                        onClick={toggleSidebar}
                    >
                        Trips
                    </Link>
                    <Link 
                        to="/feedback" 
                        className=''
                        onClick={toggleSidebar}
                    >
                        Feedback
                    </Link>
                </div>
            </nav>
        </aside>
    </nav>
  )
}

export default Navbar
