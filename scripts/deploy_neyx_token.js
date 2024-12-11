const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Hardhat deployment only
  const [deployer, Address01, Address02, Address03, Address04, Address05] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Replace here with Real 0x
  // const initialOwner = deployer;
  const initialOwner = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f"; // The address that will own the contract
  const addr_1_Community = "0xcDF03a01eCb7fEa6f1235eee30b01d2333d99E69"         // EthDev2
  const addr_2_Liquidity = "0x08dFDa43E716651b320869B7a95447C75F564175"         // EthDev3
  const addr_3_ReserveFund = "0xc661BCE4388257014AD805aA1f7eDe87FeEaa6C9"       // EthDev4
  const addr_4_MarketingPartners = "0xC70d985DCf4e9fF5f62cB70b9324dD4Cd082d6F8" // EthDev5
  const addr_5_TeamAdvisors = "0x54b4F72351ED5dcEE09c7c392bAeFd3862907b34"      // EthDev6

  const initialWallets = [
    // Address01,
    // Address02,
    // Address03,
    // Address04,
    // Address05
    addr_1_Community,
    addr_2_Liquidity,
    addr_3_ReserveFund,
    addr_4_MarketingPartners,
    addr_5_TeamAdvisors
  ]; // Wallet addresses to receive tokens
  const initialBalances = [
    ethers.parseUnits("300000000", 18), // 300 million tokens
    ethers.parseUnits("300000000", 18), // 300 million tokens
    ethers.parseUnits("100000000", 18),  // 100 million tokens
    ethers.parseUnits("50000000", 18),  // 50 million tokens
    ethers.parseUnits("250000000", 18)  // 250 million tokens
  ]; // Token balances corresponding to wallets

  // Check initial wallet and balance length
  if (initialWallets.length !== initialBalances.length) {
    throw new Error("Wallets and balances length mismatch");
  }

  // Get the contract factory
  const NEYX_Token = await ethers.getContractFactory("NEYX_Token");

  // Deploy the contract
  const neyxToken = await NEYX_Token.deploy(initialOwner, initialWallets, initialBalances);

  // Wait for deployment to complete
  await neyxToken.waitForDeployment();
  console.log("NEYXT Token deployed to:", await neyxToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contracts with the account:", deployer.address);

//   // Deploy the NEYX Token contract
//   const MyToken = await ethers.getContractFactory("NEYX01");
//   const myToken = await MyToken.deploy(deployer.address);
//   await myToken.waitForDeployment();
//   console.log("NEYXT Token deployed to:", await myToken.getAddress());

//   // Mint some NEYX tokens for testing purposes
//   const mintAmount = ethers.parseUnits("10000", 18); // 1000 SUYT1 tokens
//   await myToken.mint(deployer.address, mintAmount);
//   console.log("Minted 10000 NEYXT tokens to deployer:", deployer.address);

// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });