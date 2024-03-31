// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DeployMetaStealthAddressRegistry} from "../script/DeployMetaStealthAddressRegistry.s.sol";
import {DeployConfig} from "../script/DeployConfig.s.sol";
import {MetaStealthAddressRegistry} from "../src/MetaStealthAddressRegistry.sol";
import {Vm} from "forge-std/Vm.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MetaStealthAddressRegistryTest is Test {
    using MessageHashUtils for bytes32;

    // secret = 0xb7cf302145348387b9e69fde82d8e634a0f87
    bytes32 public constant OWNER_SECRET_HASH = 0x2D2EDD9BFE1CC6A328E52CC8989C4F27955F68B9BB0EC136D45100CE9C6C61F4;
    /*
    * Signatures are performed on prefix and data. More about prefix
    * ERC-191 (https://eips.ethereum.org/EIPS/eip-191). The 32 is length of
    * the signed message, so this prefix can ONLY be used to sign a hash.
    */
    string public constant EIP_191_PREFIX = "\x19Ethereum Signed Message:\n32";

    DeployMetaStealthAddressRegistry deployer;
    MetaStealthAddressRegistry registry;
    DeployConfig config;
    Vm.Wallet wallet;

    function setUp() public {
        wallet = vm.createWallet(uint256(keccak256(bytes("1"))));
        deployer = new DeployMetaStealthAddressRegistry();
        (registry, config) = deployer.run();
    }

    function testSetNewMetaStealthAddress() public {
        MetaStealthAddressRegistry.MetaStealthAddress memory metaAddress =
            signedMetaStealthAddress(wallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), OWNER_SECRET_HASH);

        vm.prank(wallet.addr);
        registry.setMetaStealthAddress(metaAddress);

        bytes32 newSecretHash = 0x2A267E27E712412E8EEFEC1E174CE85B1AF2F2D9A8014FA4DC723ABB4D27EF7D; // secret: 5
        metaAddress = signedMetaStealthAddress(wallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), newSecretHash);

        vm.prank(wallet.addr);
        registry.setMetaStealthAddress(metaAddress);

        metaAddress = registry.addressMetaStealthAddress(wallet.addr);
        assertEq(newSecretHash, metaAddress.h);
    }

    function testSetMetaStealthAddress() public {
        MetaStealthAddressRegistry.MetaStealthAddress memory metaAddress =
            registry.addressMetaStealthAddress(wallet.addr);
        assertEq(0, metaAddress.pubKey.length);
        assertEq(bytes32(0), metaAddress.h);
        assertEq(0, metaAddress.signature.length);

        metaAddress =
            signedMetaStealthAddress(wallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), OWNER_SECRET_HASH);
        bytes memory signature = metaAddress.signature;

        vm.prank(wallet.addr);
        registry.setMetaStealthAddress(metaAddress);

        metaAddress = registry.addressMetaStealthAddress(wallet.addr);
        assertEq(abi.encode(wallet.publicKeyX, wallet.publicKeyY), metaAddress.pubKey);
        assertEq(OWNER_SECRET_HASH, metaAddress.h);
        assertEq(signature, metaAddress.signature);
    }

    function testRevertOnPublicKeyIsntSenders() public {
        MetaStealthAddressRegistry.MetaStealthAddress memory metaAddress =
            signedMetaStealthAddress(wallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), OWNER_SECRET_HASH);
        address differentSender = makeAddr("different");
        vm.prank(differentSender);
        vm.expectRevert(MetaStealthAddressRegistry.MetaStealthAddressRegistry__UnauthorizedSender.selector);
        registry.setMetaStealthAddress(metaAddress);
    }

    function testRevertOnInvalidSignature() public {
        MetaStealthAddressRegistry.MetaStealthAddress memory metaAddress =
            signedMetaStealthAddress(wallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), OWNER_SECRET_HASH);
        metaAddress.signature = bytes.concat(metaAddress.signature, bytes("x"));

        vm.prank(wallet.addr);
        vm.expectRevert(
            abi.encodeWithSelector(ECDSA.ECDSAInvalidSignatureLength.selector, metaAddress.signature.length)
        );
        registry.setMetaStealthAddress(metaAddress);
    }

    function testRevertOnDifferentSigner() public {
        Vm.Wallet memory differentWallet = vm.createWallet(uint256(keccak256(bytes("2"))));

        MetaStealthAddressRegistry.MetaStealthAddress memory metaAddress = signedMetaStealthAddress(
            differentWallet, abi.encode(wallet.publicKeyX, wallet.publicKeyY), OWNER_SECRET_HASH
        );

        vm.prank(wallet.addr);
        vm.expectRevert(MetaStealthAddressRegistry.MetaStealthAddressRegistry__UnauthorizedSigner.selector);
        registry.setMetaStealthAddress(metaAddress);
    }

    function signedMetaStealthAddress(Vm.Wallet memory signer, bytes memory pubKey, bytes32 h)
        private
        returns (MetaStealthAddressRegistry.MetaStealthAddress memory)
    {
        bytes32 digest = keccak256(abi.encodePacked(pubKey, h)).toEthSignedMessageHash();
        bytes memory signature = sign(signer, digest);

        return MetaStealthAddressRegistry.MetaStealthAddress(pubKey, h, signature);
    }

    function sign(Vm.Wallet memory signer, bytes32 digest) private returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, digest);
        return abi.encodePacked(r, s, v);
    }
}
