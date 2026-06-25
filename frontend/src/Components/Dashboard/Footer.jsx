import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const menu = [
    { icon: "", caption: "Settings", link: "profile" },
    { icon: "", caption: "Notification", link: "notification" },
    { icon: "", caption: "Home", link: "" },
    { icon: "", caption: "Support", link: "support" },
    { icon: "", caption: "Pay Bill", link: "bill" },
    { icon: "", caption: "Logout", link: "logout" },
  ];
  return (
    <div className="bg-white  shadow-md shadow-black p-2 grid grid-cols-6 justify-between gap-5 fixed bottom-0">
      {menu.map((item, index) => (
        <Link to={`/${item?.link}`} key={index}>
          <li className="h-10 w-full col-span-1 border-t-2 border-t-bankredhover p-2 flex justify-center items-center">
            <div className="relative">{item.icon}</div>
            <p className="text-bankSmall text-nowrap text-bankredhover font-medium">
              {item.caption}
            </p>
          </li>
        </Link>
      ))}
    </div>
  );
};

export default Footer;
