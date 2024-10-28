import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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

    return (
        <div>
            <h1>This is Home</h1>
            <div className="walletAddress">
                {
                    isConnected &&
                    <p className='bg-black text-white py-2 px-4 rounded'>{address}</p>
                }
            </div>
            <div className="disconnect">
                {
                    isConnected &&
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={disconnectWallet}>Disconnect wallet</button>
                }
            </div>

            <div className="grid grid-cols-2 gap-2">
                {
                    !isConnected &&
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={requestAccount}>Connect wallet</button>
                }
                
                
                {
                    isConnected&&
                    <Link to="/register"><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Register</button></Link>
                }
                
            </div>

        </div>
    )
}