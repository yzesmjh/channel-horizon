import axios from "axios";
import { useState } from "react";
import { BaseUrl } from "../../BaseUrl";
import useHeaderData from "../Hooks/useHeaderData";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import AddTransactionForm from "./AddTransactionForm";
import EditUserForm from "./EditUserForm";
import { ThreeCircles } from "react-loader-spinner";
import UpdateBalanceForm from "./UpdateBalanceForm";

const UserDataComponent = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useHeaderData();
  const deleteUser = (user) => {
    // Ask if user should be deleted
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (shouldDelete) {
      const deleteUserAsync = async () => {
        try {
          setLoading(true);
          const response = await axios.delete(
            `${BaseUrl}users/deletesingleuser`,
            {
              data: { userId: user },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false);
          if (response.status === 200) {
            // Display response message
            console.log(response);
            console.log("User deleted successfully:", response?.data?.message);
            toast.success(response?.data?.responseMessage);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.success(response?.data?.message);
            console.error("Failed to delete user:", response.data.message);
          }
        } catch (error) {
          setLoading(false);
          console.error("Error deleting user:", error.message);
        }
      };

      deleteUserAsync();
    }
  };

  const [uploadLoader, setUploadLoader] = useState(false);
  const uploadPicture = async (userId) => {
    // Create a hidden input element to allow file selection

    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*"; // Accept only image files

    // Add an event listener to handle the file selection
    inputElement.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      if (file) {
        // Prepare the form data

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        try {
          setUploadLoader(true);
          // Send the picture to the upload API
          const response = await axios.post(
            `${BaseUrl}users/uploadphoto`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            toast.success("Picture uploaded successfully");
          } else {
            toast.warn("Picture upload failed");
          }
        } catch (error) {
          toast.error(`Upload failed: ${error.message}`);
        } finally {
          setUploadLoader(false);
        }
      }
    });

    // Trigger the file selection dialog
    inputElement.click();
  };

  const [isCreating, setIsCreating] = useState(false);
  const createAccount = async (userId) => {
    try {
      setIsCreating(true);
      const response = await axios.put(`${BaseUrl}account/createaccount/`, {
        userId,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // Display response message
        toast.success(response?.data?.responseMessage);
      } else {
        toast.success(response?.data?.message);
        setIsCreating;
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <tr>
      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img src={data?.profilePicx} className="w-6 h-7 rounded-full" />
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              {data?.firstname}
            </p>
          </div>
        </div>
      </td>
      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
        <p className="text-gray-900 whitespace-no-wrap">{data?.lastname}</p>
      </td>
      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
        <p className="text-gray-900 whitespace-no-wrap">{data?.email}</p>
      </td>
      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
        <p className="text-gray-900 whitespace-no-wrap">{data?.customerId}</p>
      </td>

      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
        <div className="flex justify-between flex-row">
          <div className="flex">
            <span className="material-symbols-outlined text-green-800">
              edit
            </span>
            <Modal
              caption={"Edit UserInfo"}
              captionButton={false}
              modalContent={<EditUserForm data={data} />}
            />
          </div>
          <span
            className="material-symbols-outlined text-red-600"
            onClick={() => deleteUser(data?._id)}
          >
            delete_forever
          </span>
          {!uploadLoader ? (
            <span
              className="material-symbols-outlined text-red-600"
              onClick={() => uploadPicture(data?._id)}
            >
              image
            </span>
          ) : (
            <ThreeCircles
              height="25"
              width="25"
              radius="5"
              color="#100257"
              ariaLabel="three-circles-loading"
            />
          )}
          Upload Image
          <div className="flex cursor-pointer">
            <span className="material-symbols-outlined text-blue-600">
              note_add
            </span>
            <Modal
              caption={"Add Transaction"}
              captionButton={false}
              modalContent={<AddTransactionForm data={data} />}
            />
          </div>
          <div className="flex cursor-pointer">
            <span className="material-symbols-outlined">sync_alt</span>

            <Modal
              caption={"Update Balance"}
              captionButton={false}
              modalContent={<UpdateBalanceForm data={data} />}
            />
          </div>
          <div>
            <Link to={`/users/${data?._id}`} className="flex gap-1">
              <span className="material-symbols-outlined">visibility</span>
              <span>View</span>
            </Link>
          </div>
          <div>
            {isCreating ? (
              <ThreeCircles
                height="25"
                width="25"
                radius="5"
                color="#100257"
                ariaLabel="three-circles-loading"
              />
            ) : (
              <span
                class="material-symbols-outlined text-green-600"
                onClick={() => createAccount(data?._id)}
              >
                add_circle
              </span>
            )}
          </div>
        </div>
      </td>
      <ToastContainer />
    </tr>
  );
};

export default UserDataComponent;
