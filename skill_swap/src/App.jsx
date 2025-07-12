import React from 'react'
import {Routes,Route} from 'react-router-dom'
import{ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Home from '../src/Auth/Home.jsx'
import Login from "../src/Auth/Login.jsx"
import VerifyEmail from "../src/Auth/EmailVerify.jsx"
import ResetPassword from "../src/Auth/ResetPassword.jsx"



const App = () => {
  return (
    
    <>
    <ToastContainer/>
    <Routes>

      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/emailverify' element={<VerifyEmail/>}/>
      <Route path='/resetpassword' element={<ResetPassword/>}/>
    </Routes>
    </>
  )
}

export default App