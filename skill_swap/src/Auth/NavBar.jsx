import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const NavBar = () => {
    const navigate=useNavigate()
  return (
    <div className='w-full absolute top-0 flex justify-between p-4 sm:p-6 sm:px-14 '>

        <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
        <button onClick={()=>navigate('/login')}
        
        className='flex items-center rounded-full border border-gray-500 px-6 py-2 gap-2 text-gray-800 hover:bg-gray-100 hover:cursor-pointer'>Login <img src={assets.arrow_icon} alt="" /></button>
    </div>
  )
}

export default NavBar