// 🎯 DEPLOYMENT SUMMARY
// ========================================
// Contract Address: 0x5f200aB4e1aCa5cDABDA06dD8079f2EB63Dd01b4
// Total Verified: 1000000000.0 WFOUNDER
// Allocation Verification: ✅ ALL CORRECT
// Network: mainnet

// 🌐 Explorer Link: https://etherscan.io/address/0x5f200aB4e1aCa5cDABDA06dD8079f2EB63Dd01b4


const hre = require("hardhat");
const { ethers } = hre;
const bip39 = require("bip39");
const { HDNodeWallet, Mnemonic } = require("ethers");
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateWallet() {
  // Generate a new 12-word mnemonic
  const mnemonicPhrase = bip39.generateMnemonic();

  // Create a Mnemonic object from the phrase
  const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase);

  // Generate a wallet from the Mnemonic object using HDNodeWallet
  const wallet = HDNodeWallet.fromMnemonic(mnemonic);

  return {
    mnemonic: mnemonicPhrase,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

async function main() {
  console.log("🚀 WFOUNDER Token Complete Deployment Script");
  console.log("=========================================\n");

  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployment Info:");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${hre.network.name}\n`);

  // Define token allocation plan
  const allocationPlan = [
    { category: "Community", amount: "300000000" },
    { category: "Liquidity", amount: "300000000" },
    { category: "Reserve Fund 1", amount: "50000000" },
    { category: "Reserve Fund 2", amount: "10000000" },
    { category: "Reserve Fund 3.0", amount: "8571428" },
    { category: "Reserve Fund 3.1", amount: "7142858" },
    { category: "Reserve Fund 3.2", amount: "14285714" },
    { category: "Reserve Fund 4", amount: "10000000" },
    { category: "Marketing Partners 1", amount: "10000000" },
    { category: "Marketing Partners 2", amount: "10000000" },
    { category: "Marketing Partners 3", amount: "30000000" },
    { category: "Team Advisors 1", amount: "50000000" },
    { category: "Team Advisors 2", amount: "50000000" },
    { category: "Team Advisors 3", amount: "150000000" }
  ];

  console.log("🔐 Generating Fresh Wallet Addresses...\n");

  const walletData = [];
  const initialWallets = [];
  const initialBalances = [];

  // Generate wallets for each allocation
  for (let i = 0; i < allocationPlan.length; i++) {
    const wallet = await generateWallet();
    const allocation = allocationPlan[i];

    walletData.push({
      category: allocation.category,
      ...wallet,
      tokenAmount: allocation.amount
    });

    initialWallets.push(wallet.address);
    initialBalances.push(ethers.parseUnits(allocation.amount, 18));
  }

  // Display all generated wallets
  console.log("📝 Generated Wallet Details:");
  console.log("=" .repeat(80));

  walletData.forEach((wallet, index) => {
    console.log(`\n🏷️  ${wallet.category}`);
    console.log(`Address: ${wallet.address}`);
    console.log(`Seed: ${wallet.mnemonic}`);
    console.log(`Private Key: ${wallet.privateKey}`);
    console.log(`Allocation: ${wallet.tokenAmount.toLocaleString()} WFOUNDER`);
    console.log("-".repeat(80));
  });

  // Calculate total allocation
  const totalAllocated = initialBalances.reduce((sum, balance) => sum + balance, 0n);
  console.log(`\n📊 Total Allocation: ${ethers.formatUnits(totalAllocated, 18).toLocaleString()} WFOUNDER`);
  console.log(`Max Supply: 1,000,000,000 WFOUNDER`);
  console.log(`Allocation Match: ${totalAllocated === ethers.parseUnits("1000000000", 18) ? "✅ VALID" : "❌ INVALID"}\n`);

  // Contract owner setup
  const initialOwner = deployer.address; // Using deployer as initial owner
  console.log(`🔑 Contract Owner: ${initialOwner}\n`);

  // Pause for verification
  console.log("⚠️  VERIFICATION REQUIRED");
  console.log("Please review the above wallet addresses and allocations carefully.");
  console.log("Make sure to save the seed phrases and private keys securely!\n");

  const continueDeployment = await askQuestion("Do you want to proceed with deployment? (yes/no): ");

  if (continueDeployment.toLowerCase() !== 'yes') {
    console.log("❌ Deployment cancelled by user");
    rl.close();
    return;
  }

  console.log("\n⛽ Estimating gas costs...");

  // Get contract factory and estimate gas
  const WFOUNDER_Token = await ethers.getContractFactory("WFOUNDER_Token");
  const deployTx = await WFOUNDER_Token.getDeployTransaction(initialOwner, initialWallets, initialBalances);
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const gasPrice = await ethers.provider.getFeeData();

  const ethCost = ethers.formatEther(estimatedGas * (gasPrice.gasPrice || 0));
  const ethPrice = 4500; // Current ETH price in USD
  const usdCost = (parseFloat(ethCost) * ethPrice).toFixed(2);

  console.log("💰 DEPLOYMENT COST ANALYSIS");
  console.log("=" .repeat(40));
  console.log(`Gas Estimate: ${estimatedGas.toLocaleString()} units`);
  console.log(`Current Gas Price: ${ethers.formatUnits(gasPrice.gasPrice || 0, "gwei")} gwei`);
  console.log(`ETH Cost: ${ethCost} ETH`);
  console.log(`USD Cost: $${usdCost} (at $${ethPrice}/ETH)`);
  console.log("=" .repeat(40));

  // Additional cost scenarios
  console.log("\n📊 Cost at Different Gas Prices:");
  const scenarios = [
    { gwei: "20", label: "Normal" },
    { gwei: "40", label: "High" },
    { gwei: "80", label: "Very High" }
  ];

  scenarios.forEach(scenario => {
    const scenarioGasPrice = ethers.parseUnits(scenario.gwei, "gwei");
    const scenarioEthCost = ethers.formatEther(estimatedGas * scenarioGasPrice);
    const scenarioUsdCost = (parseFloat(scenarioEthCost) * ethPrice).toFixed(2);
    console.log(`${scenario.label} (${scenario.gwei} gwei): ${scenarioEthCost} ETH ($${scenarioUsdCost})`);
  });

  console.log("\n");
  const finalConfirm = await askQuestion("Proceed with actual deployment? (yes/no): ");

  if (finalConfirm.toLowerCase() !== 'yes') {
    console.log("❌ Deployment cancelled by user");
    rl.close();
    return;
  }

  console.log("\n🚀 Deploying WFOUNDER Token Contract...");

  // Deploy the contract
  const wfounderToken = await WFOUNDER_Token.deploy(initialOwner, initialWallets, initialBalances);

  console.log("⏳ Waiting for deployment confirmation...");
  await wfounderToken.waitForDeployment();

  const contractAddress = await wfounderToken.getAddress();
  console.log(`\n✅ WFOUNDER Token deployed to: ${contractAddress}`);

  // Post-deployment verification
  console.log("\n🔍 Verifying Token Allocations...");
  console.log("=" .repeat(60));

  let verificationPassed = true;
  let totalVerified = 0n;

  for (let i = 0; i < walletData.length; i++) {
    const wallet = walletData[i];
    const balance = await wfounderToken.balanceOf(wallet.address);
    const expectedBalance = ethers.parseUnits(wallet.tokenAmount, 18);
    const isCorrect = balance === expectedBalance;

    console.log(`${wallet.category}:`);
    console.log(`  Address: ${wallet.address}`);
    console.log(`  Expected: ${ethers.formatUnits(expectedBalance, 18).toLocaleString()} WFOUNDER`);
    console.log(`  Actual: ${ethers.formatUnits(balance, 18).toLocaleString()} WFOUNDER`);
    console.log(`  Status: ${isCorrect ? "✅ CORRECT" : "❌ INCORRECT"}\n`);

    if (!isCorrect) {
      verificationPassed = false;
    }

    totalVerified += balance;
  }

  // Verify contract details
  console.log("📋 Contract Verification:");
  console.log(`Name: ${await wfounderToken.name()}`);
  console.log(`Symbol: ${await wfounderToken.symbol()}`);
  console.log(`Decimals: ${await wfounderToken.decimals()}`);
  console.log(`Total Supply: ${ethers.formatUnits(await wfounderToken.totalSupply(), 18).toLocaleString()} WFOUNDER`);
  console.log(`Max Supply: ${ethers.formatUnits(await wfounderToken.MAX_SUPPLY(), 18).toLocaleString()} WFOUNDER`);
  console.log(`Owner: ${await wfounderToken.owner()}\n`);

  // Final verification summary
  console.log("🎯 DEPLOYMENT SUMMARY");
  console.log("=" .repeat(40));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Total Verified: ${ethers.formatUnits(totalVerified, 18).toLocaleString()} WFOUNDER`);
  console.log(`Allocation Verification: ${verificationPassed ? "✅ ALL CORRECT" : "❌ ERRORS FOUND"}`);
  console.log(`Network: ${hre.network.name}`);

  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log(`\n🌐 Explorer Link: https://${hre.network.name === "mainnet" ? "" : hre.network.name + "."}etherscan.io/address/${contractAddress}`);
  }

  console.log("\n⚠️  IMPORTANT: Save all wallet seed phrases and private keys securely!");
  console.log("These cannot be recovered if lost!\n");

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    rl.close();
    process.exit(1);
  });