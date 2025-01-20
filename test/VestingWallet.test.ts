import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { VestingWallet, NEYX_Token } from "../typechain-types"; // Adjust the path to your generated Typechain types
import { parseUnits, formatUnits } from "ethers";

describe("NEYX_Token Vesting with VestingWallet", function () {
  let fundingAccount: Signer;
  let beneficiaryAccount: Signer;
  let vestingWalletInstance: VestingWallet;
  let tokenContract: NEYX_Token;

  let vestingStartTimestamp: number;
  let vestingCliffDurationSeconds: number;
  let vestingDurationSeconds: number;

  beforeEach(async function () {
    // Get predefined accounts from Hardhat's local node
    const signers = await ethers.getSigners();
    const deployerAccount = signers[0]; // Account used to deploy NEYX_Token (for reference only)
    fundingAccount = signers[3]; // Account #04 - funding the VestingWallet
    beneficiaryAccount = signers[14]; // Account #15 - beneficiary of the VestingWallet

    console.log("Deployer Account (for reference):", await deployerAccount.getAddress());
    console.log("Funding Account (Account #04):", await fundingAccount.getAddress());
    console.log("Beneficiary Account (Account #15):", await beneficiaryAccount.getAddress());

    // Use the already deployed NEYX_Token contract
    const tokenAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    tokenContract = (await ethers.getContractAt("NEYX_Token", tokenAddress)) as NEYX_Token;

    console.log(`NEYX_Token contract loaded at address: ${tokenContract.target}`);
    console.log("List of accounts and their NEYXT balances:");

    for (let i = 0; i < 16; i++) {
      const address = await signers[i].getAddress();
      const balance = await tokenContract.balanceOf(address);
      console.log(`Account #${i}: ${address} | Balance: ${formatUnits(balance, 18)} NEYXT`);
    }

    // Vesting Schedule Parameters
    vestingStartTimestamp = Math.floor(new Date("2025-03-01T00:00:00Z").getTime() / 1000); // Start: March 1, 2025
    vestingCliffDurationSeconds = 60 * 60 * 24 * 365 * 2; // 2 years in seconds (cliff period)
    vestingDurationSeconds = 60 * 60 * 24 * 365 * 2; // 2 years linear release duration

    // Deploy the VestingWallet contract
    const VestingWalletFactory = await ethers.getContractFactory("VestingWallet");
    vestingWalletInstance = (await VestingWalletFactory.deploy(
      await beneficiaryAccount.getAddress(), // Beneficiary
      vestingStartTimestamp, // Start time
      vestingDurationSeconds // Vesting duration
    )) as VestingWallet;
    await vestingWalletInstance.deployed();

    console.log("VestingWallet deployed to:", vestingWalletInstance.target); // Use .target in Ethers.js v6
    console.log("Start Date:", new Date(vestingStartTimestamp * 1000).toISOString().split("T")[0]);
    console.log("Cliff Duration (months):", vestingCliffDurationSeconds / (60 * 60 * 24 * 30));
    console.log("Total Vesting Duration (months):", vestingDurationSeconds / (60 * 60 * 24 * 30));

    // Fund the VestingWallet with all tokens from fundingAccount (Account #04)
    const fundingAccountAddress = await fundingAccount.getAddress();
    const fundingAccountBalance = await tokenContract.balanceOf(fundingAccountAddress);
    console.log("Funding Account Balance:", formatUnits(fundingAccountBalance, 18), "NEYXT");

    await tokenContract.connect(fundingAccount).transfer(vestingWalletInstance.target, fundingAccountBalance);

    console.log(
      `Funded VestingWallet with ${formatUnits(
        fundingAccountBalance,
        18
      )} NEYXT tokens from Funding Account (Account #04)`
    );
  });

  it("Should initialize the vesting wallet correctly", async function () {
    expect(await vestingWalletInstance.beneficiary()).to.equal(await beneficiaryAccount.getAddress());
    expect(await vestingWalletInstance.start()).to.equal(vestingStartTimestamp);
    expect(await vestingWalletInstance.duration()).to.equal(vestingDurationSeconds);

    const vestingWalletBalance = await tokenContract.balanceOf(vestingWalletInstance.target);
    expect(vestingWalletBalance).to.equal(parseUnits("10000000", 18)); // 10,000,000 NEYXT
  });

  it("Should prevent token release before the cliff", async function () {
    const beforeCliffTimestamp = vestingStartTimestamp + vestingCliffDurationSeconds - 1; // Just before the cliff ends
    await ethers.provider.send("evm_setNextBlockTimestamp", [beforeCliffTimestamp]);
    await ethers.provider.send("evm_mine");

    await expect(
      vestingWalletInstance.connect(beneficiaryAccount).release(tokenContract.target)
    ).to.be.revertedWith("No tokens are due");
  });

  it("Should allow token release after the cliff and vest tokens over time", async function () {
    const totalTokens = parseUnits("10000000", 18); // Total tokens vested

    // Simulate the timestamp just after the cliff ends (March 1, 2027)
    const afterCliffTimestamp = vestingStartTimestamp + vestingCliffDurationSeconds;
    await ethers.provider.send("evm_setNextBlockTimestamp", [afterCliffTimestamp]);
    await ethers.provider.send("evm_mine");

    // No tokens immediately after the cliff because vesting starts at the cliff
    const vestedTokensAfterCliff = await vestingWalletInstance.vestedAmount(tokenContract.target, afterCliffTimestamp);
    expect(vestedTokensAfterCliff).to.equal(0);

    // Simulate halfway through the vesting schedule (March 1, 2028)
    const halfwayTimestamp = afterCliffTimestamp + Math.floor(vestingDurationSeconds / 2);
    await ethers.provider.send("evm_setNextBlockTimestamp", [halfwayTimestamp]);
    await ethers.provider.send("evm_mine");

    const vestedTokensHalfway = await vestingWalletInstance.vestedAmount(
      tokenContract.target,
      halfwayTimestamp
    );
    expect(vestedTokensHalfway).to.be.closeTo(totalTokens.div(2), parseUnits("1", 18)); // Half the tokens vested

    // Release tokens halfway through
    await vestingWalletInstance.connect(beneficiaryAccount).release(tokenContract.target);
    const beneficiaryBalance = await tokenContract.balanceOf(await beneficiaryAccount.getAddress());
    expect(beneficiaryBalance).to.be.closeTo(totalTokens.div(2), parseUnits("1", 18));

    // Simulate the end of the vesting period (March 1, 2029)
    const endTimestamp = vestingStartTimestamp + vestingCliffDurationSeconds + vestingDurationSeconds;
    await ethers.provider.send("evm_setNextBlockTimestamp", [endTimestamp]);
    await ethers.provider.send("evm_mine");

    const vestedTokensEnd = await vestingWalletInstance.vestedAmount(tokenContract.target, endTimestamp);
    expect(vestedTokensEnd).to.equal(totalTokens); // All tokens vested

    // Release the remaining tokens
    await vestingWalletInstance.connect(beneficiaryAccount).release(tokenContract.target);
    const remainingBalance = await tokenContract.balanceOf(vestingWalletInstance.target);
    expect(remainingBalance).to.equal(0); // All tokens released
  });
});