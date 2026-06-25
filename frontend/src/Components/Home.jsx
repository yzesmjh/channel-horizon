import React, { useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/login", {});
    }, 2000);
  }, []);

  return (
    <div className="w-screen h-screen p-5 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <Circles
          visible={true}
          height="80"
          width="80"
          color="#100257"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Home;
