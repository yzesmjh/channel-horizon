import React, { useEffect, useLayoutEffect, useState } from 'react';
import Aside from '../Components/Dashboard/Aside';
import InvoiceMain from '../Components/Invoice/InvoiceMain';
import useHeaderData from '../Hooks/useHeaderData';

const Invoice = () => {

const { userInfo } = useHeaderData(); 

  useLayoutEffect(() => {
    document.title = "Access bk | Dashboard";
  }, []);


console.log(userInfo);
  return (
    <div className='bg-gray-100 font-family-karla flex'>
      <Aside user={userInfo}/>
      <InvoiceMain/>
    </div>
  );
};

export default Invoice;
