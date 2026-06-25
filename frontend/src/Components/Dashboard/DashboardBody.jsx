import React, { useEffect, useState } from "react";
import CheckDeposit from "./CheckDeposit";
// import WireTransfer from "./WireTransfer";

import shareicon from "./../../assets/Icons/shareicon.png";
import cardicon from "./../../assets/Icons/card.png";
import userplus from "./../../assets/Icons/userplus.png";
import secondCard from "./../../assets/Icons/card2.png";
import bitcoin from "./../../assets/Icons/bitcoin.png";
import noteicon from "./../../assets/Icons/note.png";
import secondnote from "./../../assets/Icons/note2.png";
import statement from "./../../assets/Icons/message.png";
import cash from "./../../assets/Icons/cash.png";
import stat from "./../../assets/Icons/stat.png";
import chatIcon from "./../../assets/Icons/chatIcon.png";
import finduser from "./../../assets/Icons/finduser.png";
import ShowLoader from "./ShowLoader";
import { useNavigate } from "react-router-dom";
import AddUserForm from "../AddUserForm";
import LocalTransfer from "./Forms/LocalTransfer";
import AddBeneficiary from "./Forms/AddBeneficiary";
import WireTransfer from "./Forms/WireTransfer";

const DashboardBody = ({ screenSetter, user, account }) => {
  const navigate = useNavigate();
  const menubar = [
    { icon: shareicon, caption: "Local Transfer" },
    { icon: shareicon, caption: "Wire Transfer" },
    { icon: shareicon, caption: "Internal Transfer" },
    { icon: bitcoin, caption: "Buy Crypto" },
    { icon: cardicon, caption: "Pay Bill" },
    { icon: userplus, caption: "Add Beneficiary" },
    { icon: secondCard, caption: "Card Deposit" },
    { icon: bitcoin, caption: "Crypto Deposit" },
    { icon: cardicon, caption: "Check Deposit" },
    { icon: noteicon, caption: "Saving Statement" },
    { icon: secondnote, caption: "Checking Statement" },
    { icon: statement, caption: "Horizon Alert" },
    { icon: cash, caption: "Horizon Loans" },
    { icon: stat, caption: "Horizon Investments" },
    { icon: chatIcon, caption: "Horizon Support" },
  ];

  const adminMenubar = [
    { icon: userplus, caption: "Add User" },
    { icon: finduser, caption: "View Users" },
  ];

  // Function to chunk the array into groups of 3
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const groupedItems = chunkArray(menubar, 3);
  const [display, setDisplay] = useState("home");
  useEffect(() => {
    screenSetter(display);
  }, [display]);

  const [showLoader, setShowLoader] = useState(false);
  const displaySetter = (item) => {
    setDisplay(item);
    if (item == "View Users") {
      navigate("/users", {});
    }
    if (item == "Saving Statement" || item == "Checking Statement") {
      navigate("/mytransactions", {});
    }
    if (
      item != "Check Deposit" &&
      item != "Wire Transfer" &&
      item != "Add Beneficiary" &&
      item != "Local Transfer" &&
      item != "Internal Transfer" &&
      item != "Add User"
    ) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  };

  return (
    <div>
      {display != "Local Transfer" &&
        display != "Check Deposit" &&
        display != "Internal Transfer" &&
        display != "Add Beneficiary" &&
        display != "Wire Transfer" &&
        display != "Add User" && (
          <div className="w-full h-auto bg-white mb-[34px]">
            {user?.role === "ADMIN" && (
              <div className="grid grid-cols-3 gap-5 items-center">
                {adminMenubar.map((item, index) => (
                  <div
                    onClick={() => displaySetter(item.caption)}
                    key={index}
                    className="flex justify-center items-center flex-col"
                  >
                    <div
                      className="w-14 h-14 bg-gradient-to-b from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 rounded-lg p-4 flex justify-center items-center"
                    >
                      <img src={item.icon} />
                    </div>
                    <div className="text-xs">
                      {item.caption.split(" ").map((word, idx) => (
                        <p
                          key={idx}
                          className="text-center font-medium text-[10px]"
                        >
                          {word}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {groupedItems.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="border-b-[1px] border-black mb-5 p-2 bg-white"
              >
                <div className="grid grid-cols-3 gap-5 items-center">
                  {group.map((item, index) => (
                    <div
                      onClick={() => displaySetter(item.caption)}
                      key={index}
                      className="flex justify-center items-center flex-col"
                    >
                      <div className="w-14 h-14 bg-gradient-to-b from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 rounded-lg p-4 flex justify-center items-center">
                        <img src={item.icon} />
                      </div>
                      <p className="text-[10px]">
                        {item.caption.split(" ").map((word, idx) => (
                          <div key={idx} className="text-center font-medium">
                            {word}
                          </div>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      {display === "Wire Transfer" && (
        <div>
          <WireTransfer account={account} user={user} />
        </div>
      )}
      {(display === "Local Transfer" || display === "Internal Transfer") && (
        <div>
          <LocalTransfer account={account} user={user} />
        </div>
      )}
      {display === "Check Deposit" && (
        <div>
          <CheckDeposit />
        </div>
      )}
      {display === "Add User" && (
        <div>
          <AddUserForm />
        </div>
      )}
      {display === "Add Beneficiary" && (
        <div>
          <AddBeneficiary />
        </div>
      )}
      <ShowLoader showLoader={showLoader} setShowLoader={setShowLoader} />
    </div>
  );
};

export default DashboardBody;
