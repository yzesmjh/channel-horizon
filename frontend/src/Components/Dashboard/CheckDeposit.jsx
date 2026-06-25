import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";

const validationSchema = Yup.object().shape({
  front: Yup.mixed().required("Front file is required"),
  back: Yup.mixed().required("Back file is required"),
  remark: Yup.string().required("Remark is required"),
});

const CheckDeposit = () => {
  const initialValues = {
    front: null,
    back: null,
    remark: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("front", values.front);
    formData.append("back", values.back);
    formData.append("remark", values.remark);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
      resetForm();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-20">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-3 text-xs">
            <div className="p-2 bg-indigo-800 text-red-50 font-medium">
              Check Deposit
            </div>
            <p className="text-sm text-slate-400 py-2  border-y-[1px]">
              Upload the front and back photo of the Check. Make sure the photo
              is clear
            </p>

            <div>
              <label htmlFor="front">Front File</label>
              <input
                id="front"
                name="front"
                type="file"
                onChange={(event) => {
                  setFieldValue("front", event.currentTarget.files[0]);
                }}
                className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
              />
              <ErrorMessage
                name="front"
                component="div"
                className="text-red-500 text-bankSmall"
              />
            </div>

            <div>
              <label htmlFor="back">Back File</label>
              <input
                id="back"
                name="back"
                type="file"
                onChange={(event) => {
                  setFieldValue("back", event.currentTarget.files[0]);
                }}
                className="mt-1 block w-full border-b-gray-300 border-b-[1px] focus:outline-none pb-2"
              />
              <ErrorMessage
                name="back"
                component="div"
                className="text-red-500 text-bankSmall"
              />
            </div>
            <div>
              <label htmlFor="remark">Remark</label>
              <Field
                id="remark"
                name="remark"
                as="textarea"
                className="block w-full border-b-gray-300 border-b-[1px] focus:outline-none sm:text-sm"
              />
              <ErrorMessage
                name="remark"
                component="div"
                className="text-red-500 text-bankSmall"
              />
            </div>
            <div>
              <button
                type="submit"
                className=" w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  "Submit"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckDeposit;
