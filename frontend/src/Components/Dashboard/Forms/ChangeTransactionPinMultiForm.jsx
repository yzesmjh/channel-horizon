import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeCircles } from "react-loader-spinner";
import { BaseUrl } from "../../../../BaseUrl";
import useHeaderData from "../../../Hooks/useHeaderData";
import { toast, ToastContainer } from "react-toastify";

const ChangeTransactionPinMultiForm = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const { token } = useHeaderData();

  const transactionPins = user.transactionPin; // Access the array of transaction pins
  const [activeTab, setActiveTab] = useState(0); // Manage active tab index

  // Validation schema using Yup
  const validationSchema = Yup.object({
    oldPin: Yup.string()
      .required("Old transaction PIN is required")
      .min(4, "PIN must be exactly 4 digits")
      .max(4, "PIN must be exactly 4 digits"),
    newPin: Yup.string()
      .required("New transaction PIN is required")
      .min(4, "PIN must be exactly 4 digits")
      .max(4, "PIN must be exactly 4 digits"),
    confirmNewPin: Yup.string()
      .oneOf(
        [Yup.ref("newPin"), null],
        "New PIN and confirmation PIN must match"
      )
      .required("Confirm transaction PIN is required"),
    password: Yup.string().required("Password is required"),
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const pinType = transactionPins[activeTab].status; // Access the status based on the active tab

    try {
      const response = await axios.patch(
        BaseUrl + "users/changepin",
        {
          oldPin: values.oldPin,
          newPin: values.newPin,
          password: values.password,
          pinType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          "Transaction PIN changed successfully! Please log out to use the new PIN."
        );
        resetForm(); // Reset form after successful submission
      } else {
        toast.warn(response?.data?.responseMessage);
      }
    } catch (error) {
      console.error("Error changing transaction PIN", error);
      toast.error("Failed to change transaction PIN");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 justify-between mb-4">
        {transactionPins.map((pin, index) => (
          <button
            key={index}
            className={`py-2 capitalize px-4 rounded text-nowrap ${
              activeTab === index ? "bg-purple-800 text-white " : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {pin.status} Pin
          </button>
        ))}
      </div>

      {/* Formik for handling form state and validation */}
      <Formik
        initialValues={{
          oldPin: "",
          newPin: "",
          confirmNewPin: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 w-full">
            {/* Old Transaction PIN */}
            <div>
              <label htmlFor="oldPin">Old Transaction PIN</label>
              <div className="relative">
                <Field
                  id="oldPin"
                  name="oldPin"
                  type={showOldPin ? "text" : "password"}
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <span
                  onClick={() => setShowOldPin(!showOldPin)}
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                >
                  {showOldPin ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage
                name="oldPin"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* New Transaction PIN */}
            <div>
              <label htmlFor="newPin">New Transaction PIN</label>
              <div className="relative">
                <Field
                  id="newPin"
                  name="newPin"
                  type={showNewPin ? "text" : "password"}
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <span
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                >
                  {showNewPin ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage
                name="newPin"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Confirm New Transaction PIN */}
            <div>
              <label htmlFor="confirmNewPin">Confirm New Transaction PIN</label>
              <div className="relative">
                <Field
                  id="confirmNewPin"
                  name="confirmNewPin"
                  type={showConfirmPin ? "text" : "password"}
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <span
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                >
                  {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage
                name="confirmNewPin"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* User Password */}
            <div>
              <label htmlFor="password">Password</label>
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>

            {isSubmitting ? (
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
                Change Transaction PIN
              </button>
            )}
            <ToastContainer />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangeTransactionPinMultiForm;
