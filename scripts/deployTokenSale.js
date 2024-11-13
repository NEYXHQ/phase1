const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying SUYT2TokenSale contract with the account:", deployer.address);

  // Replace these with the actual addresses of your deployed MyToken and MockUSDC contracts
  const myTokenAddress = "0xff52a4D0Dd66125Cae78222B5F397531CCB76DE8";  
  const mockUSDCAddress = "0x6f183a566C879b06630DB90dC236f600A22130b2";  
  const chainLinkFeedETHUSDAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";  
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