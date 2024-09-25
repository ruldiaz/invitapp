import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthState } from '../../redux/authSlice';
import './Navbar.css';


export const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        dispatch(setAuthState(data.isAuthenticated));
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <nav className="navbar">
      <ul>
        <li><Link to='/'>| Home |</Link></li>
        <li><Link to='/catalog'>Catalog</Link></li>
        {!isAuthenticated && (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Register</Link></li>
          </>
        )}
        {isAuthenticated && (
          <>
            <li><Link to='/wedding'>Wedding</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
            <li><Link to='/logout'>Logout</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};
