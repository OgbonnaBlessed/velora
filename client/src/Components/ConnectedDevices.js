import React, { useEffect, useState } from 'react';
import { Laptop, Monitor } from 'lucide-react';
import { FcLinux, FcPhoneAndroid } from 'react-icons/fc';
import { AiOutlineApple } from 'react-icons/ai';

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const res = await fetch('/api/auth/connected-devices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      const data = await res.json();
      console.log(data);
      setDevices(data.devices);
    };

    fetchDevices();
  }, []);

    const handleLogoutDevice = async (token) => {
        await fetch('/api/auth/logout-device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({ token }), // Pass the session token
        });
        setDevices(devices.filter((device) => device.token !== token));
    };

  const formatDateTime = (inputDate) => {
    const date = new Date(inputDate);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
    return `${formattedDate} at ${formattedTime}`;
  };

  // Function to get icon based on the OS
  const getDeviceIcon = (os) => {
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
  };

  return (
    <div className="flex flex-col gap-2 transition duration-300 ease-in-out">
      <ul className="flex flex-col gap-5">
        {devices.map((device, index) => (
          <li key={index} className="flex items-start sm:gap-10 gap-4 text-center text-sm">
            <div className="flex flex-col gap-1 font-semibold">
              <p>
                {getDeviceIcon(device.os)}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p>{formatDateTime(device.loggedInAt)}</p>
              {device.isCurrentSession && (
                <p className="px-3 py-0.5 border border-black text-[0.6rem] w-fit rounded-full">
                  Current Session
                </p>
              )}
            </div>
            {!device.isCurrentSession &&
              <p
                className="px-3 py-1 cursor-pointer border border-[#48aadf] font-semibold rounded-full text-[0.7rem]"
                onClick={() => handleLogoutDevice(device.token)}
              >
                Logout
              </p>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedDevices;