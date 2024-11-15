// HardHat succesfull deployment for ALL
// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// MockV3Aggregator deployed to: 0x7969c5eD335650692Bc04293B07F5BF2e7A673C0
// SUYT2TokenSale deployed to: 0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650

const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Specify deployed contract addresses
  const tokenSaleAddress = "0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429";
  const mockAggregatorAddress = "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0";

  // const myTokenAddress = "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";
  // const mockUSDCAddress = "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3";

  // Get deployer and buyer accounts
  const [deployer, buyer] = await ethers.getSigners();
  console.log("Deployer account:", deployer.address);
  console.log("Buyer account:", buyer.address);

  // Get the contract factory for MockV3Aggregator and attach it to the deployed address
  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  const mockAggregator = await MockV3Aggregator.attach(mockAggregatorAddress);
  console.log("Attached MockV3Aggregator Address:", mockAggregator.target);

  // Set the USD / ETH pair price
  await mockAggregator.updateAnswer(300000000000);

  // Fetch the latest price using latestRoundData
  const result = await mockAggregator.latestRoundData();
  const [, latestAnswer] = result;

  // Convert the price from the int256 format with 8 decimals from Chainlink
  const price = parseFloat(ethers.formatUnits(latestAnswer, 8));
  console.log(`\nUSD/ETH from Mock Aggregator: $${price}`);

  // init new TokenSale Contract
  // const SUYT2TokenSale = await ethers.getContractFactory("SUYT2TokenSale");
  // const tokenSaleContract = await SUYT2TokenSale.deploy(
  //   myTokenAddress,
  //   mockUSDCAddress,
  //   deployer.address,
  //   mockAggregatorAddress
  // );
  // console.log("\nSUYT2TokenSale deployed to:", await tokenSaleContract.getAddress());

  // re-use existing TokenSale Contract
  const SUYT2TokenSale = await ethers.getContractFactory("SUYT2TokenSale");
  const tokenSaleContract = SUYT2TokenSale.attach(tokenSaleAddress);

  // Fetch the latest ETH/USD price from the SUYT2TokenSale contract
  const latestPrice = await tokenSaleContract.getLatestETHPrice();

  // // Define the number of tokens to buy (1 token)
  const numFullTokens = 1;

  // // Calculate the total cost in ETH for 1 token based on the USD price
  const tokenPriceInUSD = await tokenSaleContract.tokenPriceUSDC();

  const totalCostInETH = await tokenSaleContract.getEquivalentETHAmount(tokenPriceInUSD);
  console.log(`SUYT1 tokenPriceInUSD: $${ethers.formatUnits(tokenPriceInUSD,18)}`);
  console.log(`\nSUYT token price in ETH: $${ethers.formatUnits(totalCostInETH,18)}`);

  // // Convert totalCostInETH to a format for sending in the transaction
  // const totalCostInETHFormatted = ethers.formatUnits(totalCostInETH, 18);

  // console.log(`Total cost in ETH for 1 token at $${tokenPriceInUSD} USD: ${totalCostInETHFormatted} ETH`);

  // // Execute the token purchase transaction
  // const transaction = await tokenSaleContract.buyTokens(numFullTokens, {
  //   value: totalCostInETH,
  // });

  // // Wait for the transaction to be mined
  // const receipt = await transaction.wait();
  // console.log("Token purchase transaction receipt:", receipt);



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