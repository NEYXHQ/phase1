const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5f200aB4e1aCa5cDABDA06dD8079f2EB63Dd01b4"; 
  const initialOwner = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f";

  const initialWallets = [
    "0xA4CC0cfe030B25e5af8De448bc3fB3f13bAFb856",
    "0xA3c70c8E7bB2CDC930eBf11E46d10AaECCafb3F3",
    "0x4b3C5504E321933Eb8f3B8C836cca329f4C981c7",
    "0x5640aEA8beFC54B2f57a296D44480ca7604aD7DD",
    "0x7BcA9C2d3ca79b58EcA15ba3B039686418ad7346",
    "0x76B2e0c24F8306bB34a00455E2A244a7040A0a3a",
    "0x7f671Da6C3F916B49a952c14a4d97696Aff8F735",
    "0x771597F2eC6cC23052DA409d1B52524AfA20C144",
    "0x06710d8a6A358A22225d68B77e7A1F2CC2D366F4",
    "0x8cf51250D7206b7c43cA9dc7aB0677723e6A322D",
    "0xB97FC281aD83c2Fd62E9BC7E63CE7d945630bd0C",
    "0x7B7427b647A599cdFAFc4e106c421bCd0f2C6CE5",
    "0x914542A5eF252f89b5d0E849D379d2ed4266b826",
    "0xB921FEc9705bF30b5c762BD84224C442B0a3888F"
  ];

  const initialBalances = [
    "300000000000000000000000000",
    "300000000000000000000000000",
    "50000000000000000000000000",
    "10000000000000000000000000",
    "8571428000000000000000000",
    "7142858000000000000000000",
    "14285714000000000000000000",
    "10000000000000000000000000",
    "10000000000000000000000000",
    "10000000000000000000000000",
    "30000000000000000000000000",
    "50000000000000000000000000",
    "50000000000000000000000000",
    "150000000000000000000000000"
  ];

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [initialOwner, initialWallets, initialBalances]
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });