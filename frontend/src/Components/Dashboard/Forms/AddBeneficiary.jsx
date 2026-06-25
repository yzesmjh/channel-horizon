import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import useHeaderData from "../../../Hooks/useHeaderData";
import { toast, ToastContainer } from "react-toastify";
import { BaseUrl } from "../../../../BaseUrl";

const AddBeneficiary = () => {
  const { token } = useHeaderData();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^\d+$/, "Account Number must be digits"),
    routineNumber: Yup.string()
      .required("Routine Number is required")
      .matches(/^\d+$/, "Routine Number must be digits"),
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Sending data to /addbeneficiary API
      const responds = await axios.post(
        BaseUrl + "users/addbeneficiary",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (responds.status == 200) {
        resetForm();
        toast.success("Benefitiary added");
      } else {
        toast.warn(responds.data.respondsMessage);
      }
    } catch (error) {
      console.error("Error adding beneficiary", error);
      toast.warn("Failed to add beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          accountName: "",
          bankName: "",
          accountNumber: "",
          routineNumber: "",
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

            {isSubmitting ? (
              <button
                disabled
                className="flex justify-center items-center w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submitting...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-white bg-bankred hover:bg-bankredhover focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Beneficiary
              </button>
            )}
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </>
  );
};

export default AddBeneficiary;
