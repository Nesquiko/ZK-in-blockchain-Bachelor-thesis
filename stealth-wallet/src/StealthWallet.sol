// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Groth16Verifier} from "./Verifier.sol";

contract StealthWallet {
    error StealthWallet__AmountExceedsBalance();
    error StealthWallet__WithdrawFailed();

    bytes32 private code;
    Groth16Verifier private verifier;

    constructor(bytes32 _code, address verifierAddr) payable {
        code = _code;
        verifier = Groth16Verifier(verifierAddr);
    }

    // TODO add proof to this method
    function withdraw(address to, uint256 amount) public returns (bool) {
        if (amount > address(this).balance) {
            revert StealthWallet__AmountExceedsBalance();
        }
        (bool success,) = to.call{value: amount}("");
        if (!success) {
            revert StealthWallet__WithdrawFailed();
        }
        return true;
    }

    receive() external payable {}

    fallback() external payable {}
}
