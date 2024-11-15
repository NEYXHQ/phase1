import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    apiKey: "Z251WNSUICUD2GNNMINGK9XYDKWAK5ZNZ2", // sepolia key ?
  },
};

export default config;
