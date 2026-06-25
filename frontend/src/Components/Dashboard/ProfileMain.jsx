import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { BaseUrl } from "../../../BaseUrl";
import useHeaderData from "../../Hooks/useHeaderData";
import SimpleSlider from "./Slider";
import DashboardBody from "./DashboardBody";
import Footer from "./Footer";
import DebitCard from "./DebitCard";
import Benefitiary from "./Benefitiary";
import NationalTips from "./NationalTips";
import ProfileCard from "../Profile/ProfileCard";

const ProfileMain = () => {
  const defaultAccount = [
    {
      accountType: "checking",
      balance: "0.00",
      totalCredit: "0.00",
      totalDebit: "0.00",
      accountNumber: "480937206",
      _id: "66dda7218148f74c77d69b51",
    },
    {
      accountType: "savings",
      balance: "0.00",
      totalCredit: "0.00",
      totalDebit: "0.00",
      accountNumber: "757091838",
      _id: "66dda7218148f74c77d69b52",
    },
  ];
  const [accountBalance, setAccountBalance] = useState(defaultAccount);

  const { userInfo, token } = useHeaderData();

  const fetchAccountBalance = useCallback(async () => {
    try {
      if (userInfo) {
        const response = await axios.get(
          `${BaseUrl}account/getaccountdetails?userId=${userInfo?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setAccountBalance(response?.data?.data?.accounts);
        } else {
          setAccountBalance(defaultAccount);
        }
      }
    } catch (error) {
      console.error("Error fetching account balance:", error.message);
    }
  }, [token, userInfo?._id]);

  useEffect(() => {
    fetchAccountBalance();
  }, [fetchAccountBalance, userInfo?._id]);

  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header user={userInfo} />

      <div className="w-full overflow-x-hidden flex flex-col ">
        <main className="w-full flex-grow bg-indigo-600 ">
          <div className="w-full  bg-slate-100 rounded-t-xl p-5">
            <ProfileCard user={userInfo} account={accountBalance} />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default ProfileMain;
