import React, { useState } from "react";

const Pagination = ({
  data,
  RenderComponent,
  title,
  pageLimit,
  dataLimit,
  type,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / dataLimit);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * dataLimit;
    const endIndex = Math.min(startIndex + dataLimit, data.length);
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const end = Math.min(start + pageLimit - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Name
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Transaction
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Amount
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Date
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Type
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Status
            </th>
            <th
              className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
            >
              Account Balance
            </th>
            {type && type == "ADMIN" && (
              <th
                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
              >
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>} */}

          {/* Display Data */}

          {getPaginatedData().map((d, idx) => (
            <RenderComponent key={idx} data={d} type={type} />
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination flex justify-center items-center mt-4">
        {/* Previous Button */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {getPaginationGroup().map((item, index) => (
          <button
            key={index}
            onClick={changePage}
            className={`px-4 py-2 mx-1 ${
              currentPage === item
                ? "bg-purple-900 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded`}
          >
            {item}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
