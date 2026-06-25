import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aside from '../Components/Dashboard/Aside';
import Main from '../Components/Transaction/Main';
import useHeaderData from '../Hooks/useHeaderData';

const Transaction = () => {
const { userInfo } = useHeaderData(); 

  useLayoutEffect(() => {
    document.title = "Access bk | Dashboard";
  }, []);

 
  return (
    <div className='bg-gray-100 font-family-karla flex'>
      <Aside user={userInfo}/>
      <Main/>
    </div>
  );
};

export default Transaction;
