/* eslint-disable camelcase -- ignore */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // Fetch the contract factory for the ERC20 implementation
  const RatingsContract = await ethers.getContractFactory("Ratings");

  // Deploy the contract
  const ratings = await RatingsContract.deploy();

  // Wait for the deployment to be mined
  const contract = await ratings.waitForDeployment();

  const deploymentTransaction = contract.deploymentTransaction();
  if (!deploymentTransaction) {
    throw new Error("Deployment transaction not found");
  }

  const receipt = await deploymentTransaction.wait();

  if (!receipt) {
    throw new Error("Deployment address not found");
  }

  console.log("Ratings deployed to:", receipt.contractAddress);
};

export default func;
func.tags = ["testbed", "_tokens"];
