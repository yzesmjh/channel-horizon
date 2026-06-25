import React, { useLayoutEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { BaseUrl } from "./../../BaseUrl";
import { toast, ToastContainer } from "react-toastify";

import BankLogo from "./../Components/BankLogo";
const Login = () => {
  //check if user already is logged in

  useLayoutEffect(() => {
    document.title = "Channel Horizon Bank — Sign In";
    if (sessionStorage.getItem("user")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
      customerId: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      customerId: Yup.string()
        .min(5, "Length must be at least 5")
        .required("Valid Customer Id is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Call login endpoint here

        const response = await axios.post(`${BaseUrl}users/login`, values);

        if (response) {
          if (response.status == 200) {
            const returnedData = response?.data?.data;
            sessionStorage.setItem(
              "user",
              JSON.stringify(returnedData.userInfo)
            );
            sessionStorage.setItem("token", JSON.stringify(returnedData.token));
            toast.success(response.data.responseMessage);
            setTimeout(() => {
              navigate("/dashboard", {
                state: {
                  message: `welcome ${returnedData.userInfo.firstname}  ${returnedData.userInfo.lastname}`,
                },
                replace: true,
              });
            }, 3000);
          } else {
            toast.warn(response.data.responseMessage);
          }
        }
      } catch (error) {
        setFieldError("apiresponse", error.message); // Display error from API response
      } finally {
        setSubmitting(false); // Reset loading state after submission
      }
    },
  });
  return (
    <div className="w-screen h-screen p-10 flex justify-center items-center">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <BankLogo size={96} />
          </div>
          <h1 className="mt-4 text-center text-xl font-bold tracking-wide text-bankred">
            Channel Horizon Bank
          </h1>
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-light dark:text-dark"
              >
                Customer ID
              </label>
              <div className="mt-2">
                <input
                  id="customerId"
                  name="customerId"
                  type="text"
                  required
                  {...formik.getFieldProps("customerId")}
                  className="px-2 block w-full rounded-md border-1 border-slate-500 py-1.5 text-red-900 shadow-sm ring-2 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.customerId && formik.errors.customerId && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.customerId}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-red-600 hover:text-red-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  required
                  autoComplete="current-password"
                  className="px-2 block w-full rounded-md border-1 border-slate-500 py-1.5 text-red-900 shadow-sm ring-2 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    /* Eye-off */
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>

            <div>
              {formik.errors.apiresponse && (
                <div className="text-red-600 text-sm mt-0">
                  {formik.errors.apiresponse}
                </div>
              )}
              {formik.isSubmitting ? (
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
                  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-red-800"
                >
                  Log In
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
