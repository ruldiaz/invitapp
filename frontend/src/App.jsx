import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Landing } from './components/Landing/Landing';
import { Login } from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import { Logout } from './components/Logout/Logout';

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Landing />} path='/' />
        <Route element={<Login />} path='/login' />
        <Route element={<Logout />} path='/logout' ></Route>
        <Route element={<Profile />} path='/profile' />
        <Route element={<Register />} path='/register' />
      </Routes>
    </BrowserRouter>
  )
}

export default App
