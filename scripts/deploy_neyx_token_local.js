const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Hardhat deployment only
  const [deployer, 
    Address01, Address02, Address03, Address04, Address05, 
    Address06, Address07, Address08, Address09, Address10,
    Address11, Address12, Address13, Address14,] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Replace here with Real 0x
  // const initialOwner = deployer;
  const initialOwner = deployer; // The address that will own the contract
  

  const addr_1_Community = Address01;
  const addr_2_Liquidity = Address02;
  const addr_3_1_ReserveFund = Address03;
  const addr_3_2_ReserveFund = Address04;
  const addr_3_3_0_ReserveFund = Address05;
  const addr_3_3_1_ReserveFund = Address06;
  const addr_3_3_2_ReserveFund = Address07;
  const addr_3_4_ReserveFund = Address08;
  const addr_4_1_MarketingPartners = Address09;
  const addr_4_2_MarketingPartners = Address10;
  const addr_4_3_MarketingPartners = Address11;
  const addr_5_1_TeamAdvisors = Address12;
  const addr_5_2_TeamAdvisors = Address13;
  const addr_5_3_TeamAdvisors = Address14;

  const initialWallets = [
    addr_1_Community,
    addr_2_Liquidity,
    addr_3_1_ReserveFund,
    addr_3_2_ReserveFund,
    addr_3_3_0_ReserveFund,
    addr_3_3_1_ReserveFund,
    addr_3_3_2_ReserveFund,
    addr_3_4_ReserveFund,
    addr_4_1_MarketingPartners,
    addr_4_2_MarketingPartners,
    addr_4_3_MarketingPartners,
    addr_5_1_TeamAdvisors,
    addr_5_2_TeamAdvisors,
    addr_5_3_TeamAdvisors

  ]; // Wallet addresses to receive tokens
  const initialBalances = [
    ethers.parseUnits("300000000", 18), // 300 million tokens // addr_1_Community,
    ethers.parseUnits("300000000", 18), // 300 million tokens // addr_2_Liquidity,
    ethers.parseUnits("50000000", 18), //addr_3_1_ReserveFund
    ethers.parseUnits("10000000", 18), //addr_3_2_ReserveFund,
    ethers.parseUnits("8571428", 18), //addr_3_3_0_ReserveFund,
    ethers.parseUnits("7142858", 18), //addr_3_3_1_ReserveFund,
    ethers.parseUnits("14285714", 18), //addr_3_3_2_ReserveFund,
    ethers.parseUnits("10000000", 18), //addr_3_4_ReserveFund,
    ethers.parseUnits("10000000", 18), //addr_4_1_MarketingPartners,
    ethers.parseUnits("10000000", 18), //addr_4_2_MarketingPartners,
    ethers.parseUnits("30000000", 18), //addr_4_3_MarketingPartners,
    ethers.parseUnits("50000000", 18), //addr_5_1_TeamAdvisors,
    ethers.parseUnits("50000000", 18), //addr_5_2_TeamAdvisors,
    ethers.parseUnits("150000000", 18), //addr_6_0_OtherReserves
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

  // Fetch and display balances for all initial wallets
  console.log("\nListing all addresses with their respective balances:\n");
  for (let i = 0; i < initialWallets.length; i++) {
    const balance = await neyxToken.balanceOf(initialWallets[i].address);
    const formattedBalance = ethers.formatUnits(balance, 18).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for readability
    console.log(`Address: ${initialWallets[i].address} | Balance: ${formattedBalance} NEYXT`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
