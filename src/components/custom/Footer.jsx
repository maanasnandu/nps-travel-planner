import React from 'react'

function Footer () {
  return (
    <>
      {/**rendering the children coming from App.jsx on top of Layout content */}

      <footer>
        <small className='justify-center'>Created By:</small>

        <a href='https://www.instagram.com/msn.omdlensman/' target='_blank'>
          <p className='justify-center'>Maanas Muddam</p>
        </a>

        {/* <small>Follow Me!</small>
        <a href='https://www.instagram.com/msn.omdlensman/' target='_blank'>
          <img
            className='w-8'
            src='https://itsmaanas.netlify.app/assets/hero-img-qXm_lMq0.png'
            alt='pfp'
          />
        </a> */}
      </footer>
    </>
  )
}

export default Footer
