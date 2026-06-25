import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {BaseUrl} from '../../BaseUrl';
import axios from 'axios';
import useHeaderData from '../Hooks/useHeaderData';

import { toast } from 'react-toastify';

const Logout = () => {
const { userInfo } = useHeaderData(); 

    const navigate = useNavigate();

    const logoutHandler = async () => {
     sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        try {
            const response = await axios.post(`${BaseUrl}users/logout`, {userId:userInfo._id});
            //clearsession
            // Delete the session item
           
            console.log(response);
            //redirect here

            toast.success("You have been signed out successfully")
            setTimeout(() => {
                 navigate("/login", {
                state: {
                    message: "Signed out successful"
                },
                replace: true,
            });
            }, 1000);

        } catch (error) {
            //error

            toast.success("You have been signed out successfully")
            setTimeout(() => {
                 navigate("/login", {
                state: {
                    message: "Signed out successful"
                },
                replace: true,
            });
            }, 1000);
        }
    };

useEffect(() => {
    logoutHandler();
}, [])


  return (
    <div></div>
  )
}

export default Logout