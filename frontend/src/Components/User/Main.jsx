
import { useCallback, useEffect, useState } from 'react';
import Header from '../Dashboard/Header';
import axios from 'axios';
import {BaseUrl} from '../../../BaseUrl';
import UserPagination from '../UserPagination';
import useHeaderData from '../../Hooks/useHeaderData';
import UserDataComponent from '../UserDataComponent';
import Footer from '../Dashboard/Footer';

const Main = () => {

    const [users, setUsers] = useState([])
    const { userInfo, token } = useHeaderData(); 
    
 const fetchUsers = useCallback( async () => {
            if(token){
              try {
                const response = await axios.get(
                    `${BaseUrl}users/getallusers`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setUsers(response?.data?.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
            }
        },[token, userInfo?._id])

  useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    

  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header/>

      <div className="w-full overflow-x-hidden border-t flex flex-col">
        <main className="w-full flex-grow p-6">
          <h1 className="text-3xl text-black pb-6">Users</h1>

          
          <div className="w-full mt-12">
            
            <div className="bg-white overflow-auto">
            {
              users?.length <1 ? <h1 className='sm:p-10 p-5 sm:text-3xl text-lg'>No user found!</h1> :
              <UserPagination
        data={users}
        RenderComponent={UserDataComponent}
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
