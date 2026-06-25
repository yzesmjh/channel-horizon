import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { BaseUrl } from "../../../../BaseUrl";
import LoaderModal from "../Modals/LoaderModal";
import useHeaderData from "../../../Hooks/useHeaderData";
import { useNavigate } from "react-router-dom";

const LocalTransfer = ({
  account,
  user,
  transactionMode = "local transfer",
}) => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [balanceError, setBalanceError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { token } = useHeaderData();
  const [tansferDetails, setTansferDetails] = useState({});
  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^\d+$/, "Account Number must be digits"),
    routineNumber: Yup.string()
      .required("Routine Number is required")
      .matches(/^\d+$/, "Routine Number must be digits"),
    accountType: Yup.string().required("Account Type is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be a positive number")
      .test("balance-check", "Amount exceeds balance", function (value) {
        const { accountType } = this.parent;
        const selectedAccount = account.find(
          (acc) => acc.accountType === accountType
        );
        return selectedAccount
          ? value <= parseFloat(selectedAccount.balance)
          : true;
      }),
    remarks: Yup.string(),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Get selected account type and its balance
    const selectedAccount = account.find(
      (acc) => acc.accountType === values.accountType
    );
    if (
      selectedAccount &&
      values.amount > parseFloat(selectedAccount.balance)
    ) {
      setBalanceError("Amount exceeds the account balance");
      setSubmitting(false);
    } else {
      setBalanceError("");
      setIsPinModalOpen(true);
      setSelectedAccount(selectedAccount);
      setTansferDetails(values);
      resetForm();
    }
  };
  const [matchedPin, setMatchedPin] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const handlePinSubmit = async (values) => {
    // Check if the input pin matches any stored pin
    const foundPin = user.transactionPin.find(
      (item) => item.pin === values.pin
    );
    setMatchedPin(foundPin); // Set matched pin to state

    if (!foundPin) {
      setShowLoader(false); // Hide loader when done
      toast.warn("Wrong Pin"); // Show warning message
      return; // Exit if PIN doesn't match
    }
    try {
      const responds = await axios.put(
        BaseUrl + "transaction/createtransaction",
        {
          transactionMode,
          transactionName: "Transfer",
          transactionStatus: "completed",
          bankName: tansferDetails?.bankName,
          receiverName: tansferDetails.accountName,
          transactionAmount: parseFloat(tansferDetails.amount),
          transactionType: "Debit",
          userId: user._id,
          accountName: tansferDetails.accountName,
          accountNumber: tansferDetails.accountNumber,
          routineNumber: tansferDetails.routineNumber,
          accountType: tansferDetails.accountType,
          remarks: tansferDetails.remarks,
          // Add other form values here as needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowLoader(true);
      setTimeout(() => {
        openModal();
      }, 8000);
      setIsPinModalOpen(false);
      setIsSubmittingForm(false);
      //clear form if transaction is successful
      if (responds.status == 200) {
        resetForm(); // Reset form after successful submission
      }
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error sending money", error);
      toast.warn("Failed to send money");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  //modal
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    window.location.reload(); // This will reload the current page
  };

  return (
    <>
      {/* Formik for the main form */}
      <Formik
        initialValues={{
          accountName: "",
          bankName: "",
          accountNumber: "",
          routineNumber: "",
          accountType: "",
          amount: "",
          remarks: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 mb-14">
            <div>
              <label htmlFor="accountName">Account Name</label>
              <Field
                id="accountName"
                name="accountName"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="accountName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="bankName">Bank Name</label>
              <Field
                id="bankName"
                name="bankName"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="bankName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="accountNumber">Account Number</label>
              <Field
                id="accountNumber"
                name="accountNumber"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="accountNumber"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="routineNumber">Routine Number</label>
              <Field
                id="routineNumber"
                name="routineNumber"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="routineNumber"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="accountType">Account Type</label>
              <Field
                as="select"
                id="accountType"
                name="accountType"
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Select Account Type</option>
                {account.map((item, index) => (
                  <option key={index} value={item.accountType}>
                    {item.accountType} (Balance: {item.balance})
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="accountType"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <Field
                id="amount"
                name="amount"
                type="number"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500"
              />
              {balanceError && (
                <div className="text-red-500 mt-1">{balanceError}</div>
              )}
            </div>
            <div>
              <label htmlFor="remarks">Remarks</label>
              <Field
                id="remarks"
                name="remarks"
                as="textarea"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="remarks"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Transfer Button */}
            {isSubmittingForm ? (
              <button
                disabled
                className="flex justify-center items-center w-full text-white bg-gradient-to-r from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
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
                Transfer
              </button>
            )}
          </Form>
        )}
      </Formik>

      {/* Transfer PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Enter Transfer PIN</h2>
            <Formik
              initialValues={{ pin: "" }}
              validationSchema={Yup.object({
                pin: Yup.string()
                  .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
                  .required("PIN is required"),
              })}
              onSubmit={handlePinSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="pin"
                      maxLength="4"
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter 4-digit PIN"
                    />
                    <ErrorMessage
                      name="pin"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded-md"
                      onClick={() => setIsPinModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 text-white rounded-md"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Submit"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <ToastContainer />
        </div>
      )}

      {/* modal */}
      <div className="flex justify-center items-center h-screen p-5">
        {/* Button to trigger modal */}

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-5">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                {/* Conditional Emoji */}
                <div className="text-6xl mb-4">
                  {matchedPin.status === "hold" && "⏳"}{" "}
                  {/* Hourglass for "onHold" */}
                  {matchedPin.status === "success" && "✅"}
                  {/* Party popper for "Successful" */}
                  {matchedPin.status === "failed" && "❌"}{" "}
                  {/* Cross mark for "Failed" */}
                </div>

                {/* Conditional Message */}
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  Transaction
                  {matchedPin.status === "hold" && " on Hold"}
                  {matchedPin.status === "success" && " Successful"}
                  {matchedPin.status === "failed" && " Failed"}
                </h2>

                {/* Conditional Description */}
                <p className="text-gray-700 mb-6">
                  {matchedPin.status === "hold" &&
                    "Your transaction is currently on hold. Please wait for confirmation."}
                  {matchedPin.status === "success" &&
                    "Your transaction was successful."}
                  {matchedPin.status === "failed" &&
                    "Sorry, we weren't able to complete your payment at this time. Please try again later. If the issue persists, contact customer service."}
                  {matchedPin.status === "custom" && user.message}
                </p>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-bankredhover"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Show loader */}
      {showLoader == true && (
        <LoaderModal showLoader={showLoader} setShowLoader={setShowLoader} />
      )}
    </>
  );
};

export default LocalTransfer;
