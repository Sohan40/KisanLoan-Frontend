// LoanRequests.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanCard from "./LoanCard"; // LoanCard component is reusable
import Snackbar from "./Snackbar"; // Reusable Snackbar component

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const LoanRequests = () => {
  const [loans, setLoans] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchRequests = async () => {
    try {
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, provider);
      const allLoans = await contract.getLoans();

      const formattedLoans = allLoans
        .filter(loan => loan[5] === false) // available loans only
        .map((loan) => ({
          id: loan[0].toString(),
          farmer: loan[1],
          amount: ethers.formatEther(loan[3]),
          repaymentPeriod: loan[4].toString(),
          status: "unverified",
          cid:loan[6]
        }));

      setLoans(formattedLoans);
    } catch (err) {
      console.log("Error fetching loan data:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4 mb-4">Available Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
};

export default LoanRequests;