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
  const {loan} = useLocation().state || {};

    const repayEmi = async (id) => {
        try {
          const signer = await walletProvider.getSigner();
          // console.log(signer.address,"Farmer")
          const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
          
          const tx = await contract.payEmi(id);
          await tx.wait();
    
          setShowSnackbar(true);
          setTimeout(() => setShowSnackbar(false), 3000);
    
         
        } catch (error) {
          console.error("Error lending money:", error);
        }
      };

  
  if (!loan || loan.id !== loanID) {
    return (
      <div>
        <p>Loan not found or not selected.</p>
        <button
          onClick={() => navigate("/myloans")}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Loan Details</h1>
      <p><strong>Loan ID:</strong> {loan.id}</p>
      <p><strong>Farmer:</strong> {loan.farmer}</p>
      <p><strong>Amount:</strong> {(loan.amount).toString()+' ETH'}</p>
      <p><strong>Repayment Period:</strong> {loan.repaymentPeriod} months</p>
      <p><strong>Status:</strong> {loan.status}</p>
      <p><strong>Sanctioned:</strong> {loan.sanctioned ? "Yes" : "No"}</p>
      <p><strong>Document CID:</strong> {loan.cid}</p>
      <p><strong>EMI : </strong> {(loan.emi).toString()}</p>
      <p><strong>EMI paid count :</strong> {loan.emiPaidCount}</p>

      <button
        onClick={() => navigate("/myloans")}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Back to Loans
      </button>


     {loan.sanctioned === true? 
     
     <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={()=>repayEmi(loan.id)}>repay</button> 
     : ""
     }
        <Snackbar message="Loan successfully lended!" active={showSnackbar} />
    </div>
  );
};

export default LoanDetails;
