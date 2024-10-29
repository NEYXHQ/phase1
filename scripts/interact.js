const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Specify deployed contract addresses
  const myTokenAddress = "0xYourMyTokenAddress";
  const tokenSaleAddress = "0xYourTokenSaleAddress";

  // Get signer (deployer) to interact with contracts
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", deployer.address);

  // Get instances of deployed contracts
  const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
  const TokenSale = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);

  // Example interaction with MyToken contract
  const deployerBalance = await MyToken.balanceOf(deployer.address);
  console.log(`Deployer's SUYT1 token balance:`, ethers.formatUnits(deployerBalance, 18));

  // Mint additional tokens (only if deployer is the owner)
  const mintAmount = ethers.parseUnits("100", 18);
  const mintTx = await MyToken.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log(`Minted ${ethers.formatUnits(mintAmount, 18)} SUYT1 tokens to deployer.`);

  // Example interaction with SUYT2TokenSale contract
  const tokenPriceInETH = await TokenSale.tokenPriceETH();
  console.log(`Token price in ETH:`, ethers.formatUnits(tokenPriceInETH, 18));

  // Purchase SUYT1 tokens with ETH
  const purchaseAmount = ethers.parseUnits("5", 18); // Buying 5 SUYT1 tokens
  const cost = tokenPriceInETH * 5;
  const purchaseTx = await TokenSale.buyTokens(5, { value: cost });
  await purchaseTx.wait();
  console.log(`Purchased 5 SUYT1 tokens with ETH.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });