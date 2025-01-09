import React, { useEffect, useState } from 'react';
// Importing React and React hooks useEffect (for side effects) and useState (for state management).

import { Laptop, Monitor } from 'lucide-react';
import { FcLinux, FcPhoneAndroid } from 'react-icons/fc';
import { AiOutlineApple } from 'react-icons/ai';
// Importing icons from external libraries to represent various device types and operating systems.

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([]);
  // State to store the list of connected devices. Initially, it is an empty array.

  useEffect(() => {
    // Hook to fetch connected devices when the component mounts.

    const fetchDevices = async () => {
      // Asynchronous function to fetch devices data from the API.
      const res = await fetch('/api/auth/connected-devices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      // Sends a GET request to the API endpoint with the authorization token from localStorage.

      const data = await res.json();
      // Parsing the response JSON data.

      console.log(data); // Logs the response for debugging purposes.
      setDevices(data.devices);
      // Updates the devices state with the fetched list of connected devices.
    };

    fetchDevices(); // Calls the fetchDevices function on component mount.
  }, []);
  // The empty dependency array ensures this effect runs only once, when the component mounts.

  const handleLogoutDevice = async (token) => {
    // Function to log out a specific device based on its session token.
    await fetch('/api/auth/logout-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      // Sends a POST request to the API endpoint with the token of the device to be logged out.

      body: JSON.stringify({ token }), // Passes the session token in the request body.
    });
    setDevices(devices.filter((device) => device.token !== token));
    // Updates the devices state by filtering out the logged-out device.
  };

  const formatDateTime = (inputDate) => {
    // Function to format a given date string into a human-readable format.
    const date = new Date(inputDate);
    if (isNaN(date)) {
      return 'Invalid Date'; // Returns this message if the date is invalid.
    }

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    // Formats the date part (e.g., "January 8, 2025").

    const formattedTime = date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
    // Formats the time part (e.g., "10:30 am").

    return `${formattedDate} at ${formattedTime}`;
    // Combines the formatted date and time.
  };

  const getDeviceIcon = (os) => {
    // Function to return the appropriate icon based on the operating system (OS).
    if (/android/i.test(os)) {
      return <FcPhoneAndroid className="text-green-500" title="Android" />;
    } else if (/ios|mac/i.test(os)) {
      return <AiOutlineApple className="text-black" title="iOS/Mac" />;
    } else if (/windows/i.test(os)) {
      return <Laptop className="" title="Windows" />;
    } else if (/linux/i.test(os)) {
      return <FcLinux className="text-orange-500" title="Linux" />;
    } else {
      return <Monitor className="text-gray-500" title="Other" />;
    }
    // Regular expressions (/android/i, /ios/i, etc.) test the OS string to determine the icon.
  };

  return (
    <div className="flex flex-col gap-2 transition duration-300 ease-in-out">
      {/* 
        Main container:
        - flex flex-col: Arranges child elements in a vertical column.
        - gap-2: Adds spacing between child elements.
        - transition duration-300 ease-in-out: Adds a smooth transition effect to interactive elements.
      */}

      <ul className="flex flex-col gap-5">
        {/* 
          List container:
          - flex flex-col: Arranges list items vertically.
          - gap-5: Adds larger spacing between the list items.
        */}

        {devices.map((device, index) => (
          // Maps over the devices state to render each device as a list item.
          <li key={index} className="flex items-start sm:gap-10 gap-4 text-center text-sm">
            {/* 
              List item:
              - flex items-start: Arranges child elements horizontally and aligns them at the start.
              - sm:gap-10 gap-4: Adds spacing between child elements (larger gap on small screens).
              - text-center text-sm: Centers the text and sets it to a small size.
            */}

            <div className="flex flex-col gap-1 font-semibold">
              {/* 
                Container for the device icon:
                - flex flex-col: Arranges child elements in a vertical column.
                - gap-1: Adds spacing between the icon and any future child elements.
                - font-semibold: Makes the text (if any) bold.
              */}
              <p>{getDeviceIcon(device.os)}</p>
              {/* Renders the appropriate device icon based on the OS. */}
            </div>

            <div className="flex flex-col gap-2 items-center">
              {/* 
                Container for device details:
                - flex flex-col: Arranges child elements vertically.
                - gap-2: Adds spacing between the details.
                - items-center: Centers child elements horizontally.
              */}
              <p>{formatDateTime(device.loggedInAt)}</p>
              {/* Displays the formatted login date and time of the device. */}

              {device.isCurrentSession && (
                <p className="px-3 py-0.5 border border-black text-[0.6rem] w-fit rounded-full">
                  Current Session
                </p>
                // Displays a badge if the device is the current session.
              )}
            </div>

            {!device.isCurrentSession && (
              <p
                className="px-3 py-1 cursor-pointer border border-[#48aadf] font-semibold rounded-full text-[0.7rem]"
                onClick={() => handleLogoutDevice(device.token)}
              >
                Logout
              </p>
              // Renders a "Logout" button for devices that are not the current session.
              // onClick calls the handleLogoutDevice function to log out the device.
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedDevices;
// Exports the ConnectedDevices component for use in other parts of the application.