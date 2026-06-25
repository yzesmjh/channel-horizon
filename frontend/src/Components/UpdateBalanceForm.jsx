import { useFormik } from "formik";
import * as Yup from "yup";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import { toast, ToastContainer } from "react-toastify";
import useHeaderData from "../Hooks/useHeaderData";
import { useCallback, useEffect, useState } from "react";

const UpdateBalanceForm = ({ data }) => {
  const { token } = useHeaderData();
  const [loading, setLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAccountLoading, setIsAccountLoading] = useState(false);

  // Fetch Account Balance
  const fetchAccountBalance = useCallback(async () => {
    try {
      if (token) {
        setIsAccountLoading(true);
        const response = await axios.get(
          `${BaseUrl}account/getaccountdetails?userId=${data?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setAccountBalance(response?.data?.data?.accounts);
          setSelectedAccount(response?.data?.data?.accounts[0]); // Set the first account as the default
        }
      }
    } catch (error) {
      console.error("Error fetching account balance:", error.message);
    } finally {
      setIsAccountLoading(false);
    }
  }, [token, data?._id]);

  useEffect(() => {
    fetchAccountBalance();
  }, [fetchAccountBalance]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountType: selectedAccount?.accountType || "",
      amount: selectedAccount?.balance || "",
      totalCredit: selectedAccount?.totalCredit || "",
      totalDebit: selectedAccount?.totalDebit || "",
      userId: data?._id,
    },
    validationSchema: Yup.object({
      accountType: Yup.string().required("Account Type is required"),
      amount: Yup.string().required("Amount is required"),
      totalCredit: Yup.string().required("Total Credit is required"),
      totalDebit: Yup.string().required("Total Debit is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${BaseUrl}account/updatesingleAccount`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.responseMessage);
          resetForm();
        } else {
          toast.warn(response.data.responseMessage);
        }
      } catch (error) {
        setFieldError("apiresponse", error.message);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  // Handle account type change and update the form fields with corresponding account data
  const handleAccountTypeChange = (event) => {
    const accountType = event.target.value;
    const account = accountBalance.find(
      (acc) => acc.accountType === accountType
    );
    setSelectedAccount(account);

    // Update formik fields based on selected account
    formik.setValues({
      accountType: account?.accountType || "",
      amount: account?.balance || "",
      totalCredit: account?.totalCredit || "",
      totalDebit: account?.totalDebit || "",
      userId: data?._id,
    });
  };

  return (
    <div className="w-full lg:full mt-6 pl-0 lg:pl-2">
      <div className="leading-loose text-left">
        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formik.values.accountType}
              onChange={handleAccountTypeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            >
              {isAccountLoading ? (
                <option>loading</option>
              ) : (
                accountBalance.map((acc) => (
                  <option key={acc._id} value={acc.accountType}>
                    {acc.accountType.charAt(0).toUpperCase() +
                      acc.accountType.slice(1)}
                  </option>
                ))
              )}
            </select>
            {formik.touched.accountType && formik.errors.accountType && (
              <div className="text-red-600 text-sm">
                {formik.errors.accountType}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="text"
              {...formik.getFieldProps("amount")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-600 text-sm">{formik.errors.amount}</div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Total Credit
            </label>
            <input
              id="totalCredit"
              name="totalCredit"
              type="text"
              {...formik.getFieldProps("totalCredit")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.totalCredit && formik.errors.totalCredit && (
              <div className="text-red-600 text-sm">
                {formik.errors.totalCredit}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Total Debit
            </label>
            <input
              id="totalDebit"
              name="totalDebit"
              type="text"
              {...formik.getFieldProps("totalDebit")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.totalDebit && formik.errors.totalDebit && (
              <div className="text-red-600 text-sm">
                {formik.errors.totalDebit}
              </div>
            )}
          </div>

          {formik.errors.apiresponse && (
            <div className="text-red-600 text-sm mt-0">
              {formik.errors.apiresponse}
            </div>
          )}

          {loading ? (
            <button
              disabled
              className="flex justify-center items-center w-full text-white bg-red-400 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              <ThreeCircles
                height="25"
                width="25"
                radius="5"
                color="#ffffff"
                ariaLabel="three-circles-loading"
              />
            </button>
          ) : (
            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Edit Account Balance
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateBalanceForm;
