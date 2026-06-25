import { useLayoutEffect } from "react";
import Aside from "../Components/Dashboard/Aside";
import useHeaderData from "../Hooks/useHeaderData";
import ProfileMain from "../Components/Dashboard/ProfileMain";

const Profile = () => {
  const { userInfo } = useHeaderData();

  useLayoutEffect(() => {
    document.title = "Channel b...";
  }, []);

  return (
    <div className="bg-gray-100 font-family-karla flex">
      <Aside user={userInfo} />

      <ProfileMain />
    </div>
  );
};

export default Profile;
