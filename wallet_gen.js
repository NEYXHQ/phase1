const bip39 = require("bip39");
const { HDNodeWallet, Mnemonic } = require("ethers");

async function createWallets(numberOfWallets) {
  const wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    // Generate a new 12-word mnemonic
    const mnemonicPhrase = bip39.generateMnemonic();

    // Create a Mnemonic object from the phrase
    const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase);

    // Generate a wallet from the Mnemonic object using HDNodeWallet
    const wallet = HDNodeWallet.fromMnemonic(mnemonic);

    // Store wallet information
    wallets.push({
      index: i + 1,
      mnemonic: mnemonicPhrase,
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