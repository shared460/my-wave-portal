//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//due to this we are able to console.log in our smart contract
import "hardhat/console.sol";

contract WavePortal{
    uint256 totalWaves;
    uint256 private seed;

    mapping(address => uint256) public lastWavedAt;

    //event
    event NewWave(address indexed from, uint256 timestamp, string message);

    //we should use payable in constructor
    constructor() payable{
        console.log('hi');

        //setting up the intial seed
        seed = (block.timestamp + block.difficulty)%100;
    }

    //struct 
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    //making an dynamic array of struct waves
    Wave[] waves;

    //msg.sender is the address of person who caling it
    function wave(string memory _message) public{

        //this is for waiting the 15 min
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp );

        //setting the current timestamp
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves+=1;
        console.log("%s has waved : ",msg.sender, _message);

        //setting up the wave seed
        seed = (block.timestamp + block.difficulty ) % 100;
        console.log('random number -> ',seed);
        //difficult in any block inscrease as there is more transaction in block


        //pushingthe data in array
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);


        if(seed <= 50){
            console.log(msg.sender);
            //here we are trying to give money to all who are waving at us
            uint256 prizeAmount = 0.001 ether;   //ethers ehich type of unit
            require(prizeAmount <= address(this).balance);   //prizeAmount sholud be less then contract balance
            (bool success, ) = (msg.sender).call{value:prizeAmount}("");
            require(success,'failed to withdrawn money from account');
        }

        //require -> if some condition is true then fullfill the function otherwise cancel the transaction and exit function
        //address(this).balance is balance of contract itself
        //so we have to fund some eth to contract -> 

    }

    //returning of array
    function getAllWaves() public view returns(Wave[] memory){
        return(waves);
    }


    //it will return the total number of waves
    function getTotalWaves() public view returns(uint256){
        console.log("we have %d total waves!",totalWaves);
        return totalWaves;
    }
}