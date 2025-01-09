import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineComment } from "react-icons/md";

const Help = () => {
    // State hook to track if the chat interface is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // References to the chat interface and the last message for scrolling functionality
    const helpRef = useRef(null);
    const lastMessageRef = useRef(null); // Ref for the last message

    useEffect(() => {
        // Function to handle clicks outside the chat interface to close it
        const handleClickOutside = (event) => {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Adding event listener to detect outside click
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup event listener when component unmounts
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Function to format timestamp to a readable time format (HH:mm)
    const formatTimestamp = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // State to store chat messages and user input
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?", timestamp: formatTimestamp(new Date()) },
    ]);
    const [input, setInput] = useState(""); // User input state

    // Predefined bot responses for different types of user input
    const predefinedResponses = {
        greeting: "Hi there! How can I help you?",
        booking: "To book a flight, please use the search form and fill in the required details.",
        payment: "You can pay securely using your credit card or other available payment methods.",
        cancel: "To cancel a booking, visit the 'Manage My Booking' section.",
        thanks: "You're welcome! Let me know if there's anything else I can help you with.",
        okay: "Alright! Let me know if you need further assistance.",
        default: "I'm afraid I can only answer travel-related questions. Is there anything else I can help you with?",
    };

    // Toggle the state of the chat interface (open/close)
    const handleToggle = () => setIsOpen(!isOpen);

    // Function to send user message and generate bot's response
    const handleSendMessage = () => {
        if (input.trim()) { // Check if input is not empty
            const timestamp = formatTimestamp(new Date());
            const userMessage = { sender: "user", text: input, timestamp };
            setMessages((prev) => [...prev, userMessage]);

            let botResponse = predefinedResponses.default;
            const lowerCaseInput = input.toLowerCase(); // Convert input to lowercase for comparison

            // Check if input matches any predefined responses
            if (lowerCaseInput.includes("hello") || lowerCaseInput.includes("hi")) {
                botResponse = predefinedResponses.greeting;
            } else if (lowerCaseInput.includes("book") || lowerCaseInput.includes("flight")) {
                botResponse = predefinedResponses.booking;
            } else if (lowerCaseInput.includes("pay") || lowerCaseInput.includes("payment")) {
                botResponse = predefinedResponses.payment;
            } else if (lowerCaseInput.includes("cancel") || lowerCaseInput.includes("cancelling") || lowerCaseInput.includes("cancellation")) {
                botResponse = predefinedResponses.cancel;
            } else if (lowerCaseInput.includes("thank") || lowerCaseInput.includes("thanks")) {
                botResponse = predefinedResponses.thanks;
            } else if (lowerCaseInput.includes("okay") || lowerCaseInput.includes("ok")) {
                botResponse = predefinedResponses.okay;
            }

            // Simulate a delay for bot response (e.g., thinking)
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: botResponse, timestamp: formatTimestamp(new Date()) },
                ]);
            }, 1000); // 1-second delay for bot response

            setInput(""); // Clear user input field after message is sent
        }
    };

    // Handle pressing the "Enter" key to send the message
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    useEffect(() => {
        // Scroll the last message into view whenever messages are updated
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]); // Run this effect whenever the messages array changes

    return (
        <div
            className={`fixed sm:bottom-4 sm:right-4 bottom-2 right-2 z-[10000] w-96 h-[30rem] max-w-[95%] max-h-full 
                ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
            `}
        >
            {/* Floating Help Icon (Only visible when the chat is closed) */}
            <div
                className={`absolute bottom-0 right-0 ${
                    isOpen ? "hidden" : "flex"
                } bg-[#48aadf] text-white w-12 h-12 rounded-full items-center justify-center cursor-pointer shadow-lg pointer-events-auto`}
                onClick={handleToggle} // Toggle the help chat interface
            >
                <MdOutlineComment />
            </div>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} // Initial animation for appearing
                        animate={{ opacity: 1, scale: 1 }} // Animation when it's fully visible
                        exit={{ opacity: 0, scale: 0.9 }} // Animation when exiting (closing)
                        transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
                        ref={helpRef}
                        className="bg-white w-full h-full rounded-lg shadow shadow-gray-400 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b">
                            <span className="font-semibold">Virtual Agent</span>
                            {/* Close button */}
                            <button
                                onClick={handleToggle}
                                className="text-[#48aadf] text-lg font-bold focus:outline-none"
                            >
                                <AiOutlineClose />
                            </button>
                        </div>

                        {/* Messages Section */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message for smooth scrolling
                                    className={`flex ${
                                        msg.sender === "bot" ? "justify-start" : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            msg.sender === "bot"
                                                ? "bg-blue-100 text-blue-900" // Bot messages styled differently
                                                : "bg-blue-500 text-white" // User messages styled differently
                                        } p-2 rounded-lg max-w-[75%]`}
                                    >
                                        <p>{msg.text}</p>
                                        <p className="text-xs text-black mt-1 text-right">
                                            {msg.timestamp} {/* Timestamp for each message */}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Section */}
                        <div className="flex items-center border-t border-gray-300 p-2 gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)} // Handle input changes
                                onKeyDown={handleKeyDown} // Send message on pressing Enter
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {/* Send Button */}
                            <div
                                className="hover:bg-blue-50 transition-all duration-500 ease-in-out rounded-full flex items-center justify-center cursor-pointer p-3"
                                onClick={handleSendMessage} // Send message on click
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