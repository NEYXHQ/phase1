// SPDX-License-Identifier: MIT

// Suyt2TokenSale.sol
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// HardHat succesfull deployment for ALL
// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// MyToken (SUYT1) deployed to: 0x82e01223d51Eb87e16A03E24687EDF0F294da6f1
// MockUSDC deployed to: 0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3
// MockV3Aggregator deployed to: 0x7969c5eD335650692Bc04293B07F5BF2e7A673C0
// SUYT2TokenSale deployed to: 0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650

// Minted 10000 SUYT1 tokens to deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Minted 500 USDC to recipient: 0x054131B1EE0c96b5c9EbC6217F4f5E072c0E03C6

contract SUYT2TokenSale is Ownable, ReentrancyGuard { 
    
    IERC20 public SUYT1Token;   
    IERC20 public USDCcoin;     
    AggregatorV3Interface internal priceFeed; 
    
    uint256 public tokenPriceETH = 0.007 ether;     // Price of one full token in wei (ETH's smallest unit)
    uint256 public tokenPriceUSDC = 30 * 10**18;     // 30 USDC with 18 decimal places

    event DebugLog(string message, uint256 value);

    // Constructor to initialize the contract
    constructor(
        IERC20 _SUYT1Token,
        IERC20 _USDCcoin,
        address _owner,
        address _priceFeedAddress   // Chainlink price feed address for ETH/USDC
    ) Ownable(_owner) {
        SUYT1Token = _SUYT1Token;
        USDCcoin = _USDCcoin;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    // Function to set the price in full ETH for clarity (e.g., 0.01 for 0.01 ETH per token)
    // function setTokenPriceETH(uint256 _priceInEth) public onlyOwner {
    //     // Convert full ETH price to wei (smallest unit of ETH)
    //     tokenPriceETH = _priceInEth * 10**18;
    // }

    // Function to set the price in full USDC (e.g., 30 for 30 USDC per token)
    function setTokenPriceUSDC(uint256 _priceInUsdc) public onlyOwner {
        // Convert full USDC price to smallest USDC unit (6 decimals)
        tokenPriceUSDC = _priceInUsdc * 10**18;
    }

    // Function to calculate the equivalent ETH price for a given USDC amount
    function getEquivalentETHAmount(uint256 usdcAmount) public view returns (uint256) {

        // ALL Prices in 18 decimals
        uint256 ethPrice = getLatestETHPrice();
        uint256 USDCPriceInETH = (usdcAmount * 10**18)/ ethPrice;
        console.log("USDC amount     ", usdcAmount );
        console.log("   ethPrice     ", ethPrice);
        console.log(" USDCPriceInETH ", USDCPriceInETH);
        return (USDCPriceInETH);
    }

    // Function to get the latest ETH/USD price from the Chainlink oracle
    function getLatestETHPrice() public view returns (uint256) {
        (, int price, , ,) = priceFeed.latestRoundData();
        // The price is returned with 8 decimals, so convert it to 18 decimals
        return uint256(price) * 10**10;
    }

    // Function to allow users to buy tokens by sending ETH
    function buyTokens(uint256 numFullTokens) public payable nonReentrant {
        uint256 availableTokens = SUYT1Token.balanceOf(address(this));
        require(numFullTokens > 0, "Number of tokens must be greater than zero");

        // Calculate the required amount in USDC and convert it to ETH
        uint256 totalCostInUSDC = numFullTokens * tokenPriceUSDC;
        uint256 totalCostInETH = getEquivalentETHAmount(totalCostInUSDC);

        require(msg.value >= totalCostInETH, "Insufficient ETH sent for purchase");
        require(availableTokens >= numFullTokens * 10**18, "Not enough tokens available");

        // Transfer tokens to the buyer
        require(SUYT1Token.transfer(msg.sender, numFullTokens * 10**18), "Token transfer failed");

        // Refund any excess ETH sent
        if (msg.value > totalCostInETH) {
            payable(msg.sender).transfer(msg.value - totalCostInETH);
        }
    }

    // Function to deposit tokens into the sale contract (increase supply)
    function depositFullTokens(uint256 amount) public onlyOwner {
        // Convert full tokens to the smallest unit (assuming 18 decimals for SUYT1Token)
        uint256 amountInSmallestUnit = amount * 10**18;

        // Transfer tokens from the owner to this contract
        require(SUYT1Token.transferFrom(msg.sender, address(this), amountInSmallestUnit), "Token transfer failed");
    }

    // Function to allow users to buy tokens by sending ETH
    // function buyTokens(uint256 numFullTokens) public payable nonReentrant {
    //     uint256 availableTokens = SUYT1Token.balanceOf(address(this));

    //     require(numFullTokens > 0, "Number of tokens must be greater than zero");
    //     uint256 totalCostInWei = numFullTokens * tokenPriceETH;

    //     // Emit the event to log the total ETH in Wei
    //     emit DebugLog("Total totalCostInWei calculated:", totalCostInWei);
        
    //     require(msg.value == totalCostInWei, "Incorrect amount of ETH sent");
    //     require(availableTokens >= numFullTokens, "Not enough tokens available");

    //     // Transfer tokens to the buyer first (internal effect)
    //     require(SUYT1Token.transfer(msg.sender, numFullTokens * 10**18), "Token transfer failed");

    //     // ETH balance is automatically handled by Solidity
    //     // The transaction will revert if the msg.value isn't successfully transferred
    // }

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