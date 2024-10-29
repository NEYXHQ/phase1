import { ethers } from "ethers";
import MyTokenABI from "./bin/contracts/MyToken.json"; // Replace with the actual ABI JSON file for MyToken
import TokenSaleABI from "./bin/contracts/SuyvanT-solc-output.json"; // Replace with the actual ABI JSON file for SUYT2TokenSale

// Deployed contract addresses
const myTokenAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d"; // Replace with deployed MyToken address
const tokenSaleAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"; // Replace with deployed TokenSale address
const mockUSDCAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b" // USDC

async function connectWallet() {
  if (window.ethereum) {
    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a provider connected to the user's wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Connected wallet address:", await signer.getAddress());
    return { provider, signer };
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}

async function interactWithContracts() {
  const { provider, signer } = await connectWallet();
  if (!provider || !signer) return;

  // Initialize contract instances
  const MyToken = new ethers.Contract(myTokenAddress, MyTokenABI, signer);
  const TokenSale = new ethers.Contract(tokenSaleAddress, TokenSaleABI, signer);

  // Example: Get deployer's balance
  const balance = await MyToken.balanceOf(await signer.getAddress());
  console.log(`Your SUYT1 token balance:`, ethers.formatUnits(balance, 18));

  // Example: Mint tokens (if the connected user is the owner)
  try {
    const mintAmount = ethers.parseUnits("100", 18);
    const mintTx = await MyToken.mint(await signer.getAddress(), mintAmount);
    await mintTx.wait();
    console.log(`Minted ${ethers.formatUnits(mintAmount, 18)} SUYT1 tokens to your address.`);
  } catch (error) {
    console.error("Minting failed:", error);
  }

  // Example: Purchase tokens from TokenSale with ETH
  const tokenPriceInETH = await TokenSale.tokenPriceETH();
  const purchaseAmount = 5;
  const cost = tokenPriceInETH.mul(purchaseAmount);
  try {
    const purchaseTx = await TokenSale.buyTokens(purchaseAmount, { value: cost });
    await purchaseTx.wait();
    console.log(`Purchased ${purchaseAmount} SUYT1 tokens with ETH.`);
  } catch (error) {
    console.error("Purchase failed:", error);
  }
}