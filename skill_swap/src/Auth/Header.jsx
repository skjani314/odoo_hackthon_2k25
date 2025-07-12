import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../Context/AppContext'

const Header = () => {

  let {userData}=useContext(AppContent)
  return (
    <div className='flex flex-col mt-20 items-center px-4 text-center text-gray-800 '>
        
        <img src={assets.header_img} alt=""  className='w-36 h-36 mb-6 rounded-full '/>
        <h1 className='flex flex-row gap-4 items-center text-xl sm:text-3xl font-medium mb-2'>Hey {userData?userData.name:'Developer'} <img src={assets.hand_wave} alt="" className='w-8 aspect-square'/></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-2'>Welcome to our app</h2>
        <p className='mb-8 max-w-md mt-10'>Lets start with a quick product tour and we will have you up and running in no time</p>
        <button className='px-8 py-2.5 border border-gray-800 text-gray-600 rounded-full hover:bg-gray-200 cursor-pointer'>Get Started</button>
    </div>
  )
}

export default Header