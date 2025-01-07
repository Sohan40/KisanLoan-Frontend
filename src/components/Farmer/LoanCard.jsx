import React from "react";
import { Link } from "react-router-dom";

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
        <span className="font-semibold">Amount:</span> {loan.amount.toString()} ETH
      </p>
      <p className="text-lg text-gray-700 mb-4">
        <span className="font-semibold">Repayment Period:</span> {loan.repaymentPeriod} days
      </p>
      <p
        className={`text-sm font-semibold mb-4 ${
          loan.sanctioned ===true ? "text-green-600": (loan.status ? "text-blue-600" : "text-yellow-600")
        }`}
      >
        Status: {loan.sanctioned ? "Sanctioned": (loan.status ? "Verified" : "Pending")}
      </p>

      <Link to={`/myloans/${loan.id}`} state={{loan}}>
                <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300">
                  View Details
                </button>
      </Link>
    </div>
  );
};

export default LoanCard;
