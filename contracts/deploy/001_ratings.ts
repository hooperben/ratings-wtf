/* eslint-disable camelcase -- ignore */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getUnnamedAccounts } = hre;
  const { deploy } = deployments;

  const [deployer] = await getUnnamedAccounts();

  console.log("Deploying Ratings with deployer:", deployer);

  // Deploy the Ratings contract
  const RatingsDeployment = await deploy("Ratings", {
    from: deployer,
    log: true, // Logs the deployment info
  });

  console.log("Ratings deployed to:", RatingsDeployment.address);
};

export default func;
func.tags = ["testbed", "_tokens"];
