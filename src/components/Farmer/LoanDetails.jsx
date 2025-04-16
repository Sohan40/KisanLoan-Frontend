// // LoanDetails.js
// import React, { useEffect, useState } from "react";

// import { useLocation, useParams, useNavigate} from "react-router-dom";
// import { ethers } from "ethers";
// import Snackbar from "./Snackbar";

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// const walletProvider = new ethers.BrowserProvider(window.ethereum);

// const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

// const LoanDetails = () => {
//   const { loanID } = useParams();
//   console.log('ts',loanID)
//   const navigate = useNavigate();
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const [loans, setLoans] = useState([]);

//   const fetchRequests = async () => {
//     try {
//       const signer = await walletProvider.getSigner();
//       const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
      
//       // console.log('okokok')
//       const loan = await contract.getLoanWithId(loanID);
//       // console.log(loan);
//       console.log('hehe',loan)
//       const Loan = {
//           id: loan[0],
//           lender : loan[2],
//           farmer: loan[1],
//           amount: loan[3],
//           repaymentPeriod: loan[4].toString(),
//           tokenId : loan[9],
//           cid:loan[5],
//           emi:loan[6],
//           emiPaidCount:loan[7],
//           status : {
//             approved:loan[11][0],
//             sanctioned:loan[11][1],
//             rejected:loan[11][2],
//             indefault:loan[11][3]
//           }
//         };
//       setLoans(Loan);
//       // console.log(loans,'ok')

//     } catch (err) {
//       console.log("Error fetching loan data:", err);
//     }
//   };


//   useEffect(() => {
//     fetchRequests();
//   }, []);
//   // Access loan object passed via state


//   const repayEmi = async (id, amount, lender) => {
//     try {
//       const signer = await walletProvider.getSigner();
//       const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);

//       console.log(amount.toString())
//       const tx = await contract.payEmi(id, lender, { value: amount.toString() });
//       await tx.wait();

//       setShowSnackbar(true);
//       setTimeout(() => setShowSnackbar(false), 3000);
//       fetchRequests();
//     } catch (error) {
//       console.error("Error lending money:", error);
//     }
//   };

//   if (!loans || loans.id !== loanID) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//         <p className="text-xl text-gray-700 mb-4">Loan not found or not selected.</p>
//         <button
//           onClick={() => navigate("/myloans")}
//           className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
//       <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Loan Details</h1>
//         <div className="space-y-4">
//           <p>
//             <strong className="text-gray-700">Loan ID:</strong> <span className="text-gray-900">{loans.id}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Farmer:</strong> <span className="text-gray-900">{loans.farmer}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Amount:</strong>{" "}
//             <span className="text-gray-900">{loans.amount.toString()/1e18} ETH</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Repayment Period:</strong>{" "}
//             <span className="text-gray-900">{loans.repaymentPeriod} months</span>
//           </p>
          
//           <p>
//             <strong className="text-gray-700">Sanctioned:</strong>{" "}
//             <span className="text-gray-900">{loans.status.sanctioned ? "Yes" : "No"}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">Document CID:</strong>{" "}
//             <span className="text-gray-900">{loans.cid}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">EMI:</strong>{" "}
//             <span className="text-gray-900">{parseInt(loans.emi)/1e18+ " ETH"}</span>
//           </p>
//           <p>
//             <strong className="text-gray-700">EMI Paid Count:</strong>{" "}
//             <span className="text-gray-900">{loans.emiPaidCount.toString()}</span>
//           </p>
//         </div>

//         <div className="mt-6 flex flex-col gap-4">
//           <button
//             onClick={() => navigate("/myloans")}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Back to Loans
//           </button>

//           {loans.status.sanctioned ? (
//             loans.emiPaidCount < loans.repaymentPeriod ? (
//               <button
//                 className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
//                 onClick={() => repayEmi(loans.id, loans.emi, loans.lender)}
//               >
//                 Repay EMI
//               </button>
//             ) : (
//               <p className="text-green-600 text-lg font-semibold">You have repaid your loan.</p>
//             )
//           ) : (
//             ""
//           )}
//         </div>
//       </div>
//       <Snackbar message="EMI Repayment successful" active={showSnackbar} />
//     </div>
//   );
// };

// export default LoanDetails;
// LoanDetails.js
// LoanDetails.js




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Snackbar from "./Snackbar";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const walletProvider = new ethers.BrowserProvider(window.ethereum);

const LoanContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const LoanContractABI = require('../../artifacts/contracts/LoanRequest.sol/LoanRequest.json').abi;

const LoanDetails = () => {
  const { loanID } = useParams();
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState({ message: '', active: false });
  const [loan, setLoan] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  const fetchLoanDetails = async () => {
    try {
      const signer = await walletProvider.getSigner();
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
      const address = await signer.getAddress();
      setUserAddress(address);

      const loanData = await contract.getLoanWithId(loanID);
      
      const parsedLoan = {
        id: loanData[0],
        farmer: loanData[1],
        lender: loanData[2],
        amount: ethers.formatEther(loanData[3]),
        repaymentPeriod: Number(loanData[4]),
        cid: loanData[5],
        emi: loanData[6].toString(),
        emiPaidCount: Number(loanData[7]),
        nftContract: loanData[8],
        tokenId: Number(loanData[9]),
        lastPaymentDate: new Date(Number(loanData[10]) * 1000),
        status: {
          approved: loanData[11][0],
          sanctioned: loanData[11][1],
          rejected: loanData[11][2],
          inDefault: loanData[11][3]
        }
      };

      setLoan(parsedLoan);
      // console.log(loan)
      calculateTimeRemaining(parsedLoan);
    } catch (err) {
      console.error("Error fetching loan data:", err);
    }
  };

  const calculateTimeRemaining = (loanData) => {
    if (!loanData.status.inDefault) return;
    
    const defaultTime = loanData.lastPaymentDate.getTime() / 1000 + (60);
    const gracePeriodEnd = defaultTime + (60);
    const now = Math.floor(Date.now() / 1000);

    if (now < defaultTime) {
      setTimeRemaining(`Default in: ${Math.ceil((defaultTime - now) / 3600)} hours`);
    } else if (now < gracePeriodEnd) {
      setTimeRemaining(`Liquidation available in: ${Math.ceil((gracePeriodEnd - now) / 3600)} hours`);
    } else {
      setTimeRemaining('Liquidation available now');
    }
  };

  useEffect(() => {
    fetchLoanDetails();
    const interval = setInterval(() => {
      if (loan) calculateTimeRemaining(loan);
    }, 60000);
    return () => clearInterval(interval);
  }, [loan]);

  const handleTransaction = async (action) => {
    try {
      const signer = await walletProvider.getSigner();
      const contract = new ethers.Contract(LoanContractAddress, LoanContractABI, signer);
      
      let tx;
      let successMessage;
      switch(action) {
        case 'payEmi':
          tx = await contract.payEmi(loanID, loan.lender, { 
            value: parseInt(loan.emi).toString()
          });
          successMessage = 'EMI Payment Successful!';
          break;
        case 'checkDefault':
          tx = await contract.checkDefault(loanID);
          successMessage = 'Default Status Updated';
          break;
        case 'liquidate':
          tx = await contract.liquidateCollateral(loanID);
          successMessage = 'Collateral Liquidated';
          break;
        default:
          throw new Error('Invalid action');
      }

      await tx.wait();
      setShowSnackbar({ message: successMessage, active: true });
      setTimeout(() => setShowSnackbar({ ...showSnackbar, active: false }), 3000);
      await fetchLoanDetails();
      
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      setShowSnackbar({ 
        message: error.reason || error.message || 'Transaction failed', 
        active: true 
      });
    }
  };

  if (!loan) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-700 mb-4">Loading loan details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Loan Details</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong className="text-gray-700">Loan ID:</strong> 
              <span className="text-gray-900 break-all">{loan.id}</span>
            </p>
            <p>
              <strong className="text-gray-700">Farmer:</strong> 
              <span className="text-gray-900 break-all">{loan.farmer}</span>
            </p>
            <p>
              <strong className="text-gray-700">Lender:</strong> 
              <span className="text-gray-900 break-all">
                {loan.lender || "Not assigned"}
              </span>
            </p>
            <p>
              <strong className="text-gray-700">Amount:</strong> 
              <span className="text-gray-900">{loan.amount} ETH</span>
            </p>
            <p>
              <strong className="text-gray-700">Repayment Period:</strong> 
              <span className="text-gray-900">{loan.repaymentPeriod} months</span>
            </p>
            <p>
              <strong className="text-gray-700">EMI Amount:</strong> 
              <span className="text-gray-900">{parseInt(loan.emi)/1e18} ETH</span>
            </p>
            <p>
              <strong className="text-gray-700">EMIs Paid:</strong> 
              <span className="text-gray-900">
                {loan.emiPaidCount} / {loan.repaymentPeriod}
              </span>
            </p>
            <p>
              <strong className="text-gray-700">Last Payment:</strong> 
              <span className="text-gray-900">
                {loan.lastPaymentDate.toLocaleDateString()}
              </span>
            </p>
            <p>
              <strong className="text-gray-700">NFT Collateral:</strong> 
              <span className="text-gray-900 break-all">
                Token ID: {loan.tokenId}<br/>
                Contract: {loan.nftContract}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong className="text-gray-700">Sanctioned:</strong> 
                <span className={loan.status.sanctioned ? "text-green-600" : "text-red-600"}>
                  {loan.status.sanctioned ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">Approved:</strong> 
                <span className={loan.status.approved ? "text-green-600" : "text-red-600"}>
                  {loan.status.approved ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">Rejected:</strong> 
                <span className={loan.status.rejected ? "text-red-600" : "text-gray-600"}>
                  {loan.status.rejected ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">In Default:</strong> 
                <span className={loan.status.inDefault ? "text-red-600" : "text-green-600"}>
                  {loan.status.inDefault ? "Yes" : "No"}
                </span>
              </p>
            </div>
            
            {timeRemaining && (
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-yellow-600">
                  {timeRemaining}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p>
              <strong className="text-gray-700">Document CID:</strong> 
              <span className="text-gray-900 break-all">{loan.cid}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => navigate("/myloans")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Loans
          </button>

          {loan.status.sanctioned && !loan.status.inDefault && (
            <div className="space-y-4">
              {loan.emiPaidCount < loan.repaymentPeriod ? (
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full transition-colors"
                  onClick={() => handleTransaction('payEmi')}
                >
                  Pay EMI ({loan.emi/1e18} ETH)
                </button>
              ) : (
                <p className="text-green-600 text-lg font-semibold text-center">
                  Loan Fully Repaid!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Snackbar 
        message={showSnackbar.message} 
        active={showSnackbar.active} 
        onClose={() => setShowSnackbar({ ...showSnackbar, active: false })}
      />
    </div>
  );
};

export default LoanDetails;