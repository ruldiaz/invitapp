import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';

export const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }, []);

    const onFormSubmit = async (event) => {
      event.preventDefault();
  
      if (!email || !password) {
        setErrorMessage('Incomplete form. All fields required.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            password,
          })
        });
  
        const { msg, redirectTo } = await response.json();
  
        if (response.ok) {
          dispatch(loginSuccess());
          sessionStorage.setItem('isAuthenticated', true);
          navigate('/profile');
        } else {
          setErrorMessage(`Failed to login. ${msg ? msg : `Unknown error.`}`);
        }
      } catch (error) {
        setErrorMessage(error?.message || 'Failed to login.');
      }
    };

  return (
   <>
   <div className='login-component'>
    <h1>Node.js Passport Auth App</h1>
    <h2>Enter your details to login</h2>
    <form onSubmit={onFormSubmit}>

         <label htmlFor="email">Email</label>
         <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

         <label htmlFor="password">Password</label>
         <input type="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

         <div id="error-message">{errorMessage}</div>

         <button type="submit" id="login-button">
            Login
         </button>
         <button onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}>
            Google Sign in
         </button>


         <p className="form-toggle">Don't have an auth app account?
            <a href="/register">Register</a>
         </p>
    </form>
    </div>
   </>
  )
}
