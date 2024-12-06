import React, { useState } from 'react'
import Stays from '../Components/Stays';
import Flights from '../Components/Flights';
import Packages from '../Components/Packages';
import Things from '../Components/Things';
import Cars from '../Components/Cars';

const Home = () => {
  const [visible, setVisible] = useState('Stays');

  const OpenTab = (tabname) => {
    setVisible(tabname);
  }

  return (
    <div className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-36 pb-10'>
      <div className='border rounded-2xl w-full'>
        <div className='flex justify-center items-center text-[0.915rem] border-b text-nowrap overflow-x-auto remove-scroll-bar'>
          <p 
            className={`py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:ml-20 max-[400px]:ml-32
              ${visible === 'Stays' ? 'border-b-2 border-[#48aadf]' : ''}`
            }
            onClick={() => OpenTab('Stays')}
          >
            Stays
          </p>
          <p
            className={`py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out
              ${visible === 'Flights' ? 'border-b-2 border-[#48aadf]' : ''}`
            }
            onClick={() => OpenTab('Flights')}
          >
            Flights
          </p>
          <p
            className={`py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out
              ${visible === 'Cars' ? 'border-b-2 border-[#48aadf]' : ''}`
            }
            onClick={() => OpenTab('Cars')}
          >
            Cars
          </p>
          <p
            className={`py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out
              ${visible === 'Packages' ? 'border-b-2 border-[#48aadf]' : ''}`
            }
            onClick={() => OpenTab('Packages')}
          >
            Packages
          </p>
          <p
            className={`py-3 px-4 cursor-pointer transition-all duration-500 ease-in-out max-[500px]:mr-5 
              ${visible === 'Things' ? 'border-b-2 border-[#48aadf]' : ''}`
            }
            onClick={() => OpenTab('Things')}
          >
            Things to do
          </p>
        </div>

        {/* Tab Contents */}
        {visible === 'Stays' && <Stays />}
        {visible === 'Flights' && <Flights />}
        {visible === 'Packages' && <Packages />}
        {visible === 'Things' && <Things />}
        {visible === 'Cars' && <Cars />}
      </div>
    </div>
  )
}

export default Home