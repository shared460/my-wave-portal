const main = async () =>{
    //here we first taking the persmision and limits of two persons
    //in signer the first one is deployer
    const[owner, randomPerson] = await hre.ethers.getSigners();
    
    //collecting the contract from the other docs
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
    //deploying the contract
    const waveContract = await waveContractFactory.deploy({value: hre.ethers.parseEther('0.1')});   //funding of 0.1 ethers on deploying
    //contract has been deployed
    await waveContract.target;
    //printing the deployed contract address
    console.log('contract deployed to : ',waveContract.target);
    //address of the person name owner who participate in contract
    console.log('owner of the contract or contract deployed by : ',owner.address);

    //getting balance of contract
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.target);
    console.log(contractBalance)
    //in version >6 we dont need utils
    console.log('balance in ethers : ',hre.ethers.formatEther(contractBalance));

    //this is of owner
    const firstWaveTxn = await waveContract.wave('Hello i am feeling sad!');
    await firstWaveTxn.wait();   //wait for the transaction to be mined

    //getting balance of contract
    contractBalance = await hre.ethers.provider.getBalance(waveContract.target);
    console.log('balance in ethers : ',hre.ethers.formatEther(contractBalance));
    

    //this is of random person
    const randomWaveTxn = await waveContract.connect((randomPerson)).wave('hello, i am felling good now');
    await randomWaveTxn.wait();  //wait for transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(waveContract.target);
    console.log('balance in ethers : ',hre.ethers.formatEther(contractBalance));

    const allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

    await waveContract.getTotalWaves();
}

const runMain = async () =>{
    try {
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain();


//to run this -> npx hardhat run scripts/run.js
//it is instant testing and instant destroy account by hardhat