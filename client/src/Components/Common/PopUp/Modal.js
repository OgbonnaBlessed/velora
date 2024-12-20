import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-5"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                >
                    <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X />
                    </button>
                    </div>
                    <div className="mt-4">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default Modal;