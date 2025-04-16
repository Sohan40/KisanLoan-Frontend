import React, { useState } from "react";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import { useNavigate } from "react-router-dom";

const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: process.env.REACT_APP_GATEWAY_URL,
});

// Contract details
const LoanContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;
const NFTContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Add your NFT contract address
const NFTContractABI = require('../../artifacts/contracts/landNFT.sol/LandDocumentNFT.json').abi;

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
  const [mintingStatus, setMintingStatus] = useState("");
  const [tokenId, setTokenId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event, documentKey) => {
    if (event.target.files) {
      setDocuments((prevDocuments) => ({
        ...prevDocuments,
        [documentKey]: event.target.files[0],
      }));
    }
  };

  const uploadFilesToPinata = async () => {
    try {
      setUploadStatus("Uploading files to Pinata...");
      const uploadedHashes = [];
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

  const uploadMetadata = async (fileHashes) => {
    try {
      const metadata = { documents: fileHashes };
      const upload = await pinata.upload.json(metadata);
      return upload.IpfsHash;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };

  const submitRequest = async () => {
    if (!loanAmount || !repaymentPeriod || Object.values(documents).some(doc => !doc)) {
      alert("Please fill all fields and upload all documents.");
      return;
    }

    let fileHashes = [];
    let finalHash = "";
    try {
      // Upload documents
      fileHashes = await uploadFilesToPinata();
      finalHash = await uploadMetadata(fileHashes);

      // Connect to Ethereum
      const walletProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await walletProvider.getSigner();

      // Mint NFT
      setMintingStatus("Minting land document NFT...");
      const nftContract = new ethers.Contract(
        NFTContractAddress,
        NFTContractABI,
        signer
      );
      
      const mintTx = await nftContract.mintLandNFT(
        await signer.getAddress(),
        `ipfs://${finalHash}`
      );
      const mintReceipt = await mintTx.wait();
      console.log(mintReceipt)

      const transferEvent = mintReceipt.logs
      .map(log => {
        try {
          return nftContract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find(event => event?.name === "Transfer");

    if (!transferEvent) {
      throw new Error("Transfer event not found");
    }

       const tokenId = transferEvent.args.tokenId.toString();
    
      setTokenId(tokenId);
      setMintingStatus("NFT minted successfully!");

      // Approve loan contract to transfer NFT
      setMintingStatus("Approving NFT transfer...");
      const approveTx = await nftContract.approve(
        LoanContractAddress,
        tokenId
      );
      await approveTx.wait();

      // Submit loan request with NFT collateral
      const loanContract = new ethers.Contract(
        LoanContractAddress,
        LoanContractABI,
        signer
      );

      const tx = await loanContract.requestLoan(
        ethers.parseUnits(loanAmount),
        parseInt(repaymentPeriod),
        finalHash,
        NFTContractAddress,  // New NFT contract address parameter
        tokenId        // New token ID parameter
      );
      await tx.wait();

      alert("Loan request with NFT collateral submitted successfully!");
      // Reset form
      setLoanAmount("");
      setRepaymentPeriod("");
      setDocuments({
        document1: null,
        document2: null,
        document3: null,
        document4: null,
      });
      setTokenId(null);
      setMintingStatus("");
      navigate('/myloans');
    } catch (error) {
      console.error("Error in loan request process:", error);
      setMintingStatus("Transaction failed. See console for details.");

      // Cleanup: Unpin files if error occurs after upload
      if (fileHashes.length > 0) {
        try {
          await pinata.unpin(fileHashes);
          if (finalHash) await pinata.unpin([finalHash]);
        } catch (unpinError) {
          console.error("Cleanup failed:", unpinError);
        }
      }

      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Request Loan with NFT Collateral
        </h1>
        
        {/* Existing form inputs */}
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
        
        {/* Document upload sections */}
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label className="form-label mb-2 block text-green-800 font-bold">
              Upload Document {num}
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, `document${num}`)}
              className="mb-4"
            />
          </div>
        ))}

        {/* Status indicators */}
        {uploadStatus && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">{uploadStatus}</p>
          </div>
        )}
        
        {mintingStatus && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600">{mintingStatus}</p>
            {tokenId && (
              <p className="text-sm text-purple-600 mt-2">
                Minted NFT Token ID: {tokenId}
              </p>
            )}
          </div>
        )}

        <button
          onClick={submitRequest}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg w-full transition-all"
          disabled={!!mintingStatus}
        >
          {tokenId ? "Submit Loan Request" : "Start Loan Process"}
        </button>
      </div>
    </div>
  );
};

export default RequestLoan;