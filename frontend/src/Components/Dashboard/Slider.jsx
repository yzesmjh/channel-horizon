import React, { useRef } from "react";

function SimpleSlider({ amount }) {
  const sliderRef = useRef(null);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const getCurrentMonthAndYear = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const currentMonthAbbr = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    return `${currentMonthAbbr}, ${currentYear}`;
  };

  return (
    <div
      className="flex flex-row overflow-auto no-scrollbar pr-5 sm:pr-10 w-full"
      ref={sliderRef}
    >
      {amount.map((account, index) => (
        <div className="w-[95%] min-w-[350px] sm:min-w-[95%]" key={index}>
          <div className="w-full h-auto p-1">
            <div
              className=" bg-gradient-to-b from-[#100257] to-[#0f0009] 
                  
 text-indigo-100 border-[1px] border-purple-700 rounded-xl flex items-start justify-center gap-3 flex-col h-full p-5"
            >
              <p className="capitalize  font-thin text-xs">
                {account?.accountType}
              </p>
              <p className="font-medium text-white text-2xl sm:text-xl">
                {formatter.format(account?.balance || "0.00")}
              </p>
              <p className="text-xs  font-thin">ACCOUNT NUMBER</p>
              <p className="text-base text-white">
                <span>
                  **** {(account?.accountNumber || "").toString().slice(-4)}
                </span>
              </p>
              <div className="flex gap-5">
                <div className="mb-5">
                  <p className="text-bankSmall text-nowrap font-thin">
                    TOTAL CREDIT
                  </p>
                  <p className="text-bankSmall">
                    {getCurrentMonthAndYear().toLocaleUpperCase()}
                  </p>
                  <p className="text-sm text-white font-medium">
                    {formatter.format(account?.totalCredit || "0.00")}
                  </p>
                </div>
                <div>
                  <p className="text-bankSmall text-nowrap font-thin">
                    TOTAL DEBIT
                  </p>
                  <p className="text-bankSmall">
                    {getCurrentMonthAndYear().toLocaleUpperCase()}
                  </p>
                  <p className="text-sm text-white font-medium">
                    {formatter.format(account?.totalDebit || "0.00")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SimpleSlider;
