// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Groth16Verifier} from "./Verifier.sol";

contract StealthWallet {
    error StealthWallet__AmountExceedsBalance();
    error StealthWallet__WithdrawFailed();
    error StealthWallet__InvalidProof();

    struct OwnershipProof {
        uint256[2] piA;
        uint256[2][2] piB;
        uint256[2] piC;
    }

    bytes32 public code;
    Groth16Verifier public verifier;

    constructor(bytes32 _code, address verifierAddr) payable {
        code = _code;
        verifier = Groth16Verifier(verifierAddr);
    }

    receive() external payable {}

    fallback() external payable {}

    function withdraw(address to, uint256 amount, OwnershipProof calldata proof) public returns (bool) {
        if (amount > address(this).balance) {
            revert StealthWallet__AmountExceedsBalance();
        }

        bool valid =
            verifier.verifyProof(proof.piA, proof.piB, proof.piC, [uint256(code), uint256(uint160(msg.sender))]);
        if (!valid) {
            revert StealthWallet__InvalidProof();
        }

        (bool success,) = to.call{value: amount}("");
        if (!success) {
            revert StealthWallet__WithdrawFailed();
        }
        return true;
    }
}
