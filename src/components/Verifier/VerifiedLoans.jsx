import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanCard from "./LoanCard";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI =
  require("../../artifacts/contracts/LoanRequest.sol/LoanRequest.json").abi;

const VerifiedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchVerifiedLoans = async (VerifierAddress) => {
    try {
      const contract = new ethers.Contract(
        LoanContractAddress,
        LoanContractABI,
        provider
      );
      const allLoans = await contract.getLoans();

      const formattedLoans = allLoans
        .filter((loan) => loan[5] === true) // only Verified loans
        .map((loan) => ({
          id: loan[0].toString(),
          farmer: loan[1],
          Verfier: loan[2],
          amount: ethers.formatEther(loan[3]),
          repaymentPeriod: loan[4].toString(),
          status: "verified",
        }));
      console.log(allLoans);
      console.log(formattedLoans);
      setLoans(formattedLoans);
      setErrorMessage(""); // Reset error message on successful fetch
    } catch (err) {
      console.log("Error fetching Verified loans:", err);
      setErrorMessage("Error fetching loans. Please try again.");
    }
  };

  useEffect(() => {
    const getVerifierAddress = async () => {
      const signer = await walletProvider.getSigner();
      const VerifierAddress = await signer.getAddress();
      console.log(VerifierAddress);

      if (VerifierAddress === "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720") {
        await fetchVerifiedLoans(VerifierAddress);
      } else {
        setErrorMessage("You are not a verified verifier. Access denied.");
      }
    };

    getVerifierAddress();

    const handleAccountChange = async () => {
      await getVerifierAddress();
    };

    window.ethereum.on("accountsChanged", handleAccountChange);
    return () =>
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-4 mb-4">Verified Loans</h2>
      {errorMessage && (
        <div className="text-red-500 bg-red-100 border border-red-400 p-4 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} onLend={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default VerifiedLoans;
