
import { useCallback, useEffect, useState } from 'react';
import Header from './../Dashboard/Header';
import axios from 'axios';
import {BaseUrl} from '../../../BaseUrl';

import DataComponent from '../DataComponent';
import Pagination from '../Pagination';
import useHeaderData from '../../Hooks/useHeaderData';
import { useParams } from 'react-router-dom';
import AccountDisplay from '../Dashboard/AccountDisplay';
import Footer from '../Dashboard/Footer';

const Main = () => {
    const { id } = useParams();

    const [transactions, setTransactions] = useState([])
    const { userInfo, token } = useHeaderData(); 
    const [selectedUser, setSelectedUser] = useState({})
    const [account, setAccount] = useState("0.00")
    const [userType, setUserType] = useState('USER')

 const fetchTransactions = useCallback( async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}transaction/getallTransactions?userId=${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setTransactions(response?.data?.data);
                } else {
                    setTransactions([]);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
        },[token, userInfo?._id])

 const fetchAccount = useCallback( async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}account/getaccountdetails?userId=${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setAccount(response?.data?.data?.balance);
                } else {
                    setAccount("0.00");
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
        },[token, id])

const fetchUser = useCallback( async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}users/getsingleuser?userId=${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setSelectedUser(response?.data?.data);
                } else {
                    setSelectedUser({});
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
        },[token, id])

  useEffect(() => {
        fetchTransactions();
        fetchUser()
        fetchAccount()
        if (userInfo?.role) {
            setUserType(userInfo?.role)
        }
    }, [fetchTransactions, fetchAccount, fetchUser, userInfo?.role]);
  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header user={users}/>

      <div className="w-full overflow-x-hidden border-t flex flex-col">
        <main className="w-full flex-grow p-6">
          <h1 className="text-3xl text-black pb-6">Transactions</h1>

                    <AccountDisplay amount={account} otherDetails={`${selectedUser.firstname} ${selectedUser.lastname}`}/>
          
          <div className="w-full mt-12">



            <div className="bg-white overflow-auto">
            {
              transactions.length <1 ? <h1 className='sm:p-10 p-5 sm:text-3xl text-lg'>No transactions found!</h1> :
              <Pagination
        data={transactions}
        RenderComponent={DataComponent}
        type={userType}
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
