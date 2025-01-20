import { ethers } from "hardhat";

async function main() {
  const VestingWalletFactory = await ethers.getContractFactory("VestingWallet");
  console.log("Successfully loaded VestingWallet contract.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});