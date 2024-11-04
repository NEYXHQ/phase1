const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // Specify deployed contract addresses
    const myTokenAddress = "0xff52a4D0Dd66125Cae78222B5F397531CCB76DE8";
    const tokenSaleAddress = "0x19fB0271e0F0380645b15C409e43e92F8774b5F1";
    const mockUSDCAddress = "0x6f183a566C879b06630DB90dC236f600A22130b2";

    // Get deployer and buyer accounts
    const [deployer, buyer] = await ethers.getSigners();
    console.log("Deployer account:", deployer.address);
    console.log("Buyer account:", buyer.address);

    // Get instances of deployed contracts
    const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
    const TokenSale = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);
    const MockUSDC = await ethers.getContractAt("MockUSDC", mockUSDCAddress);

    // Mint some USDC to the buyer for testing purposes
    // const usdcAmount = ethers.parseUnits("100", 6); // Mint 100 USDC with 6 decimals
    // const mintUsdcTx = await MockUSDC.connect(deployer).mint(buyer.address, usdcAmount);
    // await mintUsdcTx.wait();
    // console.log("Minted 100 USDC to the buyer's address.");

    // Print updated SUYT1 token balance of buyer
    console.log("Buyer's SUYT1 token balance:", ethers.formatUnits(await MyToken.balanceOf(buyer.address), 18), "SUYT1");

    // Check buyer's USDC balance
    const buyerUsdcBalance = await MockUSDC.balanceOf(buyer.address);
    console.log("Buyer's USDC balance BEFORE:", ethers.formatUnits(buyerUsdcBalance, 6), "USDC");

    // Approve the token sale contract to spend buyer's USDC
    const purchaseQuantity = 2; // Buyer wants to buy 2 SUYT1 tokens
    const tokenPriceInUSDC = await TokenSale.tokenPriceUSDC();
    const totalCostInUSDC = tokenPriceInUSDC * BigInt(purchaseQuantity); // Total cost for 10 tokens in USDC (BigInt for precision)

    console.log("Token Price in USDC (6 decimals):", tokenPriceInUSDC.toString());
    console.log("Total Cost in USDC (for 2 tokens):", ethers.formatUnits(totalCostInUSDC, 6), "USDC");

    // Approve the token sale contract to spend the buyer's USDC
    const approveTx = await MockUSDC.connect(buyer).approve(tokenSaleAddress, totalCostInUSDC);
    await approveTx.wait();
    console.log("Approved the token sale contract to spend buyer's USDC.");

    // Execute purchase transaction using USDC
    const purchaseTx = await TokenSale.connect(buyer).buyTokensWithUSDCcoin(purchaseQuantity);
    await purchaseTx.wait();
    console.log("Purchase transaction completed for buyer (2 tokens using USDC).");

    // Print updated SUYT1 token balance of buyer
    console.log("Buyer's SUYT1 token balance POST Sale:", ethers.formatUnits(await MyToken.balanceOf(buyer.address), 18), "SUYT1");

    // Print updated USDC balance of buyer
    const buyerUpdatedUsdcBalance = await MockUSDC.balanceOf(buyer.address);
    console.log("Buyer's updated USDC balance:", ethers.formatUnits(buyerUpdatedUsdcBalance, 6), "USDC");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });