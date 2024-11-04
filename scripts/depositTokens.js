const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // Specify deployed contract addresses
    const myTokenAddress = "0xff52a4D0Dd66125Cae78222B5F397531CCB76DE8"; // Replace with your actual MyToken address
    const tokenSaleAddress = "0x19fB0271e0F0380645b15C409e43e92F8774b5F1"; // Replace with your actual SUYT2TokenSale address

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deployer account:", deployer.address);

    // Get instances of deployed contracts
    const MyToken = await ethers.getContractAt("MyToken", myTokenAddress);
    const TokenSale = await ethers.getContractAt("SUYT2TokenSale", tokenSaleAddress);

    // Define the amount of SUYT1 tokens to deposit (in full tokens)
    const depositAmount = 500; // 500 SUYT1 tokens to deposit
    const depositAmountInSmallestUnit = ethers.parseUnits(depositAmount.toString(), 18); // Convert to smallest unit (18 decimals)

    // Mint some SUYT1 tokens to the deployer for testing purposes, if needed
    const deployerBalance = await MyToken.balanceOf(deployer.address);
    if (deployerBalance < depositAmountInSmallestUnit) {
        const mintTx = await MyToken.connect(deployer).mint(deployer.address, depositAmountInSmallestUnit);
        await mintTx.wait();
        console.log(`Minted ${depositAmount} SUYT1 tokens to the deployer's address.`);
    }

    // Approve the token sale contract to spend the deployer's SUYT1 tokens
    const approveTx = await MyToken.connect(deployer).approve(tokenSaleAddress, depositAmountInSmallestUnit);
    await approveTx.wait();
    console.log(`Approved ${depositAmount} SUYT1 tokens for spending by the token sale contract.`);

    // Call depositFullTokens on the token sale contract to deposit the tokens
    const depositTx = await TokenSale.connect(deployer).depositFullTokens(depositAmount);
    await depositTx.wait();
    console.log(`Deposited ${depositAmount} SUYT1 tokens to the token sale contract.`);

    // Check and log the updated SUYT1 token balance of the token sale contract
    const contractSuyt1Balance = await MyToken.balanceOf(tokenSaleAddress);
    console.log("SUYT2TokenSale contract SUYT1 balance:", ethers.formatUnits(contractSuyt1Balance, 18), "SUYT1");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });