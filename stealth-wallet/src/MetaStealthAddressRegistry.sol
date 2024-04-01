// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MetaStealthAddressRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    error MetaStealthAddressRegistry__UnauthorizedSender();
    error MetaStealthAddressRegistry__UnauthorizedSigner();

    struct MetaStealthAddress {
        bytes pubKey;
        bytes32 secretHash;
    }

    mapping(address => MetaStealthAddress) private metaStealthAddresses;

    function setMetaStealthAddress(MetaStealthAddress calldata newMetaAddress, bytes calldata signature) external {
        if (msg.sender != address(uint160(uint256(keccak256(newMetaAddress.pubKey))))) {
            revert MetaStealthAddressRegistry__UnauthorizedSender();
        }

        bytes32 metaAddressHash = keccak256(abi.encodePacked(newMetaAddress.pubKey, newMetaAddress.secretHash));
        address signer = metaAddressHash.toEthSignedMessageHash().recover(signature);

        if (signer != msg.sender) {
            revert MetaStealthAddressRegistry__UnauthorizedSigner();
        }

        metaStealthAddresses[msg.sender] = newMetaAddress;
    }

    function addressMetaStealthAddress(address addr) external view returns (MetaStealthAddress memory) {
        return metaStealthAddresses[addr];
    }
}
