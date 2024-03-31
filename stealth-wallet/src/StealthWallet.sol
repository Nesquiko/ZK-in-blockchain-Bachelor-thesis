// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Groth16Verifier} from "./Verifier.sol";

contract StealthWallet {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    error StealthWallet__AmountExceedsBalance();
    error StealthWallet__WithdrawFailed();
    error StealthWallet__UnauthorizedSigner();
    error StealthWallet__InvalidProof();

    struct OwnershipProof {
        uint256[2] piA;
        uint256[2][2] piB;
        uint256[2] piC;
        uint256[1] pubSignals;
    }

    bytes32 public code;
    Groth16Verifier public verifier;

    constructor(bytes32 _code, address verifierAddr) payable {
        code = _code;
        verifier = Groth16Verifier(verifierAddr);
    }

    receive() external payable {}

    fallback() external payable {}

    function withdraw(address to, uint256 amount, OwnershipProof calldata proof, bytes calldata proofSignature)
        public
        returns (bool)
    {
        if (amount > address(this).balance) {
            revert StealthWallet__AmountExceedsBalance();
        }

        address signer = keccak256(abi.encodePacked(proof.piA, proof.piB[0], proof.piB[1], proof.piC, proof.pubSignals))
            .toEthSignedMessageHash().recover(proofSignature);

        if (signer != msg.sender) {
            revert StealthWallet__UnauthorizedSigner();
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
}
