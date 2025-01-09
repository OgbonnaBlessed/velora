import React from 'react'  // Import React library
import { Link } from 'react-router-dom'  // Import Link component from React Router for navigation
import { motion } from 'framer-motion'  // Import motion component from framer-motion for animation effects

const UserData = () => {  // Declare the UserData functional component
  return (
    <motion.div  // Use motion.div to animate the component using framer-motion
        initial={{ opacity: 0 }}  // Initial state of the component before animation
        animate={{ opacity: 1 }}  // Final state of the component after animation
        exit={{ opacity: 0 }}  // State when the component exits (fade out)
        transition={{
            duration: .5,  // Duration of the animation (0.5 seconds)
            ease: "easeInOut"  // Easing function for smooth transition
        }}
        className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-24 pb-10 bg-white'  // Tailwind classes for layout and styling
    >
        {/* Main Title */}
        <div className='font-semibold text-3xl'>User Data Deletion Policy</div>

        {/* Introduction paragraph explaining the privacy and data deletion policy */}
        <div>
            At <Link to='/' className='text-[#48aadf]'>Velora</Link>, we respect your privacy and are committed to ensuring that your personal data is handled securely. In compliance with global privacy regulations, you have the right to request the deletion of your personal data.
        </div>

        {/* Section explaining the steps to delete user data */}
        <div>
            <div className='font-medium'>
                If you wish to delete your account and associated data from our platform, please follow these steps:
            </div>
            
            {/* Bullet point list explaining the steps for data deletion */}
            <ul className='list-disc pl-8'>  
                {/* Step 1: Request Deletion */}
                <li>
                    Request Deletion: Send an email to <Link className='text-[#48aadf]'>velora@info.com</Link> with the subject line "Data Deletion Request". Please include your full name and the email address associated with your account in the body of the email.
                </li>
    
                {/* Step 2: Processing the request */}
                <li>
                    Processing Your Request: Once we receive your request, we will verify your identity and proceed with the deletion of your data. This process can take up to 24 hours.
                </li>

                {/* Step 3: Confirmation of Data Deletion */}
                <li>
                    Data Deletion Confirmation: After your data has been deleted, you will receive a confirmation email notifying you that your request has been successfully processed.
                </li>

                {/* Step 4: Important Note on Data Deletion */}
                <li>
                    Important Note: Please note that once your data is deleted, it cannot be recovered. Certain information may still be retained if required by law or for legitimate business purposes (e.g., financial or tax records).
                </li>
            </ul>

            {/* Contact information for further inquiries */}
            For any additional questions or concerns, feel free to contact us at <Link className='text-[#48aadf]'>velora@info.com</Link>.
        </div>
    </motion.div>
  )
}

export default UserData  // Export the UserData component to be used in other parts of the app