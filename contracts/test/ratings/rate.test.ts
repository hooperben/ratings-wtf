import { deployments, ethers } from "hardhat";
import { expect } from "chai";
import { Ratings } from "../../typechain-types";

describe("Ratings Contract", function () {
  let ratings: Ratings;

  beforeEach(async function () {
    // Load and run deployment scripts before each test
    await deployments.fixture(["testbed"]);

    ratings = await ethers.getContract("Ratings");
  });

  it("Should normalize a URL and return a valid hash-derived address", async function () {
    const url = "HTTP://Example.com/SomePath";

    const hashAddress = await ratings.hashNormaliseUrl(url);
    console.log("Normalized URL hash-derived address:", hashAddress);

    expect(hashAddress).to.be.properAddress;
  });
});
