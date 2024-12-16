// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVoteToken is IERC20 {
    error TransferDisabled();

    error OnlyDeployerCanMint();

    function mint(address _to, uint256 _value) external;
}
