const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying VestingWallet with the account:", deployer.address);

  // Parameters for VestingWallet
  const beneficiary = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"; // Account#15 - Simulation investor M
  const start = Math.floor(new Date("2025-03-01T00:00:00Z").getTime() / 1000); // March 1, 2025
  const cliffDuration = 60 * 60 * 24 * 365 * 2; // 2 years (in seconds)
  const duration = 60 * 60 * 24 * 365 * 2; // 2 years total release duration (in seconds)

  // Deploy the VestingWallet
  const VestingWallet = await ethers.getContractFactory("VestingWallet");
  const vestingWallet = await VestingWallet.deploy(beneficiary, start, duration);

  await vestingWallet.waitForDeployment();
  const vestingWalletAddress = await vestingWallet.getAddress();

  console.log("VestingWallet deployed to:", vestingWalletAddress);
  console.log("Start Date:", new Date(start * 1000).toISOString().split("T")[0]); // Convert UNIX timestamp to YYYY-MM-DD
  console.log("Cliff Duration (months):", cliffDuration / (60 * 60 * 24 * 30)); // Convert seconds to months
  console.log("Total Vesting Duration (months):", duration / (60 * 60 * 24 * 30)); // Convert seconds to months
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });