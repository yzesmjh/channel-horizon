import React from "react";
import userDefaultImage from "./../../assets/Images/user.png";
import Footer from "../Dashboard/Footer";
import Modal from "../Modal";
import ChangePasswordForm from "../Dashboard/Forms/ChangePasswordForm";
import ImageUploader from "./ImageUploader";
// import ChangeTransactionPinForm from "../Dashboard/Forms/ChangeTransactionPinForm";
import ChangeTransactionPinMultiForm from "../Dashboard/Forms/ChangeTransactionPinMultiForm";

const ProfileCard = ({ user, account }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div>
      <div className="w-full p-4">
        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            src={`${user?.profilePicx}` || userDefaultImage}
            alt="Profile"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg p-5 text-xs mb-10 flex gap-5 flex-col">
        <div className="flex justify-between border-b-[1px] border-b-slate-200 pb-2">
          <p>
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-red-700 text-bankSmall font-bold">EDIT PROFILE</p>
        </div>

        {account.map((item, index) => (
          <div
            className="flex justify-between border-b-[1px] border-b-slate-200 pb-2"
            key={index}
          >
            <p className="capitalize">{item?.accountType} Balance</p>
            <p className="text-red-700 text-bankSmall font-bold">
              {formatter.format(item?.balance || "00")}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg p-5 text-xs mb-14 flex gap-5 flex-col">
        <div className="flex justify-between border-b-[1px] border-b-slate-200 pb-2">
          <p>Email</p>
          <p className="text-red-700 text-bankSmall font-bold">{user?.email}</p>
        </div>
        <div className="flex justify-between border-b-[1px] border-b-slate-200 pb-2">
          <p>Country</p>
          <p className="text-red-700 text-bankSmall font-bold">
            {user?.country || "USA"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>City</p>
          <p className="text-red-700 text-bankSmall font-bold">
            {user?.city || "Nevada"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Gender</p>
          <p className="text-red-700 text-bankSmall font-bold">
            {user?.gender || "Female"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>COT Code</p>
          <p className="text-red-700 text-bankSmall font-bold">
            {user?.city || "110021602"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>COT Code</p>
          <p className="text-red-700 text-bankSmall font-bold">
            {user?.city || "110021602"}
          </p>
        </div>

        <Modal
          caption={"Change Password"}
          captionButton={false}
          modalContent={<ChangePasswordForm />}
        />
        <Modal
          caption={"Change Transaction Pin"}
          captionButton={false}
          modalContent={<ChangeTransactionPinMultiForm user={user} />}
        />
        <ImageUploader user={user} />
      </div>
      <Footer />
    </div>
  );
};

export default ProfileCard;
