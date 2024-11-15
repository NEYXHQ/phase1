const hre = require("hardhat");
const { ethers } = hre;

// MyToken (SUYT1) deployed to: 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 (SUYT1)
// MockUSDC deployed to: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82 (USDC)
// MockV3Aggregator deployed to: 0x9A676e781A523b5d0C0e43731313A708CB607508 (LINK)
// SUYT2TokenSale deployed to: 0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf (Sale)

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying SUYT2TokenSale contract with the account:", deployer.address);

  // Replace these with the actual addresses of your deployed MyToken and MockUSDC contracts
  const myTokenAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";  
  const mockUSDCAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";  
  const chainLinkFeedETHUSDAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";  
  console.log("SUYT1     addr used:", myTokenAddress);
  console.log("USDC      addr used:", mockUSDCAddress);
  console.log("ChainLink addr used:", chainLinkFeedETHUSDAddress);

  // Deploy the SUYT2TokenSale contract with hardcoded addresses
  const SUYT2TokenSale = await ethers.getContractFactory("SUYT2TokenSale");
  const tokenSale = await SUYT2TokenSale.deploy(myTokenAddress, mockUSDCAddress,chainLinkFeedETHUSDAddress, deployer.address);
  await tokenSale.waitForDeployment();
  console.log("SUYT2TokenSale deployed to:", await tokenSale.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });