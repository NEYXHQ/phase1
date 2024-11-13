// SPDX-License-Identifier: MIT

// Suyt2TokenSale.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SUYT2TokenSale is Ownable, ReentrancyGuard { // 0x19fB0271e0F0380645b15C409e43e92F8774b5F1
    
    IERC20 public SUYT1Token;   // SUYT1 - 0xff52a4D0Dd66125Cae78222B5F397531CCB76DE8
    IERC20 public USDCcoin;     // USDC - 0x6f183a566C879b06630DB90dC236f600A22130b2
    
    uint256 public tokenPriceETH = 0.007 ether;     // Price of one full token in wei (ETH's smallest unit)
    uint256 public tokenPriceUSDC = 30 * 10**6;     // 30 USDC with 6 decimal places

    event DebugLog(string message, uint256 value);

    // Constructor to initialize the contract
    constructor(
        IERC20 _SUYT1Token,
        IERC20 _USDCcoin,
        address _owner
    ) Ownable(_owner) {
        SUYT1Token = _SUYT1Token;
        USDCcoin = _USDCcoin;
    }

    // Function to set the price in full ETH for clarity (e.g., 0.01 for 0.01 ETH per token)
    function setTokenPriceETH(uint256 _priceInEth) public onlyOwner {
        // Convert full ETH price to wei (smallest unit of ETH)
        tokenPriceETH = _priceInEth * 10**18;
    }

    // Function to set the price in full USDC (e.g., 30 for 30 USDC per token)
    function setTokenPriceUSDC(uint256 _priceInUsdc) public onlyOwner {
        // Convert full USDC price to smallest USDC unit (6 decimals)
        tokenPriceUSDC = _priceInUsdc * 10**6;
    }

    // Function to deposit tokens into the sale contract (increase supply)
    function depositFullTokens(uint256 amount) public onlyOwner {
        // Convert full tokens to the smallest unit (assuming 18 decimals for SUYT1Token)
        uint256 amountInSmallestUnit = amount * 10**18;

        // Transfer tokens from the owner to this contract
        require(SUYT1Token.transferFrom(msg.sender, address(this), amountInSmallestUnit), "Token transfer failed");
    }

    // Function to allow users to buy tokens by sending ETH
    function buyTokens(uint256 numFullTokens) public payable nonReentrant {
        uint256 availableTokens = SUYT1Token.balanceOf(address(this));

        require(numFullTokens > 0, "Number of tokens must be greater than zero");
        uint256 totalCostInWei = numFullTokens * tokenPriceETH;

        // Emit the event to log the total ETH in Wei
        emit DebugLog("Total totalCostInWei calculated:", totalCostInWei);
        
        require(msg.value == totalCostInWei, "Incorrect amount of ETH sent");
        require(availableTokens >= numFullTokens, "Not enough tokens available");

        // Transfer tokens to the buyer first (internal effect)
        require(SUYT1Token.transfer(msg.sender, numFullTokens * 10**18), "Token transfer failed");

        // ETH balance is automatically handled by Solidity
        // The transaction will revert if the msg.value isn't successfully transferred
    }

    // Function to purchase SUYT1 tokens with USDCcoins
    function buyTokensWithUSDCcoin(uint256 numFullTokens) public nonReentrant {
        require(numFullTokens > 0, "Number of tokens must be greater than zero");

        // Calculate the required amount of USDC based on the number of tokens
        uint256 USDCcoinAmount = numFullTokens * tokenPriceUSDC;

        // Check if the contract has enough SUYT1 tokens to fulfill the purchase
        uint256 amountInSmallestUnit = numFullTokens * 10**18;  
        require(SUYT1Token.balanceOf(address(this)) >= amountInSmallestUnit, "Not enough tokens in the contract");

        // Transfer USDCcoin (USDC) from the buyer to the contract
        require(USDCcoin.transferFrom(msg.sender, address(this), USDCcoinAmount), "USDCcoin transfer failed");

        // Transfer SUYT1 tokens to the buyer
        require(SUYT1Token.transfer(msg.sender, amountInSmallestUnit), "Token transfer failed");
    }

    // Function to withdraw ETH collected from sales
    function withdrawETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Function for the owner to withdraw USDCcoins collected in the contract
    function withdrawUSDCcoins() public onlyOwner {
        uint256 USDCcoinBalance = USDCcoin.balanceOf(address(this));
        require(USDCcoinBalance > 0, "No USDCcoins to withdraw");
        USDCcoin.transfer(owner(), USDCcoinBalance);
    }

    
}