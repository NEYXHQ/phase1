import * as bip39 from "bip39";
import { ethers } from "ethers";

async function createWallets(numberOfWallets: number) {
  const wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    // Generate a new 12-word mnemonic
    const mnemonic = bip39.generateMnemonic();
    
    // Generate a wallet from the mnemonic
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    // Store wallet information
    wallets.push({
      index: i + 1,
      mnemonic: mnemonic,
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  return wallets;
}

(async () => {
  const numberOfWallets = 14; // Number of wallets to generate
  const wallets = await createWallets(numberOfWallets);

  // Display all wallets
  wallets.forEach(wallet => {
    console.log(`Wallet ${wallet.index}`);
    console.log(`Mnemonic: ${wallet.mnemonic}`);
    console.log(`Address: ${wallet.address}`);
    console.log(`Private Key: ${wallet.privateKey}`);
    console.log("----------------------------");
  });
})();