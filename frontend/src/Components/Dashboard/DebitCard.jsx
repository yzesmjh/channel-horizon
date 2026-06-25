import PropTypes from "prop-types";
import BankLogo from "./../BankLogo";
import chip from "./../../assets/Images/chip.png";

const DebitCard = ({ user, expiryDate = "12/26" }) => {
  function maskCardNumber() {
    return `${Math.floor(Math.random() * 10000)} XXXX XXXX ${Math.floor(
      Math.random() * 10000
    )}`;
  }

  return (
    <div className="">
      <h1 className="border-b-[1px] border-black pb-2 text-bankred text-xs font-bold mb-2">
        Horizon Cards
      </h1>
      <div className="mb-10 w-full max-w-xs mx-auto bg-gradient-to-tr from-black via-blue-900 to-black rounded-2xl p-6 shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">
            <img src={chip} alt="Card Chip" className="w-12" />
          </div>
          {/* CHB bank logo watermark on card */}
          <div className="flex items-center gap-1">
            <BankLogo size={28} />
            <span className="text-xs font-semibold opacity-80 tracking-wide">CHB</span>
          </div>
        </div>

        <div className="my-6">
          <p className="text-lg tracking-widest tech text-center">
            {maskCardNumber()}
          </p>
        </div>

        <div className="leading-tight tech uppercase w-fit pl-12 flex gap-2">
          <p className="text-center text-xs">
            valid
            <br />
            THRU
          </p>
          <p className="font-medium text-2xl">{expiryDate}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="font-medium tech pl-2 uppercase">
            {user?.firstname} {user?.lastname}
          </p>
        </div>
      </div>
    </div>
  );
};

DebitCard.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
  }),
  expiryDate: PropTypes.string,
};

export default DebitCard;
