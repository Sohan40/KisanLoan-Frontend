// // LoanCard.js
// import React from "react";

// const LoanCard = ({ loan, onLend }) => {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//       <h3 className="text-xl font-semibold mb-2">Loan ID: {loan.id}</h3>
//       <p className="text-gray-700">Farmer: {loan.farmer}</p>
//       {loan.lender && <p className="text-gray-700">Lender: {loan.lender}</p>}
//       <p className="text-gray-700">Amount: {loan.amount} ETH</p>
//       <p className="text-gray-700">Repayment Period: {loan.repaymentPeriod} days</p>
//       <p className={`text-sm mt-2 ${loan.status === "lended" ? "text-green-600" : "text-blue-600"}`}>
//         Status: {loan.status}
//       </p>

//       {loan.status === "available" && (
//         <button
//           onClick={onLend}
//           className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors duration-300"
//         >
//           Lend Money
//         </button>
//       )}
//     </div>
//   );
// };

// export default LoanCard;
import React from "react";

const LoanCard = ({ loan, onLend }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-green-800 mb-4 break-words">
        Loan ID: {loan.id}
      </h3>
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold">Farmer:</span> {loan.farmer}
      </p>
      {loan.lender && (
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Lender:</span> {loan.lender}
        </p>
      )}
      <p className="text-lg text-gray-700 mb-2">
        <span className="font-semibold">Amount:</span> {loan.amount} ETH
      </p>
      <p className="text-lg text-gray-700 mb-4">
        <span className="font-semibold">Repayment Period:</span> {loan.repaymentPeriod} days
      </p>
      <p
        className={`text-sm font-semibold mb-4 ${
          loan.status === "lended" ? "text-green-600" : "text-blue-600"
        }`}
      >
        Status: {loan.status}
      </p>

      {loan.status === "available" && (
        <button
          onClick={onLend}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300"
        >
          Lend Money
        </button>
      )}
    </div>
  );
};

export default LoanCard;
