const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the MyToken (SUYT1) contract
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(deployer.address);
  await myToken.waitForDeployment();
  console.log("MyToken (SUYT1) deployed to:", await myToken.getAddress());

  // Deploy the MockUSDC contract with an initial supply
  const initialSupply = ethers.parseUnits("1000000", 6); // 1 million USDC with 6 decimals
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy(initialSupply);
  await mockUSDC.waitForDeployment();
  console.log("MockUSDC deployed to:", await mockUSDC.getAddress());

  // Deploy MockV3Aggregator with an initial price (e.g., 30 * 10^8 for $3000)
  /// Set the initial price with 8 decimals, e.g., 3000 * 10^6 for 3000
  const initialAnswer = 3000000; // Represents $3000 with 8 decimals
  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  
  const mockAggregator = await MockV3Aggregator.deploy(initialAnswer);
  await mockAggregator.waitForDeployment();

  const address = await mockAggregator.getAddress();
  console.log("MockV3Aggregator deployed to:", address);

  // Deploy the SUYT2TokenSale contract
  const SUYT2TokenSale = await ethers.getContractFactory("SUYT2TokenSale");
  const tokenSale = await SUYT2TokenSale.deploy(await myToken.getAddress(), await mockUSDC.getAddress(),await mockAggregator.getAddress(), deployer.address);
  await tokenSale.waitForDeployment();
  console.log("SUYT2TokenSale deployed to:", await tokenSale.getAddress());

  // Mint some SUYT1 tokens for testing purposes
  const mintAmount = ethers.parseUnits("10000", 18); // 1000 SUYT1 tokens
  await myToken.mint(deployer.address, mintAmount);
  console.log("Minted 10000 SUYT1 tokens to deployer:", deployer.address);

  // Optional: Mint some USDC to another test account for testing
  const recipient = "0x054131B1EE0c96b5c9EbC6217F4f5E072c0E03C6"; // Replace with a test address
  await mockUSDC.mint(recipient, ethers.parseUnits("500", 6));
  console.log("Minted 500 USDC to recipient:", recipient);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });