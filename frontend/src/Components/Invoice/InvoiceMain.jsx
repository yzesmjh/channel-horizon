
import { useEffect, useState } from 'react';
import Header from './../Dashboard/Header';
import axios from 'axios';
import {BaseUrl} from '../../../BaseUrl';
import NotFound from '../NotFound'
import useHeaderData from '../../Hooks/useHeaderData';
import Footer from '../Dashboard/Footer';

const InvoiceMain = () => {

  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header/>

      <div className="w-full overflow-x-hidden border-t flex flex-col">
        <main className="w-full flex-grow p-6">
          <h1 className="text-3xl text-black pb-6">Invoice</h1>
      <NotFound title="Resources"/>
          
      <Footer />
        </main>
        
      </div>
    </div>
  );
};

export default InvoiceMain;
