const main = async () =>{
  //hre is hardhat runtime environment
  const [deployer] = await hre.ethers.getSigners();
  console.log(deployer)  //it contain the information of gasLimit, address, provider etc
  const accountBalance = await deployer.provider.getBalance(deployer.address);

  console.log('the contract is deployed by : ',deployer.address)
  console.log('the account Balance is of deployer : ',accountBalance.toString())

  //we take the contract from getContractFactory function
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  //here we deploying it
  const waveContract = await waveContractFactory.deploy({value: hre.ethers.parseEther("0.1")});   //contract was funded
  //here contract gets deployed
  await waveContract.target;
  //here we taking the deployed address by target
  console.log('the address of deployed contract : ',waveContract.target);

}

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();



  //we made this for the localhost node of hardhat 
  //we can create the 20 diff accounts by npx hardhat node
  //we can run it by npx hardhat run script/deploy.js --network localhost
  //here we need above 6.0.0 version of ethers for runnig this