// LoanRequests.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanCard from "./LoanCard"; // LoanCard component is reusable
import Snackbar from "./Snackbar"; // Reusable Snackbar component

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require("../../artifacts/contracts/LoanRequest.sol/LoanRequest.json").abi;

const LoanRequests = () => {
  const [loans, setLoans] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerifier, setIsVerifier] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const signer = await walletProvider.getSigner();
      const address = await signer.getAddress();
      setCurrentUser(address);

      // Check if the user is a verifier
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, provider);
      const verifierStatus = await contract.isVerifier(address); // Assuming isVerifier is a function in the contract
      setIsVerifier(verifierStatus);
    } catch (err) {
      console.log("Error fetching current user:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, provider);
      const allLoans = await contract.getLoans();

      console.log(allLoans)
      const formattedLoans = allLoans
        .filter(loan => loan[11].approved === false && isVerifier) // Check if loan is available and user is a verifier
        .map((loan) => ({
          id: loan[0].toString(),
          farmer: loan[1],
          amount: loan[3],
          repaymentPeriod: loan[4].toString(),
          status: {
            approved : loan[11][0],
            sanctioned : loan[11][1],
            rejected : loan[11][2],
            indefault : loan[11][3]          
          },
          cid: loan[5]
        }));

      setLoans(formattedLoans);
    } catch (err) {
      console.log("Error fetching loan data:", err);
    }
  };
  useEffect(() => {
        if (window.ethereum) {
          const handleAccountsChanged = () => {
            window.location.reload(); // Reload the page when the account changes
          };
    
          // Add listener for MetaMask account changes
          window.ethereum.on("accountsChanged", handleAccountsChanged);
    
          // Cleanup the listener on component unmount
          return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          };
        }
      }, []);
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (isVerifier) {
      fetchRequests();
    }
  }, [isVerifier]);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4 mb-4">Available Loans</h2>
      {isVerifier ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      ) : (
        <p className="text-red-500">You are not authorized to view these loans.</p>
      )}
    </div>
  );
};

export default LoanRequests;
