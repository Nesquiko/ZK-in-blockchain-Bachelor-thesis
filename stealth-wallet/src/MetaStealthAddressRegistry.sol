// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MetaStealthAddressRegistry {
    error MetaStealthAddressRegistry__UnauthorizedSender();
    error MetaStealthAddressRegistry__InvalidSignature();
    error MetaStealthAddressRegistry__UnauthorizedSigner();

    struct MetaStealthAddress {
        bytes pubKey;
        bytes32 h;
        bytes signature;
    }

    /*
    * Signatures are performed on prefix and data. More about prefix
    * ERC-191 (https://eips.ethereum.org/EIPS/eip-191). The 32 is length of
    * the signed message, so this prefix can ONLY be used to sign a hash.
    */
    string public constant EIP_191_PREFIX = "\x19Ethereum Signed Message:\n32";
    uint256 public constant SIG_LENGTH = 65;
    uint256 public constant BYTES_LENGTH_END_OFFSET = 32;
    uint256 public constant R_LENGTH_END_OFFSET = 32 + 32;
    uint256 public constant S_LENGTH_END_OFFSET = 32 + 32 + 32;

    mapping(address => MetaStealthAddress) private metaStealthAddresses;

    function setMetaStealthAddress(MetaStealthAddress memory newMetaAddress) external {
        if (msg.sender != address(uint160(uint256(keccak256(newMetaAddress.pubKey))))) {
            revert MetaStealthAddressRegistry__UnauthorizedSender();
        }

        if (newMetaAddress.signature.length != SIG_LENGTH) {
            revert MetaStealthAddressRegistry__InvalidSignature();
        }

        bytes32 metaAddressHash = keccak256(abi.encodePacked(newMetaAddress.pubKey, newMetaAddress.h));
        bytes32 ethSignedAddressHash = ethSignedDataHash(metaAddressHash);
        address signer = recoverSigner(ethSignedAddressHash, newMetaAddress.signature);

        if (signer != msg.sender) {
            revert MetaStealthAddressRegistry__UnauthorizedSigner();
        }

        metaStealthAddresses[msg.sender] = newMetaAddress;
    }

    function addressMetaStealthAddress(address addr) external view returns (MetaStealthAddress memory) {
        return metaStealthAddresses[addr];
    }

    function recoverSigner(bytes32 ethSignedAddressHash, bytes memory signature) private pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(ethSignedAddressHash, v, r, s);
    }

    function ethSignedDataHash(bytes32 metaAddressHash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(signaturePrefix(), metaAddressHash));
    }

    function splitSignature(bytes memory signature) private pure returns (uint8 v, bytes32 r, bytes32 s) {
        assembly {
            r := mload(add(signature, BYTES_LENGTH_END_OFFSET))
            s := mload(add(signature, R_LENGTH_END_OFFSET))
            v := byte(0, mload(add(signature, S_LENGTH_END_OFFSET)))
        }

        return (v, r, s);
    }

    function signaturePrefix() public pure returns (string memory) {
        return EIP_191_PREFIX;
    }
}
