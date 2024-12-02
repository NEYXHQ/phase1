const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("**** NEYX_Token Deployed Contract Tests ****", function () {
    let token, owner, addr1;

    // // Replace with your deployed contract's address
    // const deployedAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    // // Load the ABI of your contract
    // const contractABI = require("../artifacts/contracts/NEYX_Token.sol/NEYX01.json").abi;

    before(async function () {
        try {
            [owner, addr1] = await ethers.getSigners();

            const Token = await ethers.getContractFactory("NEYX");
            token = await Token.deploy(owner.address,owner.address,owner.address);
            await token.waitForDeployment();

            let balance = await token.balanceOf(owner.address);
            console.log(" SETUP -- Owner:", owner.address, "(",ethers.formatEther(balance)," NEYXT)");
            
            balance = await token.balanceOf(addr1.address);
            console.log(" SETUP -- other:", addr1.address, "(",ethers.formatEther(balance)," NEYXT)");

            console.log(" SETUP -- Contract at:", await token.getAddress());
        } catch (error) {
            console.error("Deployment failed:", error);
        }
    });

    // Mint some NEYX tokens for testing purposes
    it("Should mint 10000 NEYX_T Token to owner", async function () {
        try {
            const mintAmount = ethers.parseUnits("10000", 18); // 1000 SUYT1 tokens
            await token.mint(owner.address, mintAmount);

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.equal(mintAmount);
        } catch (error) {
            console.error("Minting Failed:", error);
        }
    });


    it("Should retrieve the unpaused state", async function () {
        const isPaused = await token.paused();
        console.log("Is the contract paused initially?", isPaused);
        expect(isPaused).to.equal(false); // Assuming contract starts unpaused
    });

    it("Should allow the owner to pause the contract", async function () {
        const tx = await token.pause();
        await tx.wait();
        const isPaused = await token.paused();
        console.log("Did the owner paused the contract?", isPaused);
        expect(isPaused).to.equal(true);
    });

    it("Should revert transfers while paused", async function () {
            await expect(    
                token.transfer(addr1.address, ethers.parseEther("1"))
            ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("Should allow the owner to unpause the contract", async function () {
        const tx = await token.unpause();
        await tx.wait();
        const isPaused = await token.paused();
        console.log("Is the contract paused now?", isPaused);
        expect(isPaused).to.equal(false);
    });

    it("Should allow transfers when unpaused", async function () {
        try {
            const tx = await token.transfer(addr1.address, ethers.parseEther("1"));
            await tx.wait();

            const balance = await token.balanceOf(addr1.address);
            console.log("Balance of addr1 after transfer:", ethers.formatEther(balance));
            expect(balance).to.equal(ethers.parseEther("1"));
        } catch (error) {
            console.error("Failed in transfer when unpaused:", error);
        }
    });
});