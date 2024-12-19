import React from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI =
  require("../../artifacts/contracts/LoanRequest.sol/LoanRequest.json").abi;

export default function Documents() {
  const { loanID } = useParams();

  const approve = async () => {
    const signer = await walletProvider.getSigner();
    const contract = new ethers.Contract(
      LoanContractAddress,
      LoanContractABI,
      signer
    );
    const tx = await contract.approveLoan(loanID);
    tx.wait();
  };
  const removeLoan = async () => {
    const signer = await walletProvider.getSigner();
    const contract = new ethers.Contract(
      LoanContractAddress,
      LoanContractABI,
      signer
    );
    const tx = await contract.deleteLoan(loanID);
    tx.wait();
  };
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents</h2>
      <div className="flex justify-around space-x-4">
        <button
          onClick={removeLoan}
          className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Decline
        </button>
        <button
          onClick={approve}
          className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
