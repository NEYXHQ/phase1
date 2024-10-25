// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SUYT1TokenSale is ReentrancyGuard {
    address public owner;               // Owner of the contract
    IERC20 public tokenContract;        // The ERC20 token being sold (SUYT1)
    uint256 public tokenPrice;          // Price of one token in wei (ETH's smallest unit)
    uint256 public supply;              // Tokens available for sale

    event DebugLog(string message, uint256 value);

    // Modifier to restrict functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to initialize the contract
    constructor(IERC20 _tokenContract) {
        owner = msg.sender;
        tokenContract = _tokenContract;
    }

    // Function to set the price of each token (in wei) for a full
    function setTokenPrice(uint256 _price) public onlyOwner {
        tokenPrice = _price;
    }

    // Function to deposit tokens into the sale contract (increase supply)
    function depositTokens(uint256 amount) public onlyOwner {
        // Transfer tokens from the owner to this contract
        require(tokenContract.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        supply += amount;
    }

    // Function to allow users to buy tokens by sending ETH
    function buyTokens(uint256 numTokens) public payable nonReentrant {
        require(numTokens > 0, "Number of tokens must be greater than zero");
        uint256 totalCost = numTokens * tokenPrice;

        // Emit the event to log the total ETH in Wei
        emit DebugLog("Total cost calculated:", totalCost);
        
        require(msg.value == totalCost, "Incorrect amount of ETH sent");
        require(supply >= numTokens, "Not enough tokens available");

        // Transfer tokens to the buyer first (internal effect)
        require(tokenContract.transfer(msg.sender, numTokens * 10**18), "Token transfer failed");

        // Reduce the supply of tokens in the contract
        supply -= numTokens;

        // ETH balance is automatically handled by Solidity
        // The transaction will revert if the msg.value isn't successfully transferred
    }

    // Function to withdraw ETH collected from sales
    function withdrawETH() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    
}