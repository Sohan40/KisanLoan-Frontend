
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanCard from "./LoanCard";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const LendedLoans = () => {
  const [loans, setLoans] = useState([]);

  const fetchLendedLoans = async (lenderAddress) => {
    try {
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, provider);
      const allLoans = await contract.getLenderLoans(lenderAddress);

      const formattedLoans = allLoans
        .filter(loan => loan[2] !== '0x0000000000000000000000000000000000000000') // only lended loans
        .map((loan) => ({
          id: loan[0].toString(),
          farmer: loan[1],
          lender: loan[2],
          amount: ethers.formatEther(loan[3]),
          repaymentPeriod: loan[4].toString(),
          status: "lended",
        }));

      console.log(formattedLoans);
      setLoans(formattedLoans);
    } catch (err) {
      console.log("Error fetching lended loans:", err);
    }
  };

  useEffect(() => {
    const getLenderAddress = async () => {
      const signer = await walletProvider.getSigner();
      const lenderAddress = await signer.getAddress();
      console.log(lenderAddress)
      await fetchLendedLoans(lenderAddress);
    };

    getLenderAddress();

    const handleAccountChange = async () => {
      await getLenderAddress();
    };
    
    window.ethereum.on('accountsChanged', handleAccountChange);
    return () => window.ethereum.removeListener('accountsChanged', handleAccountChange);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4 mb-4">Lended Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} onLend={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default LendedLoans;
