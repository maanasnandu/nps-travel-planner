import React from 'react'

function Header () {
  return (
    <>
      <div className='p-3 shadown-sm flex  items-center px-3 w-20'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/1/1d/US-NationalParkService-Logo.svg'
          alt=''
        />

        <span className=' flex font-extrabold text-[#400406]'>
          National Park Trip Planner
        </span>
      </div>
    </>
  )
}

export default Header
