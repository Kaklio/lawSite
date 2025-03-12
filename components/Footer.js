import React from 'react'

const Footer = () => {
  return (
      <footer className='purple-bg text-white text-center border-t-2 border-t-amber-50'>
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </p>
      </footer>
  )
}
export default Footer
