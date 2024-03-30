// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {EphemeralKeyRegistry} from "../src/EphemeralKeyRegistry.sol";
import {Vm} from "forge-std/Vm.sol";

contract EphemeralKeyRegistryTest is Test {
    EphemeralKeyRegistry.EphemeralKey key = EphemeralKeyRegistry.EphemeralKey(
        "iv", "e", "ephemPublicKey2", "ephemPublicKey3", "mac", "ciphertext1", "ciphertext2"
    );

    EphemeralKeyRegistry registry;
    address user;

    modifier submitKeys(uint256 n) {
        for (uint256 i = 0; i < n; i++) {
            registry.submit(key);
        }
        _;
    }

    function setUp() public {
        user = makeAddr("user");
        vm.deal(user, 1000 ether);
        registry = new EphemeralKeyRegistry();
    }

    function testAddEphemeralKey() public {
        registry.submit(key);
    }

    function testGetKeysBatchOutOfRange() public submitKeys(10) {
        vm.expectRevert(EphemeralKeyRegistry.EphemeralKeyRegistry__OutOfRange.selector);
        registry.getKeysBatch(11, 2);
    }

    function testGetKeysBatchZeroSize() public submitKeys(10) {
        (EphemeralKeyRegistry.EphemeralKey[] memory keys,) = registry.getKeysBatch(9, 0);
        assertEq(keys.length, 0);
    }

    function testGetKeysBatchSizeExceedsRemaining() public submitKeys(10) {
        (EphemeralKeyRegistry.EphemeralKey[] memory keys,) = registry.getKeysBatch(5, 100);
        assertEq(keys.length, 5);
    }

    function testGetKeysCorrectPaging() public {
        for (uint256 i = 0; i < 10; i++) {
            EphemeralKeyRegistry.EphemeralKey memory ek = EphemeralKeyRegistry.EphemeralKey(
                bytes16(uint128(i)), bytes1(uint8(i)), bytes32(i), bytes32(i), bytes32(i), bytes32(i), bytes32(i)
            );
            registry.submit(ek);
        }

        (EphemeralKeyRegistry.EphemeralKey[] memory keys,) = registry.getKeysBatch(3, 2);
        assertEq(keys.length, 2);
        assertEq(keys[0].iv, bytes16(uint128(3)));
        assertEq(keys[1].iv, bytes16(uint128(4)));
    }

    function testGetKeysReturnCorrectTotal() public submitKeys(10) {
        (, uint256 total) = registry.getKeysBatch(3, 2);
        assertEq(total, 10);
    }
}
