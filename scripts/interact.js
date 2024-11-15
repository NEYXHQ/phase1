// HardHat succesfull deployment for ALL
// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// MyToken (SUYT1) deployed to: 0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00
// MockUSDC deployed to: 0x36C02dA8a0983159322a80FFE9F24b1acfF8B570
// MockV3Aggregator deployed to: 0x809d550fca64d94Bd9F66E60752A544199cfAC3D
// SUYT2TokenSale deployed to: 0x4c5859f0F772848b2D91F1D83E2Fe57935348029

// Minted 10000 SUYT1 tokens to deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Minted 500 USDC to recipient: 0x054131B1EE0c96b5c9EbC6217F4f5E072c0E03C6

const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Specify deployed contract addresses
  const tokenSaleAddress = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029";
  const mockAggregatorAddress = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";

  // Get deployer and buyer accounts
  const [deployer, buyer] = await ethers.getSigners();
  console.log("Deployer account:", deployer.address);
  console.log("Buyer account:", buyer.address);

  // Get instances of deployed contracts
  // const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
  // const tokenSaleContract = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);

  // Get the contract factory for MockV3Aggregator and attach it to the deployed address
  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  const mockAggregator = MockV3Aggregator.attach(mockAggregatorAddress);

  // Set the USD / ETH pair price
  await mockAggregator.updateAnswer(300000000000);
  console.log(`Agregator Address: ${mockAggregator.address}`)

  // Fetch the latest price using latestRoundData
  const [, latestAnswer] = await mockAggregator.latestRoundData();

  // Convert the price from the int256 format with 8 decimals
  const price = parseFloat(ethers.formatUnits(latestAnswer, 8));
  console.log(`Current USD/ETH Price from Mock Aggregator: $${price}`);

  const SUYT2TokenSale = await ethers.getContractFactory("SUYT2TokenSale");
  console.log(`1`);
  const tokenSaleContract = SUYT2TokenSale.attach(tokenSaleAddress);
  console.log(`2`);
  // Fetch the latest ETH/USD price from the SUYT2TokenSale contract
  const latestPrice = await tokenSaleContract.getLatestETHPrice();
  console.log(`3`);
  console.log(`Current USD/ETH Price from Mock Aggregator within contract call: $${latestPrice}`);

  // Format the price for display (18 decimals)
  const ethPriceInUSD = parseFloat(ethers.formatUnits(latestPrice, 18));
  console.log(`Latest ETH/USD price from Chainlink: $${ethPriceInUSD}`);

  // // Define the number of tokens to buy (1 token)
  const numFullTokens = 1;

  // // Calculate the total cost in ETH for 1 token based on the USD price
  const tokenPriceInUSD = await tokenSaleContract.tokenPriceUSDC();
  console.log(`SUYT token price in USDC: $${ethers.formatUnits(tokenPriceInUSD, 6)} - ${tokenPriceInUSD}`);
  const totalCostInETH = await tokenSaleContract.getEquivalentETHAmount(tokenPriceInUSD);
  console.log(`SUYT token price in ETH based on agregator: $${ethers.formatUnits(totalCostInETH,18) }`);
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