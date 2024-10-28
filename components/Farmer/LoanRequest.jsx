import React, { useState } from "react";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;



const RequestLoan = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [documents, setDocuments] = useState("");

  const submitRequest = async () => {

    if (loanAmount && repaymentPeriod && documents) {
    
      try {

        const signer = await walletProvider.getSigner();
        
        const sendContractTx = new ethers.Contract(
          LoanContractAddress,
          LoanContractABI,
          signer
        );
        
        console.log(signer);

        const tx = await sendContractTx.requestLoan(
          parseInt(loanAmount),
          parseInt(repaymentPeriod),
        );
        await tx.wait();



      } catch (error) {
        console.error("Error adding loan:", error);
      }

      // Assuming you have a function to handle the request submission
      
      // Reset form fields
      setLoanAmount("");
      setRepaymentPeriod("");
      setDocuments("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Request a Loan</h1>
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Repayment Period (Months)"
        value={repaymentPeriod}
        onChange={(e) => setRepaymentPeriod(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Important Documents"
        value={documents}
        onChange={(e) => setDocuments(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <button onClick={submitRequest} className="bg-blue-500 text-white p-2 rounded">
        Submit Request
      </button>
    </div>
  );
};

export default RequestLoan;
