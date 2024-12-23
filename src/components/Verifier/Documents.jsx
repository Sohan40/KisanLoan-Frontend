import React,{useState,useEffect} from "react";
import { ethers } from "ethers";
import { useLocation, useParams } from "react-router-dom";
import { PinataSDK } from "pinata-web3";
import PDFViewerPopup from './PdfViewer';

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
  const {loan} = useLocation().state || {}

  useEffect(() => {

    const fetchFileCids = async () => {
      try {
        // Fetch data from Pinata
        const data = await pinata.gateways.get(
          loan.cid
        );

        // Extract and map CIDs to full URLs
        const links = data.data.documents.map(
          (cid) =>`${pinata.config.pinataGateway}\/ipfs\/${cid}`
        );

        setPdfLinks(links); // Update state with the links
      } catch (error) {
        console.error("Error fetching file CIDs:", error);
        setError("Failed to fetch PDF links");
      } finally {

        setLoading(false); // Stop loading
      }
    };

    fetchFileCids(); // Call the function
  },[]); 


  // console.log(loan.cid);
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
    <>
    <div>
      <h2 className="text-2xl font-semibold text-center my-6">Documents</h2>

      {/* Map over the array to display each PDF link */}
      <div className="space-y-4">
        
        {console.log(pdfLinks)}
        {pdfLinks.map((pdfUrl, index) => (
  
          <div key={index} className="flex justify-center">
            <button
              onClick={() => openModal(pdfUrl)}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg"
            >
              View Document {index + 1}
            </button>
          </div>
        ))}
      </div>

      {/* Pass the selected PDF URL to the PDFViewerPopup */}
      {isModalOpen && (
        <PDFViewerPopup
          pdfUrl={currentPdfUrl}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}
    </div>

    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents {loan.cid}</h2>
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
    </>
   
  );
}
