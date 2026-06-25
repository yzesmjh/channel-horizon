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

const Main = () => {
  const [accountBalance, setAccountBalance] = useState([
    {
      accountType: "checking",
      balance: "0.00",
    },
    {
      accountType: "savings",
      balance: "0.00",
    },
  ]);
  const [transactions, setTransactions] = useState([]);
  const { userInfo, token } = useHeaderData();

  const fetchAccountBalance = useCallback(async () => {
    try {
      if (userInfo?._id) {
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
          setAccountBalance("0.00");
        }
      }
    } catch (error) {
      console.error("Error fetching account balance:", error.message);
    }
  }, [token, userInfo?._id]);

  const fetchTransactions = useCallback(async () => {
    try {
      if (userInfo?._id) {
        const response = await axios.get(
          `${BaseUrl}transaction/getallTransactions?userId=${userInfo?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setTransactions(response?.data?.accounts);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  }, [token, userInfo?._id]);

  useEffect(() => {
    fetchAccountBalance();
    fetchTransactions();
  }, [fetchTransactions, fetchAccountBalance, userInfo?._id]);

  const [currentScreen, setCurrentScreen] = useState("home");

  return (
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      <Header user={userInfo} />

      <div className="w-full overflow-x-hidden flex flex-col ">
        <main className="w-full flex-grow bg-bankred ">
          <div className="py-5">
            <SimpleSlider amount={accountBalance} user={userInfo} />
          </div>

          <div className="w-full  bg-white rounded-t-xl p-5">
            <DashboardBody
              screenSetter={setCurrentScreen}
              user={userInfo}
              account={accountBalance}
            />

            {currentScreen == "home" && (
              <>
                <Benefitiary />

                <DebitCard user={userInfo} />
                <NationalTips />
              </>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Main;
