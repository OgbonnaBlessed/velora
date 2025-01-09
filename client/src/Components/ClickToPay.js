import React from 'react' 
// Importing React to create a functional component. This allows us to use JSX syntax for defining UI components.

const ClickToPay = () => { 
  // Defining a functional component named 'ClickToPay'.
  
  return (
    // Returning JSX that defines the UI structure of the component.

    <div className='flex flex-col'>
      {/* 
        Outer container: 
        - Uses Tailwind CSS utility classes.
        - 'flex' applies Flexbox for layout.
        - 'flex-col' sets the Flexbox direction to column.
      */}

      <div className='flex flex-col gap-3 text-sm font-serif'>
        {/* 
          Inner container:
          - 'gap-3' adds spacing between child elements.
          - 'text-sm' sets the font size to small.
          - 'font-serif' applies a serif font style to the text.
        */}

        <div className="flex gap-4 items-center">
          {/*
            Horizontal container for card images:
            - 'flex' arranges the child elements (images) horizontally.
            - 'gap-4' adds spacing between the images.
            - 'items-center' vertically aligns the items to the center.
          */}

          <img
            src={`${process.env.PUBLIC_URL}/images/master-card.png`}
            alt="Mastercard"
            className="w-12"
          />
          {/* 
            Mastercard image:
            - 'src' dynamically sets the image path using the 'PUBLIC_URL' environment variable.
            - 'alt' provides alternative text for accessibility.
            - 'className="w-12"' sets the width of the image to 3rem (48px).
          */}

          <img
            src="https://img.icons8.com/color/48/000000/visa.png"
            alt="Visa"
            className="h-12 w-12"
          />
          {/* 
            Visa image:
            - 'src' uses an external URL to fetch the Visa logo.
            - 'alt' ensures accessibility for screen readers.
            - 'h-12 w-12' sets both height and width to 3rem (48px) for uniform size.
          */}

          <img
            src={`${process.env.PUBLIC_URL}/images/verve.svg`}
            alt="Verve"
            className="w-16"
          />
          {/* 
            Verve image:
            - 'src' dynamically sets the path for the Verve logo.
            - 'alt' ensures the image is accessible for users with visual impairments.
            - 'w-16' sets the width to 4rem (64px), making this image slightly larger than the others.
          */}
        </div>

        <p>
          Click-to-Pay is a secure way to pay online, powered by the global payments industry.
        </p>
        {/* 
          Paragraph explaining what Click-to-Pay is:
          - Default HTML <p> tag used for text.
          - Inherits the styling (e.g., 'text-sm font-serif') from the parent container.
        */}

        <p>
          Add cards from participating networks to simply and securely use them wherever Click-to-Pay is supported.
        </p>
        {/* 
          Second paragraph providing more details about using Click-to-Pay:
          - Similar structure and styling to the first paragraph.
        */}
      </div>
    </div>
  )
}

export default ClickToPay
// Exporting the 'ClickToPay' component as the default export so it can be imported and used in other files.