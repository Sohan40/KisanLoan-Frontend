// import React, { useState } from "react";
// import { ethers } from "ethers";

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// const walletProvider = new ethers.BrowserProvider(window.ethereum);

// const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;



// const RequestLoan = () => {
//   const [loanAmount, setLoanAmount] = useState("");
//   const [repaymentPeriod, setRepaymentPeriod] = useState("");
//   const [documents, setDocuments] = useState("");

//   const submitRequest = async () => {

//     if (loanAmount && repaymentPeriod && documents) {
    
//       try {

//         const signer = await walletProvider.getSigner();
        
//         const sendContractTx = new ethers.Contract(
//           LoanContractAddress,
//           LoanContractABI,
//           signer
//         );
        
//         console.log(signer);

//         const tx = await sendContractTx.requestLoan(
//           parseInt(loanAmount),
//           parseInt(repaymentPeriod),
//         );
//         await tx.wait();



//       } catch (error) {
//         console.error("Error adding loan:", error);
//       }

//       // Assuming you have a function to handle the request submission
      
//       // Reset form fields
//       setLoanAmount("");
//       setRepaymentPeriod("");
//       setDocuments("");
//     }
//   };

  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 flex items-center justify-center">
//         <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//             <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center">Request a Loan</h1>
//             <input
//                 type="number"
//                 placeholder="Loan Amount"
//                 value={loanAmount}
//                 onChange={(e) => setLoanAmount(e.target.value)}
//                 className="border border-green-300 rounded-lg p-3 mb-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
//             />
//             <input
//                 type="number"
//                 placeholder="Repayment Period (Months)"
//                 value={repaymentPeriod}
//                 onChange={(e) => setRepaymentPeriod(e.target.value)}
//                 className="border border-green-300 rounded-lg p-3 mb-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
//             />
//             {/* Add input tags for files uppload*/}
//             <button
//                 onClick={submitRequest}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg w-full transition-all"
//             >
//                 Submit Request
//             </button>
//         </div>
//     </div>
// );

// };

// export default RequestLoan;

import React, { useState } from "react";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: process.env.REACT_APP_GATEWAY_URL,
});

console.log(pinata.config);
// Replace with your contract details
const LoanContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const RequestLoan = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [documents, setDocuments] = useState({
    document1: null,
    document2: null,
    document3: null,
    document4: null,
  });
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file input changes
  const handleFileChange = (event, documentKey) => {
    if (event.target.files) {
      setDocuments((prevDocuments) => ({
        ...prevDocuments,
        [documentKey]: event.target.files[0], // store only the first file
      }));
    }
  };

  // Upload files to Pinata and return their IPFS hashes
  const uploadFilesToPinata = async () => {
    try {
      setUploadStatus("Uploading files to Pinata...");
      const uploadedHashes = [];
      // Upload each document
      for (const key in documents) {
        const file = documents[key];
        if (file) {
          const upload = await pinata.upload.file(file);
          uploadedHashes.push(upload.IpfsHash);
        }
      }
      setUploadStatus("Files uploaded successfully!");
      return uploadedHashes;
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("File upload failed.");
      throw error;
    }
  };

  // Upload metadata with all IPFS hashes and return final IPFS hash
  const uploadMetadata = async (fileHashes) => {
    try {
      const metadata = {
        documents: fileHashes,
      };

      // Upload metadata object to Pinata
      const upload = await pinata.upload.json(metadata);
      return upload.IpfsHash;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };

  // Submit loan request
  const submitRequest = async () => {
    if (!loanAmount || !repaymentPeriod || Object.values(documents).some(doc => !doc)) {
      alert("Please fill all fields and upload all documents.");
      return;
    }

    try {
      // Upload files to Pinata and get their IPFS hashes
      const fileHashes = await uploadFilesToPinata();
      console.log("File hashes:", fileHashes);

      // Upload metadata with all IPFS hashes and get final IPFS hash
      const finalHash = await uploadMetadata(fileHashes);
      console.log("Final IPFS hash:", finalHash);

      // Connect to Ethereum
      const walletProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await walletProvider.getSigner();

      const loanContract = new ethers.Contract(
        LoanContractAddress,
        LoanContractABI,
        signer
      );

      // Send loan request transaction with the final IPFS hash
      const tx = await loanContract.requestLoan(
        loanAmount, // Loan amount in Ether
        repaymentPeriod, // Repayment period in months
        finalHash // Final IPFS hash containing all document hashes
      );
      await tx.wait();

      alert("Loan request submitted successfully!");
      setLoanAmount("");
      setRepaymentPeriod("");
      setDocuments({
        document1: null,
        document2: null,
        document3: null,
        document4: null,
      });
    } catch (error) {
      console.error("Error submitting loan request:", error);
      alert("Failed to submit loan request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Request a Loan
        </h1>
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          className="border border-green-300 rounded-lg p-3 mb-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Repayment Period (Months)"
          value={repaymentPeriod}
          onChange={(e) => setRepaymentPeriod(e.target.value)}
          className="border border-green-300 rounded-lg p-3 mb-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <label className="form-label mb-2 block text-green-800 font-bold">
          Upload Document 1
        </label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "document1")}
          className="mb-4"
        />
        <label className="form-label mb-2 block text-green-800 font-bold">
          Upload Document 2
        </label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "document2")}
          className="mb-4"
        />
        <label className="form-label mb-2 block text-green-800 font-bold">
          Upload Document 3
        </label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "document3")}
          className="mb-4"
        />
        <label className="form-label mb-2 block text-green-800 font-bold">
          Upload Document 4
        </label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "document4")}
          className="mb-4"
        />
        <button
          onClick={submitRequest}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg w-full transition-all"
        >
          Submit Request
        </button>
        {uploadStatus && (
          <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
};

export default RequestLoan;
