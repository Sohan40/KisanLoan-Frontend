import React, { useState, useEffect } from "react";
import MyLoans from "./MyLoans";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import SanctionedLoans from "./SanctionedLoans";

const LendersDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("requested");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          className={`w-full py-2 px-4 rounded ${selectedOption === "requested" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setSelectedOption("requested"); setIsSidebarOpen(false); }}
        >
          Requested Loans
        </button>
        <button
          className={`w-full py-2 px-4 rounded ${selectedOption === "sanctioned" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setSelectedOption("sanctioned"); setIsSidebarOpen(false); }}
        >
          Sanctioned Loans
        </button>
      </aside>

      <main className="flex-grow p-6 md:ml-0">
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-800 bg-gray-200 rounded-md focus:outline-none">
            <AiOutlineMenu size={24} />
          </button>
        </div>

        {selectedOption === "requested" ? <MyLoans /> : <SanctionedLoans />}
      </main>
    </div>
  );
};

export default LendersDashboard;
