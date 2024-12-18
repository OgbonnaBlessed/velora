import React from 'react'

const ClickToPay = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col gap-3 text-sm font-serif'>
        <div className="flex gap-4 items-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/master-card.png`}
            alt="Mastercard"
            className="w-12"
          />
          <img
            src="https://img.icons8.com/color/48/000000/visa.png"
            alt="Visa"
            className="h-12 w-12"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/verve.svg`}
            alt="Verve"
            className="w-16"
          />
        </div>
        <p>
          Click-to-Pay is a secure way to pay online, powered by the global payments industry.
        </p>
        <p>
          Add cards from participating networks to simply and securely use them wherever Click-to-Pay is supported.
        </p>
      </div>
    </div>
  )
}

export default ClickToPay
