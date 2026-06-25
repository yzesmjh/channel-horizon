
import { useCallback, useEffect, useState } from 'react';
import Header from './../Dashboard/Header';
import axios from 'axios';
import {BaseUrl} from '../../../BaseUrl';

import DataComponent from '../DataComponent';
import Pagination from '../Pagination';
import useHeaderData from '../../Hooks/useHeaderData';
import Footer from '../Dashboard/Footer';

const Main = () => {
 const sampleTransaction= [
    
]
    const [transactions, setTransactions] = useState(sampleTransaction)
    const { userInfo, token } = useHeaderData(); 
 const fetchTransactions = useCallback( async () => {
            try {
                if (userInfo) {
                  const response = await axios.get(
                    `${BaseUrl}transaction/getallTransactions?userId=${userInfo?._id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setTransactions(response?.data?.data);
                } else {
                    setTransactions(sampleTransaction);
                }
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
        },[token, userInfo?._id])

  useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);


  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header/>

      <div className="w-full overflow-x-hidden border-t flex flex-col">
        <main className="w-full flex-grow p-6">
          <h1 className="text-3xl text-black pb-6">Transactions</h1>

          
          <div className="w-full mt-12">
            
            <div className="bg-white overflow-auto">
            {
              transactions.length <1 ? <h1 className='sm:p-10 p-5 sm:text-3xl text-lg'>No transactions found!</h1> :
              <Pagination
        data={transactions}
        RenderComponent={DataComponent}
        title=""
        pageLimit={5}
        dataLimit={10}
      />
            }
              
            </div>
          </div>
          
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
