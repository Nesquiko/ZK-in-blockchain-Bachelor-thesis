// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract EphemeralKeyRegistry {
    error EphemeralKeyRegistry__OutOfRange();

    struct EphemeralKey {
        bytes16 iv;
        bytes1 ephemPublicKey1;
        bytes32 ephemPublicKey2;
        bytes32 ephemPublicKey3;
        bytes32 mac;
        bytes32 ciphertext1;
        bytes32 ciphertext2;
    }

    EphemeralKey[] private ephemeralKeys;

    function submit(EphemeralKey memory key) external {
        ephemeralKeys.push(key);
    }

    function totalKeys() external view returns (uint256) {
        return ephemeralKeys.length;
    }

    function getKeysBatch(uint256 from, uint256 size) external view returns (EphemeralKey[] memory, uint256) {
        if (from > ephemeralKeys.length) {
            revert EphemeralKeyRegistry__OutOfRange();
        } else if (size == 0) {
            return (new EphemeralKey[](0), ephemeralKeys.length);
        }

        uint256 end = from + size;
        if (end > ephemeralKeys.length) {
            end = ephemeralKeys.length;
        }
        size = end - from;

        EphemeralKey[] memory ret = new EphemeralKey[](size);
        for (uint256 i = from; i < end; i++) {
            ret[i - from] = ephemeralKeys[i];
        }
        return (ret, ephemeralKeys.length);
    }
}
