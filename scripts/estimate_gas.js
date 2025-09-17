const hre = require("hardhat");
const { ethers } = hre;

async function estimateGas() {
  console.log("🔍 Estimating gas costs for NEYX Token deployment...\n");

  // Get current gas price
  const provider = ethers.provider;
  const gasPrice = await provider.getFeeData();

  console.log("📊 Current Network Gas Data:");
  console.log(`Gas Price (legacy): ${ethers.formatUnits(gasPrice.gasPrice || 0, "gwei")} gwei`);
  console.log(`Max Fee Per Gas (EIP-1559): ${ethers.formatUnits(gasPrice.maxFeePerGas || 0, "gwei")} gwei`);
  console.log(`Max Priority Fee: ${ethers.formatUnits(gasPrice.maxPriorityFeePerGas || 0, "gwei")} gwei\n`);

  // Same addresses and balances from deploy script
  const initialOwner = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f";

  const initialWallets = [
    "0x1134Bb07cb7F35946E7e02f58cA7fcC64698B59b", // Community
    "0x99Bb88cbC2A1D0B12f3BA63Cd51aC919B7601179", // Liquidity
    "0x82c5e1812079FE89bD8240c924592a1DC13BAd18", // Reserve Fund 1
    "0x90730d044Ccd332f5a23844F7E219d2CF0AC467C", // Reserve Fund 2
    "0x89691BaF004bf4A7D9Ce265d47903D3595996Ad7", // Reserve Fund 3.0
    "0x7Abb72de1cea2C7319338417537f23977dE9c111", // Reserve Fund 3.1
    "0x33D05F773131Acc38A605506953cE8c1b4580AC0", // Reserve Fund 3.2
    "0x739D97D7862062B6d14d9998c9513f7922d22A45", // Reserve Fund 4
    "0x68eEB5992bDBf53Ead548E80E59cFCb26bEca892", // Marketing 1
    "0x9B273a89fe6EE30bD568856A169895C4E1e264d1", // Marketing 2
    "0x8F13AF490425D40cA3179E4fa5D6847FcCCd85d6", // Marketing 3
    "0x76E871415906652F268Ae45348564bB0194a65Ee", // Team 1
    "0xe8c5E2dd21aaEc34575C2b5FF23708E2616AECd7", // Team 2
    "0x4bf431e37539B8528f176B46CFd627699861df58"  // Team 3
  ];

  const initialBalances = [
    ethers.parseUnits("300000000", 18), // 300M Community
    ethers.parseUnits("300000000", 18), // 300M Liquidity
    ethers.parseUnits("50000000", 18),  // 50M Reserve 1
    ethers.parseUnits("10000000", 18),  // 10M Reserve 2
    ethers.parseUnits("8571428", 18),   // 8.5M Reserve 3.0
    ethers.parseUnits("7142858", 18),   // 7.1M Reserve 3.1
    ethers.parseUnits("14285714", 18),  // 14.3M Reserve 3.2
    ethers.parseUnits("10000000", 18),  // 10M Reserve 4
    ethers.parseUnits("10000000", 18),  // 10M Marketing 1
    ethers.parseUnits("10000000", 18),  // 10M Marketing 2
    ethers.parseUnits("30000000", 18),  // 30M Marketing 3
    ethers.parseUnits("50000000", 18),  // 50M Team 1
    ethers.parseUnits("50000000", 18),  // 50M Team 2
    ethers.parseUnits("150000000", 18)  // 150M Team 3
  ];

  // Get contract factory
  const NEYX_Token = await ethers.getContractFactory("NEYX_Token");

  try {
    // Estimate deployment gas
    const deployTx = await NEYX_Token.getDeployTransaction(initialOwner, initialWallets, initialBalances);
    const estimatedGas = await provider.estimateGas(deployTx);

    console.log("⛽ Gas Estimation Results:");
    console.log(`Estimated Gas Units: ${estimatedGas.toLocaleString()}`);

    // Calculate costs with different gas prices
    const lowGasPrice = ethers.parseUnits("20", "gwei");
    const medGasPrice = ethers.parseUnits("40", "gwei");
    const highGasPrice = ethers.parseUnits("80", "gwei");

    console.log("\n💰 Estimated Deployment Costs:");
    console.log(`At 20 gwei: ${ethers.formatEther(estimatedGas * lowGasPrice)} ETH`);
    console.log(`At 40 gwei: ${ethers.formatEther(estimatedGas * medGasPrice)} ETH`);
    console.log(`At 80 gwei: ${ethers.formatEther(estimatedGas * highGasPrice)} ETH`);

    // Current gas price cost
    if (gasPrice.gasPrice) {
      const currentCost = estimatedGas * gasPrice.gasPrice;
      console.log(`\n🎯 At Current Gas Price: ${ethers.formatEther(currentCost)} ETH`);
    }

    console.log("\n📋 Token Distribution Summary:");
    let totalAllocated = 0n;
    const categories = [
      "Community", "Liquidity", "Reserve 1", "Reserve 2", "Reserve 3.0",
      "Reserve 3.1", "Reserve 3.2", "Reserve 4", "Marketing 1", "Marketing 2",
      "Marketing 3", "Team 1", "Team 2", "Team 3"
    ];

    initialBalances.forEach((balance, index) => {
      totalAllocated += balance;
      console.log(`${categories[index]}: ${ethers.formatUnits(balance, 18).toLocaleString()} NEYX`);
    });

    console.log(`\nTotal Allocated: ${ethers.formatUnits(totalAllocated, 18).toLocaleString()} NEYX`);
    console.log(`Max Supply: 1,000,000,000 NEYX`);

  } catch (error) {
    console.error("❌ Error estimating gas:", error.message);
  }
}

// Run estimation
estimateGas()
  .then(() => {
    console.log("\n✅ Gas estimation completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Estimation failed:", error);
    process.exit(1);
  });