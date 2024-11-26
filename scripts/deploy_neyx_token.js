const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the NEYX Token contract
  const MyToken = await ethers.getContractFactory("NEYX01");
  const myToken = await MyToken.deploy(deployer.address);
  await myToken.waitForDeployment();
  console.log("NEYXT Token deployed to:", await myToken.getAddress());

  // Mint some NEYX tokens for testing purposes
  const mintAmount = ethers.parseUnits("10000", 18); // 1000 SUYT1 tokens
  await myToken.mint(deployer.address, mintAmount);
  console.log("Minted 10000 NEYXT tokens to deployer:", deployer.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });