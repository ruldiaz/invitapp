import './App.css'
import { Login } from './components/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Profile } from './components/Profile';
import { Navbar } from './components/Navbar';

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Login />} path='/login' />
        <Route element={<Profile />} path='/profile' />
      </Routes>
    </BrowserRouter>
  )
}

export default App
