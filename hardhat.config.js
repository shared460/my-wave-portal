require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

task("accounts","print all accounts",async(taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for(account of accounts){
    console.log(account.address);
  }
});
 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

//deployed address -> 0x20D9Ef9388fAAEFdcE35555d1B4268005972Ee8a
//account depyoer balacne in wei -> 1209334502655097943
//deployed by -> 0xAe5486C5d4F710ded1Be53E2D6085901507f4A5D (public key)
