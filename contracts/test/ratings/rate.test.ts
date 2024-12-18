import { deployments, ethers } from "hardhat";
import { expect } from "chai";
import { Ratings } from "../../typechain-types";
import { normalizeURI } from "../../utils/url";

const hashAndNormalizeUrl = (url: string) =>
  ethers.keccak256(ethers.toUtf8Bytes(normalizeURI(url))).slice(0, 42);

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

  it("Should return the same hash-derived address for the same normalized URL", async function () {
    const url = "HTTP://Example.com/SomePath";

    const expectedAddress = hashAndNormalizeUrl(url);

    const contractResult = await ratings.hashNormaliseUrl(url);

    expect(contractResult).to.equal(expectedAddress);
  });
});
