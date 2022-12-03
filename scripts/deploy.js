const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Oasis = await hre.ethers.getContractFactory("Oasis");
  const oasis = await Oasis.deploy();
  await oasis.deployed();
  console.log("oasis deployed to:", oasis.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const oasisAddress = "${oasis.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
