import {useLayoutEffect} from 'react';
import Aside from '../Components/Dashboard/Aside';
import useHeaderData from '../Hooks/useHeaderData';
import NotificationsMain from '../Components/Notification/NotificationsMain';

const Notification = () => {
const { userInfo } = useHeaderData(); 

  useLayoutEffect(() => {
    document.title = "Channel b...";
  }, []);

  return (
    <div className='bg-gray-100 font-family-karla flex'>
      <Aside user={userInfo}/>
      
      <NotificationsMain/>
    </div>
  );
};

export default Notification