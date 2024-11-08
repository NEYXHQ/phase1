const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // Specify deployed contract addresses
    const myTokenAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
    const tokenSaleAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
    const mockUSDCAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";

    // Get deployer and buyer accounts
    const [deployer, buyer] = await ethers.getSigners();
    console.log("Deployer account:", deployer.address);
    console.log("Buyer account:", buyer.address);

    // Get instances of deployed contracts
    const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
    const TokenSale = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);

    // Deposit tokens into the sale contract (done by deployer)
    // const depositAmount = ethers.parseUnits("100", 18);
    // const depositTx = await MyToken.transfer(tokenSaleAddress, depositAmount);
    // await depositTx.wait();
    // console.log("Deposited 100 SUYT1 tokens into the token sale contract.");

    // Retrieve and print the current ETH balance of the buyer
    const buyerInitialEthBalance = await ethers.provider.getBalance(buyer.address);
    console.log("Buyer's initial ETH balance:", ethers.formatUnits(buyerInitialEthBalance, 18), "ETH");

    // Retrieve token price from the sale contract
    const tokenPriceInETH = await TokenSale.tokenPriceETH();
    console.log("Token price in ETH (in wei):", tokenPriceInETH.toString());

    // Set purchase quantity for the buyer and calculate the total cost
    const tokensForSale = await MyToken.balanceOf(tokenSaleAddress);
    const buyerPurchaseQuantity = ethers.parseUnits("10", 18); // Buying 10 full tokens
    const buyerTotalCost = tokenPriceInETH * BigInt(10); // Total cost for 10 tokens in wei
    console.log("SUYT1 tokens held in the sale contract:", ethers.formatUnits(tokensForSale, 18));
    console.log("Buyer Purchase Quantity (in smallest units):", buyerPurchaseQuantity.toString());
    console.log("Buyer Total Cost (in wei):", buyerTotalCost.toString());

    // Execute purchase transaction from buyer account
    const purchaseTx = await TokenSale.connect(buyer).buyTokens(10, { value: buyerTotalCost });
    await purchaseTx.wait();
    console.log("Purchase transaction completed for buyer (10 tokens).");

    // Print updated ETH balance of buyer
    const buyerUpdatedEthBalance = await ethers.provider.getBalance(buyer.address);
    console.log("Buyer's updated ETH balance:", ethers.formatUnits(buyerUpdatedEthBalance, 18), "ETH");

    // Print updated SUYT1 token balance of buyer
    const buyerTokenBalance = await MyToken.balanceOf(buyer.address);
    console.log("Buyer's SUYT1 token balance:", ethers.formatUnits(buyerTokenBalance, 18), "SUYT1");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });