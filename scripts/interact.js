// HardHat succesfull deployment for ALL
// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// MyToken (SUYT1) deployed to: 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 (SUYT1)
// MockUSDC deployed to: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82 (USDC)
// MockV3Aggregator deployed to: 0x9A676e781A523b5d0C0e43731313A708CB607508 (LINK)
// SUYT2TokenSale deployed to: 0x0B306BF915C4d645ff596e518fAf3F9669b97016 (Sale)

// Minted 10000 SUYT1 tokens to deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Minted 500 USDC to recipient: 0x054131B1EE0c96b5c9EbC6217F4f5E072c0E03C6

const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // Specify deployed contract addresses
    const myTokenAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
    const tokenSaleAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
    const mockUSDCAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
    const mockAggregatorAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";

    // Get deployer and buyer accounts
    const [deployer, buyer] = await ethers.getSigners();
    console.log("Deployer account:", deployer.address);
    console.log("Buyer account:", buyer.address);

    // Get instances of deployed contracts
    const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
    const TokenSale = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);

    // Get the contract factory for MockV3Aggregator and attach it to the deployed address
    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    const mockAggregator = MockV3Aggregator.attach(mockAggregatorAddress);

    // Set the USD / ETH pair price
    await mockAggregator.updateAnswer(300000000000);
    
    // Fetch the latest price using latestRoundData
    const [, latestAnswer] = await mockAggregator.latestRoundData();

    // Convert the price from the int256 format with 8 decimals
    const price = parseFloat(ethers.formatUnits(latestAnswer, 8));
    console.log(`Current USD/ETH Price from Mock Aggregator: $${price}`);

    

    // // Print updated ETH balance of buyer
    // const buyerUpdatedEthBalance = await ethers.provider.getBalance(buyer.address);
    // console.log("Buyer's updated ETH balance:", ethers.formatUnits(buyerUpdatedEthBalance, 18), "ETH");

    // // Print updated SUYT1 token balance of buyer
    // const buyerTokenBalance = await MyToken.balanceOf(buyer.address);
    // console.log("Buyer's SUYT1 token balance:", ethers.formatUnits(buyerTokenBalance, 18), "SUYT1");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });