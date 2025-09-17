# NEYX Token Project

## 🎯 Project Overview

A complete ERC20 token deployment system for NEYX Token with automated wallet generation, secure deployment process, and post-deployment verification.

**Contract Address (Mainnet):** `0x6f183a566C879b06630DB90dC236f600A22130b2`
**Explorer:** https://etherscan.io/address/0x6f183a566C879b06630DB90dC236f600A22130b2

## 📋 Token Details

- **Name:** NEYX_Token
- **Symbol:** NEYXT
- **Decimals:** 18
- **Total Supply:** 1,000,000,000 NEYX
- **Standard:** ERC20 with Permit, Burnable, and Ownable features

## 🏗️ Contract Features

- **OpenZeppelin v5.0.0** - Latest security standards
- **ERC20Permit** - Gas-less approvals via signatures
- **ERC20Burnable** - Token burning capability
- **Ownable** - Owner-controlled functions
- **ReentrancyGuard** - Protection against reentrancy attacks
- **Pre-allocation** - Entire supply allocated at deployment

## 💰 Token Distribution

| Category | Allocation | Percentage |
|----------|------------|------------|
| Community | 300,000,000 NEYX | 30% |
| Liquidity | 300,000,000 NEYX | 30% |
| Reserve Funds | 140,000,000 NEYX | 14% |
| Marketing Partners | 50,000,000 NEYX | 5% |
| Team Advisors | 250,000,000 NEYX | 25% |
| **Total** | **1,000,000,000 NEYX** | **100%** |

### Detailed Allocation Breakdown

```
Community:             300,000,000 NEYX (30%)
Liquidity:             300,000,000 NEYX (30%)
Reserve Fund 1:         50,000,000 NEYX (5%)
Reserve Fund 2:         10,000,000 NEYX (1%)
Reserve Fund 3.0:        8,571,428 NEYX (0.86%)
Reserve Fund 3.1:        7,142,858 NEYX (0.71%)
Reserve Fund 3.2:       14,285,714 NEYX (1.43%)
Reserve Fund 4:         10,000,000 NEYX (1%)
Marketing Partners 1:   10,000,000 NEYX (1%)
Marketing Partners 2:   10,000,000 NEYX (1%)
Marketing Partners 3:   30,000,000 NEYX (3%)
Team Advisors 1:        50,000,000 NEYX (5%)
Team Advisors 2:        50,000,000 NEYX (5%)
Team Advisors 3:       150,000,000 NEYX (15%)
```

## 📁 Project Structure

```
phase1/
├── contracts/
│   └── NEYX_Token.sol          # Main ERC20 token contract
├── scripts/
│   ├── deploy_neyx_complete.js # Complete deployment script
│   ├── deploy_neyx_token.js    # Original deployment script
│   └── estimate_gas.js         # Gas estimation utility
├── wallet_gen.js               # Standalone wallet generator
├── hardhat.config.ts           # Hardhat configuration
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🚀 Deployment Process

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```bash
INFURA_API_KEY="your_infura_key"
DEPLOYER_PRIVATE_KEY="your_private_key"
ETHERSCAN_API_KEY_MAINNET="your_etherscan_key"
```

### Complete Deployment

The main deployment script (`deploy_neyx_complete.js`) provides:

- ✅ Automatic wallet generation (14 wallets with seed phrases)
- ✅ Security verification pause before deployment
- ✅ Real-time gas cost analysis in USD
- ✅ Post-deployment allocation verification
- ✅ Complete deployment summary

```bash
# Deploy to mainnet
npx hardhat run scripts/deploy_neyx_complete.js --network mainnet

# Test on Sepolia first (recommended)
npx hardhat run scripts/deploy_neyx_complete.js --network sepolia
```

### Gas Cost Analysis

Recent deployment costs (as of deployment):
- **Gas Used:** 1,527,086 units
- **Gas Price:** 0.907 gwei
- **ETH Cost:** 0.001386 ETH
- **USD Cost:** $6.23 (at $4,500/ETH)

## 🔐 Security Features

### Contract Security
- Uses OpenZeppelin's battle-tested contracts
- ReentrancyGuard protection
- Owner-only burn function
- Maximum supply enforcement

### Deployment Security
- Two-step confirmation process
- Complete allocation verification
- Automatic wallet generation (no copy-paste errors)
- Seed phrase and private key output for secure storage

## 🛡️ Future Security Considerations

### Multisig Migration

The project is designed to allow easy migration to multisig wallets:

1. **Individual to Multisig Transfer**
   - Each wallet holder can transfer tokens to multisig contracts
   - No contract modifications required

2. **Recommended Multisig Solutions**
   - Gnosis Safe (most popular)
   - OpenZeppelin Governor (DAO-style)
   - Custom multisig contracts

3. **Migration Categories**
   ```
   Community Multisig (300M tokens)
   Liquidity Multisig (300M tokens)
   Reserve Fund Multisig (140M tokens)
   Marketing Multisig (50M tokens)
   Team Multisig (250M tokens)
   ```

## 🔧 Utility Scripts

### Gas Estimation
```bash
npx hardhat run scripts/estimate_gas.js --network mainnet
```

### Wallet Generation (Standalone)
```bash
node wallet_gen.js
```

### Contract Verification
```bash
npx hardhat verify --network mainnet CONTRACT_ADDRESS "CONSTRUCTOR_ARGS"
```

## 📊 Deployment Results

**Successful Deployment Summary:**
- ✅ Contract deployed to mainnet
- ✅ All 14 wallets generated and funded
- ✅ Total allocation verification passed
- ✅ 1,000,000,000 NEYX tokens distributed correctly
- ✅ Contract ownership transferred

## 🔍 Contract Verification

The contract has been deployed and verified on Etherscan:
- **Network:** Ethereum Mainnet
- **Contract:** 0x6f183a566C879b06630DB90dC236f600A22130b2
- **Verification:** ✅ Verified and published

## ⚠️ Important Notes

1. **Seed Phrase Security**: All generated seed phrases and private keys must be stored securely
2. **Irreversible Deployment**: Token allocation is permanent at deployment
3. **Owner Functions**: Only the contract owner can use `controlledBurn` function
4. **Multisig Recommended**: Consider migrating to multisig wallets for enhanced security

## 📞 Support

For questions or issues regarding this deployment:
1. Review the contract on Etherscan
2. Check the deployment logs in the script output
3. Verify wallet balances using the contract interface

## 📄 License

MIT License - See contract header for details.