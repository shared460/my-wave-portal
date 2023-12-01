import React from "react";
import { useEffect } from "react";
import { ethers } from "ethers";
import ABI from './utils/WavePortal.json'

const ethereumObject = () => window.ethereum;

    // useEffect(()=>{
    //     const ethereum = ethereumObject();
    //     if(!ethereum){
    //         console.log('Make sure you have Metamask!')
    //     }else{
    //         console.log('we have the ethereum object',ethereum)
    //     }
    // },[])

    const findMetaMaskAccount = async () => {
        try{
            const ethereum = ethereumObject();
            if(!ethereum){
                console.log('Make sure you have ethereum Wallet');
                return(null);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if(accounts.length !== 0){
                const account = accounts[0];
                console.log('find an authorise account');
                return(account);
            }else{
                console.error('no account has been found');
                return(null);
            }
        }catch(error){
            console.log(error);
            return(null)
        }
    }   

    export default function App(){

        const [currentAccount, setAccount] = React.useState("")
        const [waves, setWaves] = React.useState([]);
        const [text, setText] = React.useState("");

        //this stores the deployed address of contract
        const contractAddress = "0x3fFA64b1bC148C41a0129da98B4fAAf061d8857f"
        //this stores the ABI code of contract
        const ABIOfContract = ABI.abi;


        //method that get all the waves from contract
        const getAllTheWaves = async() =>{
            try{
                const { ethereum } = window;
                if(ethereum){
                    const provider = new ethers.BrowserProvider(ethereum)
                    const signer = await provider.getSigner();
                    const waveContract = new ethers.Contract(contractAddress, ABIOfContract, signer);

                    //calling the wave method to get all the waves
                    const waves = await waveContract.getAllWaves()
                    //making the data array only
                    let wavesCleaned = [];
                    waves.forEach((wave)=>{
                        wavesCleaned.push({
                            address:wave.waver,
                            timestamp:Number(wave.timestamp),
                            message:wave.message,
                        })
                    })

                    setWaves(wavesCleaned);
                }else{
                    console.log('ethereum dosent exist');
                }
            }catch(error){
                console.log(error);
            }
        }

        const connectWallet = async () => {
            try {
              const ethereum = ethereumObject();
              if (!ethereum) {
                alert("Get MetaMask!");
                return;
              }
        
              const accounts = await ethereum.request({
                method: "eth_requestAccounts",
              });
        
              console.log("Connected", accounts[0]);
              setAccount(accounts[0]);
            } catch (error) {
              console.error(error);
            }
          };

          useEffect(async () => {
            const account = await findMetaMaskAccount();
            if (account !== null) {
              setAccount(account);
            }
            getAllTheWaves();
          }, []);


        //ethers -> library used for frontend -> import { ethers } from 'ethers
        //here provider is the node we are using provided by metamask wallet
        const wave = async() => {
            try{
                const { ethereum } = window;
                //here ethereum is same as of window and window.object
               if(ethereum){
                    //provider helps the dapp to communicate with ethereum
                    const provider = new ethers.BrowserProvider(ethereum);
                    //here keep await as it returns promises
                    const signer = await provider.getSigner();
                    //we have to make the new contract containing old contract address, ABI, signer
                    const wavePortalContract = new ethers.Contract(contractAddress, ABIOfContract ,signer);
                    // let count = await wavePortalContract.getTotalWaves();

                    


                    /** Execute the actual wave from your smart contracts*/
                    // const waveTxn = await wavePortalContract.wave('this is message');
                    // console.log("Mining...", waveTxn.hash);
                    // await waveTxn.wait();    //wait for the transaction to be mined

                    // count = await wavePortalContract.getTotalWaves();
                    // console.log('total number of waves ',Number(count));
                    const waveTxn = await wavePortalContract.wave(text, {gasLimit:300000});  //is less gas is used the remianing will be refunded
                    await waveTxn.wait();
                }
            }catch(error){
                console.log(error);

            }
        }  

        function changeValue(e){
            setText(e.target.value);
            console.log(text)
        }
        

    return(        
        <div className='mainContainer'>
            <div className='dataContainer'>
                <div className='heading'>
                    My-Wave-Portal
                </div>
                <div className='para'>
                    <p>Hello, I am sharad and currently learning web3, give me the hifi! or wave me by Clicking 👋</p>
                </div>
                <div className='msg-box'>
                    <input type='text' onChange={changeValue} placeholder='message here...'/>
                </div>
                <button onClick={wave}>Wave ME! 😁</button>
                {!currentAccount && <button onClick={ connectWallet }>Connect Wallet</button>}
                {
                    waves.map((wave,index)=>{
                        return ( <div key={index} className='list'> 
                            <div>address : {wave.address}</div>
                            <div>message : {wave.message}</div>
                            <div>timestamp : {wave.timestamp}</div>
                        </div> )
                    })
                }
            </div>
        </div>
    )
}