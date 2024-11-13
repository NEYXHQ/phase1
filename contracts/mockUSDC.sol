// SPDX-License-Identifier: MIT

// mockUSDC.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor(uint256 initialSupply) ERC20("USD Coin", "USDC") {
        // Mint initial supply to the deployer with 6 decimals
        _mint(msg.sender, initialSupply);
    }

    // Override decimals to return 6 for USDC compatibility
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    // Mint function for testing purposes
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}