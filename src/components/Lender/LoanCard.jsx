// LoanCard.js
import React from "react";

const LoanCard = ({ loan, onLend }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2">Loan ID: {loan.id}</h3>
      <p className="text-gray-700">Farmer: {loan.farmer}</p>
      {loan.lender && <p className="text-gray-700">Lender: {loan.lender}</p>}
      <p className="text-gray-700">Amount: {loan.amount} ETH</p>
      <p className="text-gray-700">Repayment Period: {loan.repaymentPeriod} days</p>
      <p className={`text-sm mt-2 ${loan.status === "lended" ? "text-green-600" : "text-blue-600"}`}>
        Status: {loan.status}
      </p>

      {loan.status === "available" && (
        <button
          onClick={onLend}
          className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Lend Money
        </button>
      )}
    </div>
  );
};

export default LoanCard;
