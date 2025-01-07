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
        .filter(loan => (loan[2] === '0x0000000000000000000000000000000000000000' && loan[5] === true) ) // available loans only
        .map((loan) => ({
          id: loan[0].toString(),
          farmer: loan[1],
          amount: loan[3],
          repaymentPeriod: loan[4].toString(),
          status: "available",
          cid:loan[6]
        }));
        console.log(formattedLoans,"hswbxdwuce");
      setLoans(formattedLoans);
    } catch (err) {
      console.log("Error fetching loan data:", err);
    }
  };

  const lendMoney = async (id, farmer,amount) => {
    try {
      const signer = await walletProvider.getSigner();
      // console.log(signer.address,"Farmer")
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
      
      const tx = await contract.disburseLoan(id, farmer, { value: ethers.parseEther(amount.toString()) });
      await tx.wait();

      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);

      setLoans((prevLoans) =>
        prevLoans.map((loan) => (loan.id === id ? { ...loan, status: "lended" } : loan))
      );
    } catch (error) {
      console.error("Error lending money:", error);
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
          <LoanCard key={loan.id} loan={loan} onLend={() => lendMoney(loan.id, loan.farmer,loan.amount)} />
        ))}
      </div>
      <Snackbar message="Loan successfully lended!" active={showSnackbar} />
    </div>
  );
};

export default LoanRequests;
