require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };

/* hardhat.config.js */
// require("@nomiclabs/hardhat-waffle");
const GOERLI_RPC_URL = process.env.GOERI_RPC;
const Key = process.env.privateKey;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [Key],
      saveDeployments: true,
      chainId: 5,
    },
    //  unused configuration commented out for now
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [Key],
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
