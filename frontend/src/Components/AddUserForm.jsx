import { useFormik } from "formik";
import * as Yup from "yup";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { BaseUrl } from "./../../BaseUrl";
import { toast, ToastContainer } from "react-toastify";
import useHeaderData from "../Hooks/useHeaderData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddUserForm = () => {
  const navigate = useNavigate();
  const { token } = useHeaderData();
  const [apiResponse, setApiResponse] = useState();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      customerId: "",
      // role: '',
      gender: "",
      country: "",
      city: "",
      cotCode: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      customerId: Yup.string()
        .min(5, "Customer ID must be at least 5 characters")
        .required("Customer ID is required"),
      // role: Yup.string().required('Role is required'),
      gender: Yup.string().required("Gender is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      cotCode: Yup.string().required("COT code is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        const response = await axios.post(`${BaseUrl}users/register`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.status === 200) {
          toast.success(response?.data?.responseMessage);
          setApiResponse(response?.data?.responseMessage);
          resetForm();
          setTimeout(() => {
            navigate("/dashboard", {});
          }, 1000);
        } else {
          toast.warn(response?.data?.responseMessage);
        }
      } catch (error) {
        setFieldError("apiresponse", error?.message); // Display error from API response
      } finally {
        setSubmitting(false); // Reset loading state after submission
      }
    },
  });

  return (
    <div className="w-full lg:full mt-6 pl-0 lg:pl-2 mb-14">
      <div className="leading-loose text-left">
        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              {...formik.getFieldProps("firstname")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="text-red-600 text-sm">
                {formik.errors.firstname}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              {...formik.getFieldProps("lastname")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="text-red-600 text-sm">
                {formik.errors.lastname}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...formik.getFieldProps("email")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Customer Id
            </label>
            <input
              id="customerId"
              name="customerId"
              type="text"
              {...formik.getFieldProps("customerId")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.customerId && formik.errors.customerId && (
              <div className="text-red-600 text-sm">
                {formik.errors.customerId}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-xl font-light text-gray-900 dark:text-white">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              {...formik.getFieldProps("password")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>
          {/* <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">Role</label>
            <input
              id="role"
              name="role"
              type="text"
              {...formik.getFieldProps('role')}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-600 text-sm">{formik.errors.role}</div>
            )}
          </div> */}

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              {...formik.getFieldProps("gender")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-600 text-sm">{formik.errors.gender}</div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              {...formik.getFieldProps("country")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-600 text-sm">
                {formik.errors.country}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              {...formik.getFieldProps("city")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.city && formik.errors.city && (
              <div className="text-red-600 text-sm">{formik.errors.city}</div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              COT Code
            </label>
            <input
              id="cotCode"
              name="cotCode"
              type="text"
              {...formik.getFieldProps("cotCode")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.cotCode && formik.errors.cotCode && (
              <div className="text-red-600 text-sm">
                {formik.errors.cotCode}
              </div>
            )}
          </div>

          {formik.errors.apiresponse && (
            <div className="text-red-600 text-sm mt-0">
              {formik.errors.apiresponse}
            </div>
          )}
          {apiResponse && <div>{apiResponse}</div>}

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
 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Add User
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUserForm;
