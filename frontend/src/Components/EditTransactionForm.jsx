import { useFormik } from "formik";
import * as Yup from "yup";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { BaseUrl } from "./../../BaseUrl";
import { toast } from "react-toastify";
import useHeaderData from "../Hooks/useHeaderData";

const EditTransactionForm = ({ data }) => {
  const { token } = useHeaderData();

  const formik = useFormik({
    initialValues: {
      transactionName: data?.transactionName || "",
      transactionStatus: data?.transactionStatus || "",
      transactionDate: data?.transactionDate || "",
      bankName: data?.bankName || "",
      receiverName: data?.receiverName || "",
      transactionAmount: data?.transactionAmount || "",
      transactionType: data?.transactionType || "",
      transactionId: data?._id || "",
    },
    validationSchema: Yup.object({
      transactionName: Yup.string().required("Transaction name is required"),
      transactionDate: Yup.string().required("Transaction date is required"),
      bankName: Yup.string().required("Bank name is required"),
      receiverName: Yup.string().required("Receiver name is required"),
      transactionAmount: Yup.string().required(
        "Transaction amount is required"
      ),
      transactionType: Yup.string().required("Transaction type is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        const response = await axios.post(
          `${BaseUrl}transaction/updatesingletransaction`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.responseMessage);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.warn(response.data.responseMessage);
        }
      } catch (error) {
        setFieldError("apiresponse", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full lg:full mt-6 pl-0 lg:pl-2">
      <div className="leading-loose text-left">
        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Transaction Name
            </label>
            <select
              id="transactionName"
              name="transactionName"
              {...formik.getFieldProps("transactionName")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            >
              <option value="Deposit">Deposit</option>
              <option value="Transfer">Transfer</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
            {formik.touched.transactionName &&
              formik.errors.transactionName && (
                <div className="text-red-600 text-sm">
                  {formik.errors.transactionName}
                </div>
              )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Transaction Status
            </label>
            <select
              id="transactionStatus"
              name="transactionStatus"
              {...formik.getFieldProps("transactionStatus")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="canceled">Canceled</option>
              <option value="in progress">In Progress</option>
            </select>
            {formik.touched.transactionStatus &&
              formik.errors.transactionStatus && (
                <div className="text-red-600 text-sm">
                  {formik.errors.transactionStatus}
                </div>
              )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Transaction Date
            </label>
            <input
              id="transactionDate"
              name="transactionDate"
              type="date"
              {...formik.getFieldProps("transactionDate")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.transactionDate &&
              formik.errors.transactionDate && (
                <div className="text-red-600 text-sm">
                  {formik.errors.transactionDate}
                </div>
              )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Bank Name
            </label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              {...formik.getFieldProps("bankName")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.bankName && formik.errors.bankName && (
              <div className="text-red-600 text-sm">
                {formik.errors.bankName}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Receiver Name
            </label>
            <input
              id="receiverName"
              name="receiverName"
              type="text"
              {...formik.getFieldProps("receiverName")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.receiverName && formik.errors.receiverName && (
              <div className="text-red-600 text-sm">
                {formik.errors.receiverName}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Transaction Amount
            </label>
            <input
              id="transactionAmount"
              name="transactionAmount"
              type="number"
              {...formik.getFieldProps("transactionAmount")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.transactionAmount &&
              formik.errors.transactionAmount && (
                <div className="text-red-600 text-sm">
                  {formik.errors.transactionAmount}
                </div>
              )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Transaction Type
            </label>
            <select
              id="transactionType"
              name="transactionType"
              {...formik.getFieldProps("transactionType")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            >
              <option value="">Select an Option</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
            {formik.touched.transactionType &&
              formik.errors.transactionType && (
                <div className="text-red-600 text-sm">
                  {formik.errors.transactionType}
                </div>
              )}
          </div>

          {formik.errors.apiresponse && (
            <div className="text-red-600 text-sm mt-0">
              {formik.errors.apiresponse}
            </div>
          )}

          {formik.isSubmitting ? (
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
              Edit Transaction
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditTransactionForm;
