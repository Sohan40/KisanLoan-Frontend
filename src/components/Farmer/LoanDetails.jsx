// LoanDetails.js
import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Snackbar from "./Snackbar";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const LoanDetails = () => {
  const { loanID } = useParams();
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Access loan object passed via state
  const { loan } = useLocation().state || {};

  console.log(loan);

  const repayEmi = async (id, amount, lender) => {
    try {
      const signer = await walletProvider.getSigner();
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);

      console.log(amount.toString())
      const tx = await contract.payEmi(id, lender, { value: amount.toString() });
      await tx.wait();

      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      console.error("Error lending money:", error);
    }
  };

  if (!loan || loan.id !== loanID) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-700 mb-4">Loan not found or not selected.</p>
        <button
          onClick={() => navigate("/myloans")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Loan Details</h1>
        <div className="space-y-4">
          <p>
            <strong className="text-gray-700">Loan ID:</strong> <span className="text-gray-900">{loan.id}</span>
          </p>
          <p>
            <strong className="text-gray-700">Farmer:</strong> <span className="text-gray-900">{loan.farmer}</span>
          </p>
          <p>
            <strong className="text-gray-700">Amount:</strong>{" "}
            <span className="text-gray-900">{loan.amount.toString()/1e18} ETH</span>
          </p>
          <p>
            <strong className="text-gray-700">Repayment Period:</strong>{" "}
            <span className="text-gray-900">{loan.repaymentPeriod} months</span>
          </p>
          
          <p>
            <strong className="text-gray-700">Sanctioned:</strong>{" "}
            <span className="text-gray-900">{loan.sanctioned ? "Yes" : "No"}</span>
          </p>
          <p>
            <strong className="text-gray-700">Document CID:</strong>{" "}
            <span className="text-gray-900">{loan.cid}</span>
          </p>
          <p>
            <strong className="text-gray-700">EMI:</strong>{" "}
            <span className="text-gray-900">{parseInt(loan.emi)/1e18+ " ETH"}</span>
          </p>
          <p>
            <strong className="text-gray-700">EMI Paid Count:</strong>{" "}
            <span className="text-gray-900">{loan.emiPaidCount.toString()}</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => navigate("/myloans")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Loans
          </button>

          {loan.sanctioned === true ? (
            loan.emiPaidCount < loan.repaymentPeriod ? (
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                onClick={() => repayEmi(loan.id, loan.emi, loan.lender)}
              >
                Repay EMI
              </button>
            ) : (
              <p className="text-green-600 text-lg font-semibold">You have repaid your loan.</p>
            )
          ) : (
            ""
          )}
        </div>
      </div>
      <Snackbar message="EMI Repayment successful" active={showSnackbar} />
    </div>
  );
};

export default LoanDetails;
