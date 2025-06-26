const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const AggregatorRegistry = await ethers.getContractFactory("AggregatorRegistry");

  const registry = await AggregatorRegistry.deploy();
  await registry.deployed();

  console.log("AggregatorRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});