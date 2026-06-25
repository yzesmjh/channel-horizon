import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaDollarSign, FaLock, FaUniversity } from "react-icons/fa";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoaderModal from "./Modals/LoaderModal";
import useHeaderData from "../../Hooks/useHeaderData";
import { BaseUrl } from "../../../BaseUrl";

const WireTransfer = ({ account, user }) => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { token } = useHeaderData();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    beneficiaryName: Yup.string().required("Beneficiary name is required"),
    iban: Yup.string().required("IBAN/Account Number is required"),
    bank: Yup.string().required("Bank is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setIsPinModalOpen(true);
    setSelectedAccount(values);
    setSubmitting(false);
  };

  const [showLoader, setShowLoader] = useState(false);

  const handlePinSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      if (values.pin !== user.transactionPin) {
        toast.warn("Wrong Pin");
        return;
      }
      const process = await axios.post(
        BaseUrl + "transaction/wire-transfer",
        {
          ...selectedAccount,
          amount: parseFloat(selectedAccount.amount),
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
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error in wire transfer", error);
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
    navigate("/dashboard");
  };

  return (
    <>
      <Formik
        initialValues={{ amount: "", beneficiaryName: "", iban: "", bank: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 mb-14">
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
            </div>
            <div>
              <label htmlFor="beneficiaryName">Beneficiary Name</label>
              <Field
                id="beneficiaryName"
                name="beneficiaryName"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="beneficiaryName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="iban">IBAN/Account Number</label>
              <Field
                id="iban"
                name="iban"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="iban"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label htmlFor="bank">Bank</label>
              <Field
                id="bank"
                name="bank"
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ErrorMessage
                name="bank"
                component="div"
                className="text-red-500"
              />
            </div>
            {isSubmittingForm ? (
              <button
                disabled
                className="flex justify-center items-center w-full text-white bg-bankred hover:bg-bankredhover focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
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
                {/* Emoji or Icon */}
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  Transaction Unsuccessful
                </h2>
                <p className="text-gray-700 mb-6">
                  Sorry, we weren't able to complete your payment at this time.
                  Please try again later.
                  <br />
                  If you continue to encounter problems, please contact customer
                  service.
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
