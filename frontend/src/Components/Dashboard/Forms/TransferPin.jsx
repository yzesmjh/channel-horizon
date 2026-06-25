import React from "react";

const TransferPin = () => {
  return (
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
          onSubmit={(values) => handlePinSubmit(values.pin)}
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
 hover:bg-bankred text-white rounded-md"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TransferPin;
