// LoanRequests.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanCard from "./LoanCard"; // LoanCard component is reusable
import LendersDashboard from "./FarmersDashboard";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchRequests = async () => {
    try {
      const signer = await walletProvider.getSigner();
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
      
      console.log('okokok')
      const allLoans = await contract.getFarmerLoans();

      const formattedLoans = allLoans.filter((loan)=> (loan[7]=== true))
        .map((loan) => ({
          id: loan[0].toString(),
          lender : loan[2],
          farmer: loan[1],
          amount: loan[3],
          repaymentPeriod: loan[4].toString(),
          status: loan[5],
          sanctioned:loan[7],
          cid:loan[6],
          emi:loan[8],
          emiPaidCount:loan[9]
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
      <h2 className="text-2xl font-bold mt-4 mb-4">Sanctioned Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
};

export default MyLoans;
