import { useRef, useState } from "react";
import axios from "axios";
import useHeaderData from "../../Hooks/useHeaderData";
import { BaseUrl } from "../../../BaseUrl";
import { toast, ToastContainer } from "react-toastify";

const ImageUploader = ({ user }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null); // For showing image preview
  const [loading, setLoading] = useState(false); // For showing the loader
  const { token } = useHeaderData();

  // Function to trigger file input on div click
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the file input change
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
      } else {
        alert("Please upload only images");
      }
    }
  };

  // Handle image upload when submitting
  const handleUpload = async () => {
    if (!previewImage) return;

    const file = fileInputRef.current.files?.[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user._id);

    setLoading(true); // Show loader

    try {
      const response = await axios.post(
        `${BaseUrl}users/uploadphoto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Image uploaded successfully", response?.data);
      if (response?.data?.responseCode == 200) {
        toast.success(response?.data?.responseMessage);
        //update session info

        user.profilePicx = response?.data?.data?.profilePicx;
        const updatedUserString = JSON.stringify(user);

        // Save the updated string back into sessionStorage
        sessionStorage.setItem("user", updatedUserString);

        setTimeout(() => {
          //reload page
          window.location.reload();
        }, 1000);
      } else {
        toast.warn(response?.data?.responseMessage);
      }
      setPreviewImage(null); // Clear the preview after successful upload
    } catch (error) {
      console.error("Error uploading the image", error);
    } finally {
      setLoading(false); // Hide loader after upload
    }
  };

  return (
    <div className="flex flex-col items-start">
      {/* Clickable div for image upload */}
      <div
        className="border border-dashed flex items-center justify-center cursor-pointer"
        onClick={handleDivClick}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="">Change Profile Picture</span>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*" // Ensures only images can be selected
          onChange={handleFileChange}
        />
      </div>

      {/* Show the loader while uploading */}
      {loading ? (
        <div className="mt-4">Uploading...</div>
      ) : (
        previewImage && (
          <button
            className="mt-4 px-4 py-2 bg-bankred text-white rounded-lg"
            onClick={handleUpload}
          >
            Upload Image
          </button>
        )
      )}
      <ToastContainer />
    </div>
  );
};

export default ImageUploader;
