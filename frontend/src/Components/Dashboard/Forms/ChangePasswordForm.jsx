import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ThreeCircles } from "react-loader-spinner";
import { BaseUrl } from "../../../../BaseUrl";
import useHeaderData from "../../../Hooks/useHeaderData";
import { toast, ToastContainer } from "react-toastify";

const ChangePasswordForm = () => {
  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useHeaderData();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Sending data to change-password API endpoint
      const responds = await axios.patch(
        BaseUrl + "users/changepassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (responds.status == 200) {
        toast.success("Password changed successfully!");
        resetForm(); // Reset form after successful submission
      } else {
        toast.warn(responds?.data?.responseMessage);
      }
    } catch (error) {
      console.error("Error changing password", error);
      toast.warn("Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 w-full">
          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword">Old Password</label>
            <div className="relative">
              <Field
                id="oldPassword"
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                className="border border-gray-300 p-2 rounded w-full"
              />
              <span
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage
              name="oldPassword"
              component="div"
              className="text-red-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword">New Password</label>
            <div className="relative">
              <Field
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="border border-gray-300 p-2 rounded w-full"
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage
              name="newPassword"
              component="div"
              className="text-red-500"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="relative">
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="border border-gray-300 p-2 rounded w-full"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage
              name="confirmPassword"
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
              Change Password
            </button>
          )}
          <ToastContainer />
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
