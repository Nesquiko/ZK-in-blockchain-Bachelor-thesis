// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MetaStealthAddressRegistry {
    error MetaStealthAddressRegistry__UnauthorizedSender();
    error MetaStealthAddressRegistry__InvalidSignature();

    struct MetaStealthAddress {
        bytes pubKey;
        bytes32 h;
        bytes signature;
    }

    uint256 public constant SIG_LENGTH = 65;
    uint256 public constant BYTES_LENGTH_END_OFFSET = 32;
    uint256 public constant R_LENGTH_END_OFFSET = 32 + 32;
    uint256 public constant S_LENGTH_END_OFFSET = 32 + 32 + 32;

    mapping(address => MetaStealthAddress) public metaStealthAddresses;

    function setMetaStealthAddress(MetaStealthAddress memory newMetaAddress) external {
        if (msg.sender != address(bytes20(keccak256(newMetaAddress.pubKey)))) {
            revert MetaStealthAddressRegistry__UnauthorizedSender();
        }

        if (newMetaAddress.signature.length != SIG_LENGTH) {
            revert MetaStealthAddressRegistry__InvalidSignature();
        }

        bytes32 metaAddressHash = keccak256(abi.encode(newMetaAddress.pubKey, newMetaAddress.h));
        bytes32 ethSignedAddressHash = ethSignedDataHash(metaAddressHash);
    }

    function ethSignedDataHash(bytes32 ethSignedAddressHash, bytes memory signature) private pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedAddressHash, v, r, s);
    }

    /*
    * Signatures are performed on prefix and data. More about prefix ERC-191 (https://eips.ethereum.org/EIPS/eip-191)
    */
    function ethSignedDataHash(bytes32 metaAddressHash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", metaAddressHash));
    }

    function splitSignature(bytes memory signature) private pure returns (bytes32 r, bytes32 v, uint8 s) {
        assembly {
            r := mload(add(signature, BYTES_LENGTH_END_OFFSET))
            s := mload(add(signature, R_LENGTH_END_OFFSET))
            v := byte(0, mload(add(signature, S_LENGTH_END_OFFSET)))
        }

        return (r, v, s);
    }
}
