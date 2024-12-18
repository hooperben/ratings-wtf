// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "./VoteToken.sol";
import "./URINormalizer.sol";

import "../interfaces/IRatings.sol";
import "../interfaces/IVoteToken.sol";

contract Ratings is IRatings {
    IVoteToken public upToken;
    IVoteToken public downToken;

    constructor() {
        upToken = new VoteToken("UpToken", "UP");
        downToken = new VoteToken("DownToken", "DOWN");
    }

    function hashNormaliseUrl(
        string calldata url
    ) public pure returns (address) {
        if (bytes(url).length == 0) {
            return address(0);
        }

        string memory normalizedUrl = URINormalizer.normalizeURI(url);

        return address(uint160(uint256(keccak256(abi.encode(normalizedUrl)))));
    }

    // TODO: Implement
    function calculateTokensForAmount(
        uint256 amount
    ) public pure returns (uint256) {
        return amount;
    }

    function rate(
        string calldata upURL,
        string calldata downURL,
        uint256 amount
    ) external payable {
        // Both URLs cannot be empty, but one can be
        if (bytes(upURL).length == 0 && bytes(downURL).length == 0) {
            revert URLsCannotBeEmpty();
        }

        if (amount == 0) {
            revert AmountMustBeGreaterThanZero();
        }

        address upURLHash = hashNormaliseUrl(upURL);
        address downURLHash = hashNormaliseUrl(downURL);

        uint256 tokens = calculateTokensForAmount(amount);

        upToken.mint(upURLHash, tokens);
        downToken.mint(downURLHash, tokens);
    }
}
