import { useState } from "react";
import usericon from "./../../assets/Icons/userIcon.svg";
import LanguageDropdown from "./LanguageDropDown";
import userDefaultImage from "./../../assets/Images/user.png";
import BankLogo from "./../BankLogo";
import { Link } from "react-router-dom";
import useHeaderData from "../../Hooks/useHeaderData";

const Header = () => {
  const { userInfo } = useHeaderData();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
        <div className="w-1/2"></div>
        <div className="relative w-1/2 flex justify-end">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
          >
            <img src={usericon} alt="User avatar" />
          </button>
          {isDropdownOpen && (
            <>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="h-full w-full fixed inset-0 cursor-default"
              ></button>
              <div className="absolute w-32 bg-white rounded-lg shadow-lg py-2 mt-16">
                <a
                  href="/profile"
                  className="block px-4 py-2 account-link hover:text-bankred"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 account-link hover:text-bankred"
                >
                  Support
                </a>
                <a
                  href="/logout"
                  className="block px-4 py-2 account-link hover:text-bankred"
                >
                  Sign Out
                </a>
              </div>
            </>
          )}
        </div>
      </header>
      {/* Mobile Header & Nav */}
      <header className="w-full bg-bankred h-32 max-h-32 p-6 sm:hidden flex justify-between border-b-[1px] border-b-purple-400 items-center ">
        <div>
          <LanguageDropdown />
        </div>
        <div className="bg-white p-1 rounded-md">
          <BankLogo size={28} />
        </div>
        <Link to="/profile" className="flex  ">
          <div className="relative">
            <img
              src={`${userInfo?.profilePicx}` || userDefaultImage}
              alt="user profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="w-2 h-2 bg-bankred shadow-sm shadow-black rounded-full absolute top-0 right-0 z-10 mr-0 -mt-1"></div>
          </div>
        </Link>
      </header>
    </>
  );
};

export default Header;
