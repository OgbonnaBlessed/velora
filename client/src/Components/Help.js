/* eslint-disable no-use-before-define */
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const Help = () => {
    const [isOpen, setIsOpen] = useState(false);
    const helpRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?", timestamp: formatTimestamp(new Date()) },
    ]);
    const [input, setInput] = useState("");

    const predefinedResponses = {
        greeting: "Hi there! How can I help you?",
        booking: "To book a flight, please use the search form and fill in the required details.",
        payment: "You can pay securely using your credit card or other available payment methods.",
        cancel: "To cancel a booking, visit the 'Manage My Booking' section.",
        thanks: "You're welcome! Let me know if there's anything else I can help you with.",
        okay: "Alright! Let me know if you need further assistance.",
        default: "I'm afraid I can only answer travel-related questions. Is there anything else I can help you with?",
    };    

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSendMessage = () => {
        if (input.trim()) {
            const timestamp = formatTimestamp(new Date());
            const userMessage = { sender: "user", text: input, timestamp };
            setMessages((prev) => [...prev, userMessage]);
    
            let botResponse = predefinedResponses.default;
            const lowerCaseInput = input.toLowerCase();
    
            if (lowerCaseInput.includes("hello") || lowerCaseInput.includes("hi")) {
                botResponse = predefinedResponses.greeting;
            } else if (lowerCaseInput.includes("book") || lowerCaseInput.includes("flight")) {
                botResponse = predefinedResponses.booking;
            } else if (lowerCaseInput.includes("pay") || lowerCaseInput.includes("payment")) {
                botResponse = predefinedResponses.payment;
            } else if (lowerCaseInput.includes("cancel")) {
                botResponse = predefinedResponses.cancel;
            } else if (lowerCaseInput.includes("thank") || lowerCaseInput.includes("thanks")) {
                botResponse = predefinedResponses.thanks;
            } else if (lowerCaseInput.includes("okay") || lowerCaseInput.includes("ok")) {
                botResponse = predefinedResponses.okay;
            }
    
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: botResponse, timestamp: formatTimestamp(new Date()) },
                ]);
            }, 1000);
    
            setInput("");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div 
            className={`fixed sm:bottom-4 sm:right-4 bottom-2 right-2 z-[10000] w-96 h-[30rem] max-w-[95%] max-h-full 
                ${isOpen
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }
            `}
        >
            {/* Floating Help Icon */}
            <div
                className={`absolute bottom-0 right-0 ${
                    isOpen ? "hidden" : "flex"
                } bg-[#48aadf] text-white w-12 h-12 rounded-full items-center justify-center cursor-pointer shadow-lg pointer-events-auto`}
                onClick={handleToggle}
            >
                💬
            </div>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        ref={helpRef}
                        className="bg-white w-full h-full rounded-lg shadow shadow-gray-400 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b">
                            <span className="font-semibold">Virtual Agent</span>
                            <button
                                onClick={handleToggle}
                                className="text-[#48aadf] text-lg font-bold focus:outline-none"
                            >
                                <AiOutlineClose />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === "bot" ? "justify-start" : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            msg.sender === "bot"
                                                ? "bg-blue-100 text-blue-900"
                                                : "bg-blue-500 text-white"
                                        } p-2 rounded-lg max-w-[75%]`}
                                    >
                                        <p>{msg.text}</p>
                                        <p className="text-xs text-black mt-1 text-right">
                                            {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="flex items-center border-t border-gray-300 p-2 gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div
                                className="hover:bg-blue-50 transition-all duration-500 ease-in-out rounded-full flex items-center justify-center cursor-pointer p-3"
                                onClick={handleSendMessage}
                            >
                                <Send className="text-blue-500 rotate-45" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Help;