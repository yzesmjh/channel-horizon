import { NavLink } from "react-router-dom";
import Modal from "../Modal";
import TransferForm from "../TransferForm";
import AddUserForm from "../AddUserForm";
import { ToastContainer } from "react-toastify";

const Aside = ({ user }) => {
  return (
    <aside className="relative bg-sidebar h-screen w-64 hidden sm:block bg-bankred shadow-xl">
      <div className="p-6">
        <NavLink
          to="/"
          className="text-white text-3xl font-semibold uppercase hover:text-gray-300"
        >
          {user?.firstname || "Admin"}
        </NavLink>
        <button className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          <i className="fas fa-plus mr-3"></i>

          <Modal
            caption={"Send Money"}
            captionButton={false}
            modalContent={<TransferForm />}
          />
        </button>
      </div>
      <nav className="text-white text-base font-semibold pt-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center py-4 pl-6 nav-item ${
              isActive ? "bg-purple-800" : "text-white"
            }`
          }
        >
          <i className="fas fa-tachometer-alt mr-3"></i>
          Dashboard
        </NavLink>
        <NavLink
          to="/invoice"
          className={({ isActive }) =>
            `flex items-center py-4 pl-6 nav-item ${
              isActive
                ? "bg-red-700"
                : "text-white opacity-75 hover:opacity-100"
            }`
          }
        >
          <i className="fas fa-sticky-note mr-3"></i>
          Invoice
        </NavLink>
        <NavLink
          to="/wallet"
          className={({ isActive }) =>
            `flex items-center py-4 pl-6 nav-item ${
              isActive
                ? "bg-red-700"
                : "text-white opacity-75 hover:opacity-100"
            }`
          }
        >
          <i className="fas fa-table mr-3"></i>
          Wallet
        </NavLink>
        <NavLink
          to="/transaction"
          className={({ isActive }) =>
            `flex items-center py-4 pl-6 nav-item ${
              isActive
                ? "bg-red-700"
                : "text-white opacity-75 hover:opacity-100"
            }`
          }
        >
          <i className="fas fa-align-left mr-3"></i>
          Transactions
        </NavLink>

        {user?.role == "ADMIN" && (
          <span>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center py-4 pl-6 nav-item ${
                  isActive
                    ? "bg-red-700"
                    : "text-white opacity-75 hover:opacity-100"
                }`
              }
            >
              <i className="fas fa-align-left mr-3"></i>
              View Users
            </NavLink>
            <button className="w-full bg-white cta-btn font-semibold text-black py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
              <i className="fas fa-plus mr-3"></i>

              <Modal
                caption={"Add New User"}
                captionButton={false}
                modalContent={<AddUserForm />}
              />
            </button>
          </span>
        )}

        <NavLink
          to="/logout"
          className={({ isActive }) =>
            `flex items-center py-4 pl-6 nav-item ${
              isActive
                ? "bg-red-700"
                : "text-white opacity-75 hover:opacity-100"
            }`
          }
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Sign Out
        </NavLink>
      </nav>
      <ToastContainer icon={false} position="top-right" />
    </aside>
  );
};

export default Aside;
