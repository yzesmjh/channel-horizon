import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal";
import AddBeneficiary from "./Forms/AddBeneficiary";
import { BaseUrl } from "../../../BaseUrl";
import useHeaderData from "../../Hooks/useHeaderData";

const Beneficiary = () => {
  const [users, setUsers] = useState([]);
  const { token } = useHeaderData();

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        if (token) {
          const response = await axios.get(
            `${BaseUrl}users/fetchallbeneficiary`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.data);

          if (response.status === 200) {
            setUsers(response.data.data || []);
          } else {
            console.warn(response.data.respondsMessage);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBeneficiaries();
  }, [token]);

  return (
    <div className="mb-2 border-b-[1px] border-slate-300 flex-col flex gap-5 py-3">
      <div className="flex flex-row justify-between w-full h-6 gap-3 border-b-[1px] border-slate-300 pb-5">
        <p className="text-bankred text-xs font-bold">Beneficiaries</p>

        <div>
          <Modal
            caption={
              <button className="flex flex-row w-auto gap-1 border-2 border-bankred px-2 py-1 rounded-md items-center">
                <p className="text-bankred text-bankSmall text-nowrap">
                  Add User
                </p>
              </button>
            }
            captionButton={false}
            modalContent={<AddBeneficiary />}
          />
        </div>
      </div>

      <div className="max-h-[100px] overflow-auto">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="border-b-[1px] border-slate-300 py-1">
              <p className="text-slate-700 text-xs font-medium">
                {user.accountName}
              </p>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-xs font-medium text-nowrap">
            No Beneficiary:
            <Modal
              caption={<span className="text-bankred">Add New</span>}
              captionButton={false}
              modalContent={<AddBeneficiary />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Beneficiary;
