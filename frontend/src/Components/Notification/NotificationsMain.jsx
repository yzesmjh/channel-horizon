
import useHeaderData from "../../Hooks/useHeaderData";
import Footer from "../Dashboard/Footer";
import Header from "../Dashboard/Header";
import DataTable from "../DataTable";

const NotificationsMain = () => {
 
    const { userInfo, token } = useHeaderData();
  const columns = [
    {
      Header: 'Date',
      accessor: 'name'
    },
    {
      Header: 'Open',
      accessor: 'age'
    },
    {
      Header: 'Title',
      accessor: 'location'
    }
  ];

  const data = [
    
  ];
    
    return (
      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <Header />
  
        <div className="w-full overflow-x-hidden flex flex-col ">
          <main className="w-full flex-grow p-5 ">
            
  
            <div className="w-full  bg-white rounded-xl p-5">
              <h1 className="text-red-600 font-bold mb-3">Notifications</h1>
              <hr/>
              <div className="text-center text-slate-300">Click the Plus button for more</div>
              <DataTable columns={columns} data={data} />
              <div className="text-slate-400 text-center">No data available</div>
            </div>

  
          
            
          </main>
        </div>
        <Footer />
      </div>
    );
  };

export default NotificationsMain