import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePayment = () => {
    const [openAccordion, setOpenAccordion] = useState("paymentMethods");
    const [connectedAccounts, setConnectedAccounts] = useState([]);

    const handleAccordionClick = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };


    useEffect(() => {
        const fetchConnectedAccounts = async () => {
            try {
                const response = await axios.get('/api/auth/connected-accounts', {
                    withCredentials: true, // Include credentials
                });
    
                console.log("Connected Accounts Response:", response.data);
                setConnectedAccounts(response.data.connectedAccounts || []);
                console.log(response.data.connectedAccounts);
            } catch (error) {
                console.error("Error fetching connected accounts:", error.response?.data || error.message);
            }
        };
    
        fetchConnectedAccounts();
    }, []);

  return (
    <div className="bg-blue-50 bg-opacity-50 rounded-3xl sm:p-14 p-5 flex-1 flex flex-col gap-10">
        <div className="bg-white flex flex-col">
            <h1 className="font-bold text-xl py-2 px-5">My Account Info</h1>
            <hr />
            {/* Payment Methods Accordion */}
            <div>
            <h1
                className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                onClick={() => handleAccordionClick("paymentMethods")}
            >
                Payment Methods
                <ChevronDown
                    className={`transition-transform duration-700 ease-in-out ${
                        openAccordion === "paymentMethods" ? "rotate-180" : ""
                    }`}
                />
            </h1>
            <hr />
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                    openAccordion === "paymentMethods" ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="px-5 py-2">
                <h3>You have no saved cards.</h3>
                <p>You can save a new card when you check out.</p>
                </div>
            </div>
            </div>

            {/* Connected Accounts Accordion */}
            <div>
            <h1
                className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                onClick={() => handleAccordionClick("connectedAccounts")}
            >
                Connected Accounts
                <ChevronDown
                    className={`transition-transform duration-700 ease-in-out ${
                        openAccordion === "connectedAccounts" ? "rotate-180" : ""
                    }`}
                />
            </h1>
            <hr />
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                openAccordion === "connectedAccounts" ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="px-5 py-2">
                    {connectedAccounts.length > 0 ? (
                        <ul>
                            {connectedAccounts.map((account, index) => (
                                <li key={index} className="flex justify-between items-center py-2">
                                    <span>
                                        {account.provider} ({account.email})
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Connected on {new Date(account.connectedAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No connected accounts yet.</p>
                    )}
                </div>
            </div>
            </div>

            {/* Travel Arranger Accordion */}
            <div>
            <h1
                className="font-semibold cursor-pointer py-2 px-5 flex justify-between items-center"
                onClick={() => handleAccordionClick("travelArranger")}
            >
                Travel Arranger
                <ChevronDown
                className={`transition-transform duration-700 ease-in-out ${
                    openAccordion === "travelArranger" ? "rotate-180" : ""
                }`}
                />
            </h1>
            <hr />
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                openAccordion === "travelArranger" ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="px-5 py-2">
                <p>
                    Velora's Travel Arranger lets you book travel for your friends
                    or co-workers. With permission, you can arrange trips directly
                    from their account, making it simple to coordinate and manage
                    trips for any Velora traveler.
                </p>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePayment;