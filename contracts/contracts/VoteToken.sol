// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../interfaces/IVoteToken.sol";

contract VoteToken is ERC20, IVoteToken {
    address public immutable deployer;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        deployer = msg.sender;
    }

    function _update(
        address _from,
        address _to,
        uint256 _value
    ) internal override {
        if (_from != deployer) {
            revert TransferDisabled();
        }

        super._update(_from, _to, _value);
    }

    function mint(address _to, uint256 _value) external {
        // The _update override protects against unauthorized minting
        _mint(_to, _value);
    }
}
