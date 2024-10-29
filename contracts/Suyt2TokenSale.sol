// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract SUYT2TokenSale is Ownable, ReentrancyGuard {
    
    IERC20 public SUYT1Token;   // SUYT1 - 0xF940D4F9CfDE0313Fe7A49401dE23869Dd3D834C
    IERC20 public USDCcoin;     // USDC - 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
    
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

    // Function to set the price of each token (in wei) for a full
    function setTokenPriceETH(uint256 _price) public onlyOwner {
        tokenPriceETH = _price;
    }

    // Function to set the price of each token (in wei) for a full
    function setTokenPriceUSDC(uint256 _price) public onlyOwner {
        tokenPriceUSDC = _price * 10**6;
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