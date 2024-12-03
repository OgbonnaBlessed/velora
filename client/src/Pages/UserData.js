import React from 'react'
import { Link } from 'react-router-dom'

const UserData = () => {
  return (
    <div className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-24 pb-10'>
        <div className='font-semibold text-3xl'>User Data Deletion Policy</div>
        <div>
            At <Link to='/' className='text-[#48aadf]'>Velora</Link>, we respect your privacy and are committed to ensuring that your personal data is handled securely. In compliance with global privacy regulations, you have the right to request the deletion of your personal data.
        </div>

        <div>
            <div className='font-medium'>
                If you wish to delete your account and associated data from our platform, please follow these steps:
            </div>
            <ul className='list-disc pl-8'>
                <li>Request Deletion: Send an email to <Link className='text-[#48aadf]'>velora@info.com</Link> with the subject line "Data Deletion Request". Please include your full name and the email address associated with your account in the body of the email.</li>
    
                <li>Processing Your Request: Once we receive your request, we will verify your identity and proceed with the deletion of your data. This process can take up to 24 hours.</li>

                <li>Data Deletion Confirmation: After your data has been deleted, you will receive a confirmation email notifying you that your request has been successfully processed.</li>

                <li>Important Note: Please note that once your data is deleted, it cannot be recovered. Certain information may still be retained if required by law or for legitimate business purposes (e.g., financial or tax records).</li>
            </ul>
            For any additional questions or concerns, feel free to contact us at <Link className='text-[#48aadf]'>velora@info.com</Link>.
        </div>
    </div>
  )
}

export default UserData