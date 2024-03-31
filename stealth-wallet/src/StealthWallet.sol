// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Groth16Verifier} from "./Verifier.sol";

contract StealthWallet {
    error StealthWallet__AmountExceedsBalance();
    error StealthWallet__WithdrawFailed();
    error StealthWallet__InvalidSignature();
    error StealthWallet__InvalidProof();

    bytes32 public code;
    Groth16Verifier public verifier;

    constructor(bytes32 _code, address verifierAddr) payable {
        code = _code;
        verifier = Groth16Verifier(verifierAddr);
    }

    struct OwnershipProof {
        uint256[2] piA;
        uint256[2][2] piB;
        uint256[2] piC;
        uint256[1] pubSignals;
    }

    function withdraw(address to, uint256 amount, OwnershipProof calldata proof, bytes calldata proofSignature)
        public
        returns (bool)
    {
        if (amount > address(this).balance) {
            revert StealthWallet__AmountExceedsBalance();
        }

        bool isSignatureValid = validateSignature(proofSignature);
        if (!isSignatureValid) {
            revert StealthWallet__InvalidSignature();
        }

        bool valid = verifier.verifyProof(proof.piA, proof.piB, proof.piC, proof.pubSignals);
        if (!valid) {
            revert StealthWallet__InvalidProof();
        }

        (bool success,) = to.call{value: amount}("");
        if (!success) {
            revert StealthWallet__WithdrawFailed();
        }
        return true;
    }

    receive() external payable {}

    fallback() external payable {}

    function validateSignature(bytes calldata proofSignature) private returns (bool) {
        address signer = address(0);
        return signer == msg.sender;
    }
}
