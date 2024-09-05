import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
   <>
    <div>Navbar</div>
      <ul>
         <li><Link to='/login'>Login</Link></li>
      </ul>
   </>
  )
}
