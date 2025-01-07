import { Link } from 'react-router-dom';
import {useState} from 'react';
import {ethers} from 'ethers';
import { useEffect } from 'react';

export default function Home(){

    const [address, setAddress] = useState('Connect Wallet');
    const [balance,setBalance] = useState('');
    const [isConnected,setIsConnected] = useState(false);

    const {ethereum} = window;

    useEffect(() => {
        const checkWalletConnection = async () => {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            const balance = await ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            setBalance(ethers.formatEther(balance));

          }
        };
        
        const storedAddress = localStorage.getItem('isWalletConnected');
        if (storedAddress === 'true') {
          checkWalletConnection();
        }
      });
    
      const requestAccount = async () => {
        await ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
        setAddress(accounts[0]);
        setIsConnected(true);
        const balance = await ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        setBalance(ethers.formatEther(balance));
        localStorage.setItem('isWalletConnected', true);
      };

      const disconnectWallet = ()=>{
        setAddress('');
        setIsConnected(false);
        setBalance('');
        localStorage.removeItem('isWalletConnected');
      }
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
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">
              Farmer Loan Portal
          </h1>
  
          <div className="flex flex-col items-center w-full max-w-md">
              <div className="walletAddress mb-4 w-full text-center">
                  {isConnected && (
                      <p className="bg-green-800 text-white py-2 px-4 rounded shadow-lg">
                          Connected Wallet: {address}
                      </p>
                  )}
              </div>
  
              {isConnected && (
                  <div className="flex flex-wrap justify-center gap-4 w-full mb-6">
                      <Link to="/request">
                          <button
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-lg transition-all"
                          >
                              Loan Request Form
                          </button>
                      </Link>
  
                  </div>
              )}
  
              <div className="disconnect mb-6 w-full text-center">
                  {isConnected && (
                      <button
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-lg transition-all"
                          onClick={disconnectWallet}
                      >
                          Disconnect Wallet
                      </button>
                  )}
              </div>
  
              <div className="grid grid-cols-1 gap-4 w-full text-center">
                  {!isConnected && (
                      <button
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transition-all"
                          onClick={requestAccount}
                      >
                          Connect Wallet
                      </button>
                  )}
  
                  {isConnected && (
                      <Link to="/myloans">
                          <button
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg transition-all"
                          >
                              My Loans
                          </button>
                      </Link>
                  )}
              </div>
          </div>
  
          <footer className="mt-10 text-center text-sm text-green-700">
              Empowering farmers through decentralized technology
          </footer>
      </div>
  );
  
  
  
}