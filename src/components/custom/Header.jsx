import React from 'react'

function Header () {
  return (
    <>
      <div className='p-3 shadow-sm flex items-center px-3'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/1/1d/US-NationalParkService-Logo.svg'
          alt='National Park Service Logo' // Added alt text for accessibility
          className='h-10 w-auto mr-2' // Added some styling for the logo: fixed height, auto width, and a right margin
        />

        {/* Added whitespace-nowrap to keep the text on a single line */}
        <span className='font-extrabold text-[#400406] whitespace-nowrap'>
          National Park Trip Planner
        </span>
      </div>
    </>
  )
}

export default Header
