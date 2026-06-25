import { useFormik } from "formik";
import * as Yup from "yup";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { BaseUrl } from "./../../BaseUrl";
import { toast, ToastContainer } from "react-toastify";
import useHeaderData from "../Hooks/useHeaderData";
import { useNavigate } from "react-router-dom";

const EditUserForm = ({ data }) => {
  const navigate = useNavigate();
  const { token } = useHeaderData();

  const formik = useFormik({
    initialValues: {
      firstname: data?.firstname || "",
      lastname: data?.lastname || "",
      email: data?.email || "",
      password: null,
      customerId: data?.customerId || "",
      gender: data?.gender || "male",
      country: data?.country || "Nigeria",
      city: data?.city || "",
      message: data?.message || "",
      cotCode: data?.cotCode || "",
      userId: data?._id,
      transactionPin: data?.transactionPin || [
        { status: "success", pin: "1234" },
        { status: "failed", pin: "0000" },
        { status: "hold", pin: "0090" },
      ],
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      customerId: Yup.string()
        .min(5, "Length must be at least 5")
        .required("Valid Customer Id is required"),
      gender: Yup.string().required("Gender is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      message: Yup.string().required("Message is required"),
      cotCode: Yup.string().required("COT Code is required"),
      transactionPin: Yup.array().of(
        Yup.object({
          pin: Yup.string()
            .length(4, "Pin must be exactly 4 characters")
            .required("Pin is required"),
        })
      ),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      console.log(values);

      try {
        const response = await axios.patch(`${BaseUrl}users/edituser`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          toast.success(response?.data?.responseMessage);
          resetForm(); // Clear the form after successful submission
          setTimeout(() => {
            navigate("/users", {});
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
    <div className="w-full lg:full mt-6 pl-0 lg:pl-2">
      <div className="leading-loose text-left">
        <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Email */}
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

          {/* Customer ID */}
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

          {/* Gender */}
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Gender
            </label>
            <input
              id="gender"
              name="gender"
              type="text"
              {...formik.getFieldProps("gender")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-600 text-sm">{formik.errors.gender}</div>
            )}
          </div>

          {/* Country */}
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

          {/* City */}
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
          {/* Message */}
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Message
            </label>
            <input
              id="message"
              name="message"
              type="text"
              {...formik.getFieldProps("message")}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              required
            />
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-600 text-sm">
                {formik.errors.message}
              </div>
            )}
          </div>

          {/* COT Code */}
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

          {/* Transaction Pin */}
          <div>
            <label className="block mb-2 text-xl font-thin text-gray-900 dark:text-white">
              Transaction Pin
            </label>
            {formik.values.transactionPin?.map((pinData, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {pinData.status} Pin
                </label>
                <input
                  id={`transactionPin.${index}.pin`}
                  name={`transactionPin.${index}.pin`}
                  type="text"
                  value={pinData.pin}
                  onChange={(e) => {
                    const newTransactionPins = [
                      ...formik.values.transactionPin,
                    ];
                    newTransactionPins[index].pin = e.target.value;
                    formik.setFieldValue("transactionPin", newTransactionPins);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  required
                />
                {formik.touched.transactionPin?.[index]?.pin &&
                  formik.errors.transactionPin?.[index]?.pin && (
                    <div className="text-red-600 text-sm">
                      {formik.errors.transactionPin[index].pin}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="text-white bg-gradient-to-r from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            {formik.isSubmitting ? (
              <ThreeCircles
                height="15"
                width="80"
                radius="9"
                color="#fff"
                ariaLabel="three-circles-loading"
                visible={true}
              />
            ) : (
              "Submit"
            )}
          </button>

          {/* Toast Notification */}
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
