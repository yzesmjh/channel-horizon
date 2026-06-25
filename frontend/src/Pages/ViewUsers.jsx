import React, { useEffect, useLayoutEffect } from 'react';
import Aside from '../Components/Dashboard/Aside';
import Main from '../Components/User/Main';
import useHeaderData from '../Hooks/useHeaderData';

const ViewUsers = () => {
const { userInfo } = useHeaderData(); 

  useLayoutEffect(() => {
    document.title = "users";
  }, []);

 
  return (
    <div className='bg-gray-100 font-family-karla flex'>
      <Aside user={userInfo}/>
      <Main/>
    </div>
  );
};

export default ViewUsers;
