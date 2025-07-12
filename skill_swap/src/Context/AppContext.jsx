import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
export const AppContent=createContext();



export const AppContextProvider=(props)=>
{
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    let [IsLoggedin,setIsLoggedIn]=useState(false)
    let [userData,setUserData]=useState(false)

    const getUserData=async()=>
    {
        try {
            
            const {data}=await axios.get(backendUrl + '/api/user/data',
            )
            console.log(data)
            data.success?console.log(data.name):toast.error(data.message);
        } catch (error) {
            toast.error(data.message)
        }
    }

    const value={
        backendUrl,
        IsLoggedin,setIsLoggedIn,
        userData,
        setUserData,
        getUserData


    }
        return( <AppContent.Provider  value={value}>
            {props.children}
         </AppContent.Provider>)
}