import {useLayoutEffect} from 'react';
import Aside from '../Components/Dashboard/Aside';
import Main from '../Components/Dashboard/Main';
import useHeaderData from '../Hooks/useHeaderData';

const MyDashboard = () => {
const { userInfo } = useHeaderData(); 



  useLayoutEffect(() => {
    document.title = "Channel b....";
  }, []);

  return (
    <div className='bg-gray-100 font-family-karla flex'>
      <Aside user={userInfo}/>
      
      <Main/>
    </div>
  );
};

export default MyDashboard