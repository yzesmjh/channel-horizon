import { useLayoutEffect} from 'react';
import Aside from '../Components/Dashboard/Aside';
import Main from '../Components/User/SingleMain';
import useHeaderData from '../Hooks/useHeaderData';

const ViewSingleUsers = () => {
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

export default ViewSingleUsers;
