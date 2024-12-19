// AllRequests.js
import React, { useState } from "react";
import LoanRequests from "./LoanRequests";
import VerifiedLoans from "./VerifiedLoans";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const VerifierDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("allLoans");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 space-y-4 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64`}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white bg-gray-700 rounded-md focus:outline-none">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <button
          className={`w-full py-2 px-4 rounded ${selectedOption === "allLoans" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setSelectedOption("allLoans"); setIsSidebarOpen(false); }}
        >
          All Loans
        </button>
        <button
          className={`w-full py-2 px-4 rounded ${selectedOption === "lendedLoans" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setSelectedOption("lendedLoans"); setIsSidebarOpen(false); }}
        >
          Lended Loans
        </button>
      </aside>

      <main className="flex-grow p-6 md:ml-0">
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-800 bg-gray-200 rounded-md focus:outline-none">
            <AiOutlineMenu size={24} />
          </button>
        </div>

        {selectedOption === "allLoans" ? <LoanRequests /> : <VerifiedLoans />}
      </main>
    </div>
  );
};

export default VerifierDashboard;
