import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaDollarSign,
  FaEdit,
  FaList,
  FaLocationArrow,
  FaLock,
  FaPinterest,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import useHeaderData from "../../../Hooks/useHeaderData";
import LoaderModal from "../Modals/LoaderModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BaseUrl } from "../../../../BaseUrl";

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  beneficiaryName: Yup.string().required("Beneficiary name is required"),
  iban: Yup.string().required("IBAN/Account Number is required"),
  bank: Yup.string().required("Bank is required"),
  swiftCode: Yup.string().required("Swift Code is required"),
  RoutingTransitNumber: Yup.string().required(
    "Routing Transit Number is required"
  ),
  PIN: Yup.string().required("PIN is required"),
});

const WireTransfer = ({ account, user }) => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [tansferDetails, setTansferDetails] = useState({});

  const { token } = useHeaderData();
  const navigate = useNavigate();

  const initialValues = {
    amount: "",
    beneficiaryName: "",
    iban: "",
    bank: "",

    swiftCode: "",
    RoutingTransitNumber: "",
    PIN: "",
    BankAddress: "", // Optional field
    Remarks: "", // Optional field
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setIsPinModalOpen(true);
    setSelectedAccount(values);
    setSubmitting(false);
    setTansferDetails(values);
  };

  const [showLoader, setShowLoader] = useState(false);
  const [matchedPin, setMatchedPin] = useState(false);
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
      setIsSubmittingForm(true);

      const responds = await axios.put(
        BaseUrl + "transaction/createtransaction",
        {
          transactionMode: "Transfer",
          transactionName: "Transfer",
          transactionStatus: "completed",
          bankName: tansferDetails?.bank,
          receiverName: tansferDetails.beneficiaryName,
          transactionAmount: parseFloat(tansferDetails.amount),
          transactionType: "Debit",
          userId: user._id,
          accountName: tansferDetails.accountName,
          accountNumber: tansferDetails.swiftCode,
          routineNumber: tansferDetails.RoutingTransitNumber,
          accountType: tansferDetails.accountType,
          remarks: tansferDetails.Remarks,
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

  // Modal management
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    window.location.reload(); // This will reload the current page
  };

  return (
    <>
      <div className="mb-20">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="p-2 bg-red-700 text-red-50 font-medium">
                Wire Transfer
              </div>
              <p className="text-sm text-red-700 py-2 border-y-[1px]">
                <span className="font-bold">National Secure Wire Transfer</span>{" "}
                <br />
                <span className="text-red-500 font-bold text-sm">Note: </span>
                Wire Transaction Fee is 1%
              </p>

              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <Field
                  as="select"
                  id="accountType"
                  name="accountType"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
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
              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-gray-500" />
                <Field
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <Field
                  type="text"
                  name="beneficiaryName"
                  placeholder="Beneficiary Name"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="beneficiaryName"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaUniversity className="text-gray-500" />
                <Field
                  type="text"
                  name="iban"
                  placeholder="IBAN/Account Number"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="iban"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaUniversity className="text-gray-500" />
                <Field
                  type="text"
                  name="bank"
                  placeholder="Bank"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="bank"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaPinterest className="text-gray-500" />
                <Field
                  type="text"
                  name="swiftCode"
                  placeholder="Swift Code"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="swiftCode"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaList className="text-gray-500" />
                <Field
                  type="text"
                  name="RoutingTransitNumber"
                  placeholder="Routing Transit Number"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="RoutingTransitNumber"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaLock className="text-gray-500" />
                <Field
                  type="text"
                  name="PIN"
                  placeholder="PIN"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="PIN"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaLocationArrow className="text-gray-500" />
                <Field
                  type="text"
                  name="BankAddress"
                  placeholder="Bank Address (Optional)"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="BankAddress"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex items-center space-x-2">
                <FaEdit className="text-gray-500" />
                <Field
                  type="text"
                  name="Remarks"
                  placeholder="Remarks"
                  className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
                />
              </div>
              <ErrorMessage
                name="Remarks"
                component="div"
                className="text-red-500 text-sm"
              />
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ThreeCircles
                      height="25"
                      width="25"
                      radius="5"
                      color="#ffffff"
                      ariaLabel="three-circles-loading"
                    />
                  ) : (
                    "Transfer"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

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
                </p>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="bg-bankred text-white px-4 py-2 rounded-md hover:bg-bankredhover"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLoader && (
        <LoaderModal showLoader={showLoader} setShowLoader={setShowLoader} />
      )}
    </>
  );
};

export default WireTransfer;
