// import React,{useState,useEffect} from "react";
// import { ethers } from "ethers";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { PinataSDK } from "pinata-web3";
// import PDFViewerPopup from './PdfViewer';

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// const walletProvider = new ethers.BrowserProvider(window.ethereum);

// const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const LoanContractABI = require("../../artifacts/contracts/LoanRequest.sol/LoanRequest.json").abi;


// const pinata = new PinataSDK({
//   pinataJwt: process.env.REACT_APP_PINATA_JWT,
//   pinataGateway: process.env.REACT_APP_GATEWAY_URL,
// });



// export default function Documents() {

//   const [pdfLinks, setPdfLinks] = useState([]); // State to store PDF links
//   const [loading, setLoading] = useState(true); // State to handle loading
//   const [error, setError] = useState(null); // State to handle errors
//   const {loan} = useLocation().state || {}

//   const navigate = useNavigate();

//   let fileCids = [];

//   useEffect(() => {

//     const fetchFileCids = async () => {
//       try {
//         // Fetch data from Pinata
//         const data = await pinata.gateways.get(
//           loan.cid
//         );

//         fileCids = data.data.documents;
//         // Extract and map CIDs to full URLs
//         const links = data.data.documents.map(
//           (cid) =>`${pinata.config.pinataGateway}\/ipfs\/${cid}`
//         );

//         setPdfLinks(links); // Update state with the links
//       } catch (error) {
//         console.error("Error fetching file CIDs:", error);
//         setError("Failed to fetch PDF links");
//       } finally {

//         setLoading(false); // Stop loading
//       }
//     };

//     fetchFileCids(); // Call the function
//   },[]); 


//   // console.log(loan.cid);
//   const { loanID } = useParams();

  
   
//   const approve = async () => {
//     const signer = await walletProvider.getSigner();
//     const contract = new ethers.Contract(
//       LoanContractAddress,
//       LoanContractABI,
//       signer
//     );
//     const tx = await contract.approveLoan(loanID);
//     tx.wait();

//     navigate("/verifier/dashboard")
//   };
//   const removeLoan = async () => {

//     console.log(fileCids);
//     await pinata.unpin(fileCids);
//     await pinata.unpin([loan.cid]);
//     const signer = await walletProvider.getSigner();
//     const contract = new ethers.Contract(
//       LoanContractAddress,
//       LoanContractABI,
//       signer
//     );
//     const tx = await contract.rejectLoan(loanID);
//     tx.wait();
//     navigate("/verifier/dashboard")

//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPdfUrl, setCurrentPdfUrl] = useState(null);

  
//   const openModal = (pdfUrl) => {
//     setCurrentPdfUrl(pdfUrl);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentPdfUrl(null);
//   };

//   return (
//     <>
//     <div>
//       <h2 className="text-2xl font-semibold text-center my-6">Documents</h2>

//       {/* Map over the array to display each PDF link */}
//       <div className="space-y-4">
        
//         {console.log(pdfLinks)}
//         {pdfLinks.map((pdfUrl, index) => (
  
//           <div key={index} className="flex justify-center">
//             <button
//               onClick={() => openModal(pdfUrl)}
//               className="bg-blue-500 text-white py-2 px-6 rounded-lg"
//             >
//               View Document {index + 1}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Pass the selected PDF URL to the PDFViewerPopup */}
//       {isModalOpen && (
//         <PDFViewerPopup
//           pdfUrl={currentPdfUrl}
//           isModalOpen={isModalOpen}
//           closeModal={closeModal}
//         />
//       )}
//     </div>

//     <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents {loan.cid}</h2>
//       <div className="flex justify-around space-x-4">
//         <button
//           onClick={removeLoan}
//           className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
//         >
//           Decline
//         </button>
//         <button
//           onClick={approve}
//           className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//     </>
   
//   );
// }
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PinataSDK } from "pinata-web3";
import PDFViewerPopup from "./PdfViewer";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require("../../artifacts/contracts/LoanRequest.sol/LoanRequest.json").abi;

const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: process.env.REACT_APP_GATEWAY_URL,
});

export default function Documents() {
  const [pdfLinks, setPdfLinks] = useState([]); // State to store PDF links
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const { loan } = useLocation().state || {};

  const navigate = useNavigate();

  let fileCids = [];

  useEffect(() => {
    const fetchFileCids = async () => {
      try {
        console.log(loan.cid)
        const data = await pinata.gateways.get(loan.cid);

        fileCids = data.data.documents;
        const links = data.data.documents.map(
          (cid) => `${pinata.config.pinataGateway}/ipfs/${cid}`
        );

        setPdfLinks(links);
      } catch (error) {
        console.error("Error fetching file CIDs:", error);
        setError("Failed to fetch PDF links");
      } finally {
        setLoading(false);
      }
    };

    fetchFileCids();
  }, []);

  const { loanID } = useParams();

  const approve = async () => {
    const signer = await walletProvider.getSigner();
    const contract = new ethers.Contract(
      LoanContractAddress,
      LoanContractABI,
      signer
    );
    const tx = await contract.approveLoan(loanID);
    await tx.wait();

    navigate("/verifier/dashboard");
  };

  const removeLoan = async () => {
    await pinata.unpin(fileCids);
    await pinata.unpin([loan.cid]);
    const signer = await walletProvider.getSigner();
    const contract = new ethers.Contract(
      LoanContractAddress,
      LoanContractABI,
      signer
    );
    const tx = await contract.rejectLoan(loanID);
    await tx.wait();

    navigate("/verifier/dashboard");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);

  const openModal = (pdfUrl) => {
    setCurrentPdfUrl(pdfUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Documents</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading documents...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {pdfLinks.map((pdfUrl, index) => (
              <div key={index} className="flex justify-center">
                <button
                  onClick={() => openModal(pdfUrl)}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  View Document {index + 1}
                </button>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <PDFViewerPopup
            pdfUrl={currentPdfUrl}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
        )}
      </div>

      <div className="mt-10 max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Actions</h2>

        <div className="flex justify-between">
          <button
            onClick={removeLoan}
            className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Decline
          </button>
          <button
            onClick={approve}
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
