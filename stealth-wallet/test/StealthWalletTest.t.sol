pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DeployVerifier} from "../script/DeployVerifier.s.sol";
import {StealthWallet} from "../src/StealthWallet.sol";
import {DeployConfig} from "../script/DeployConfig.s.sol";
import {Groth16Verifier} from "../src/Verifier.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Vm} from "forge-std/Vm.sol";

contract StealthWalletTest is Test {
    using MessageHashUtils for bytes32;

    address bob;
    Vm.Wallet bobsOtherWallet;
    address alice;

    DeployVerifier deployer;
    DeployConfig config;
    Groth16Verifier verifier;

    function setUp() public {
        bob = makeAddr("bob");
        bobsOtherWallet = vm.createWallet(uint256(keccak256(bytes("1"))));
        alice = makeAddr("alice");
        vm.deal(alice, 1000 ether);

        deployer = new DeployVerifier();
        (verifier, config) = deployer.run();
    }

    function testFundedOnCreation() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);
    }

    function testFundAfterCreation() public {
        uint256 initialBalance = 0 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        uint256 fundAmount = 10 ether;
        vm.prank(alice);
        (bool success,) = address(wallet).call{value: fundAmount}("");
        assertTrue(success);
        assertEq(fundAmount, address(wallet).balance);
    }

    function testWithdrawExceedsBalance() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        vm.expectRevert(StealthWallet.StealthWallet__AmountExceedsBalance.selector);
        wallet.withdraw(
            bob,
            initialBalance + 1 ether,
            StealthWallet.OwnershipProof(
                [uint256(0), uint256(0)],
                [[uint256(0), uint256(0)], [uint256(0), uint256(0)]],
                [uint256(0), uint256(0)],
                [uint256(0)]
            ),
            "some signature"
        );
    }

    function testWithdrawInvalidSignatureLength() public {
        uint256 initialBalance = 10 ether;
        uint256 code = 1815914492748566187867478513147096366244223614126420973210485945409066344739;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, bytes32(code), address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        bytes memory invalidSig = "invalid-signature";
        vm.expectRevert(abi.encodeWithSelector(ECDSA.ECDSAInvalidSignatureLength.selector, invalidSig.length));
        wallet.withdraw(
            bob,
            initialBalance,
            StealthWallet.OwnershipProof(
                [uint256(0), uint256(0)],
                [[uint256(0), uint256(0)], [uint256(0), uint256(0)]],
                [uint256(0), uint256(0)],
                [uint256(0)]
            ),
            invalidSig
        );
    }

    function testWithdrawInvalidSignature() public {
        uint256 initialBalance = 10 ether;
        uint256 code = 1815914492748566187867478513147096366244223614126420973210485945409066344739;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, bytes32(code), address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        vm.expectRevert(ECDSA.ECDSAInvalidSignature.selector);
        wallet.withdraw(
            bob,
            initialBalance,
            StealthWallet.OwnershipProof(
                [uint256(0), uint256(0)],
                [[uint256(0), uint256(0)], [uint256(0), uint256(0)]],
                [uint256(0), uint256(0)],
                [uint256(0)]
            ),
            "invalid-signature-invalid-signature-invalid-signature-invalid-sig"
        );
    }

    function testWithdrawDifferentSigner() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory proof = StealthWallet.OwnershipProof(
            [uint256(0), uint256(0)],
            [[uint256(0), uint256(0)], [uint256(0), uint256(0)]],
            [uint256(0), uint256(0)],
            [uint256(0)]
        );
        bytes memory signature = sign(bobsOtherWallet, proof);

        vm.prank(bob);
        vm.expectRevert(StealthWallet.StealthWallet__UnauthorizedSigner.selector);
        wallet.withdraw(bobsOtherWallet.addr, initialBalance, proof, signature);
    }

    function testWithdrawInvaliProof() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory proof = StealthWallet.OwnershipProof(
            [uint256(0), uint256(0)],
            [[uint256(0), uint256(0)], [uint256(0), uint256(0)]],
            [uint256(0), uint256(0)],
            [uint256(0)]
        );
        bytes memory signature = sign(bobsOtherWallet, proof);

        vm.prank(bobsOtherWallet.addr);
        vm.expectRevert(StealthWallet.StealthWallet__InvalidProof.selector);
        wallet.withdraw(bobsOtherWallet.addr, initialBalance, proof, signature);
    }

    function testWithdraw() public {
        uint256 initialBalance = 10 ether;
        uint256 code = 1815914492748566187867478513147096366244223614126420973210485945409066344739;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, bytes32(code), address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory proof = StealthWallet.OwnershipProof(
            [
                0x0fe33c359e3aa8ca122cc56025903e8437f48b47790f797f68a6779269933c08,
                0x235678631afa8f41b16fb40538deb3821f27a7de9c54e8c1e33cf6e6d9e83587
            ],
            [
                [
                    0x0f26909cfbd6d68259b6fa587f4326fe33878a010f2d1d769181a75df1e77ac5,
                    0x0ddf1d0ad09d8056b420cf45d5bd688ea2fadad8103ec00aa60f803c3149f7c2
                ],
                [
                    0x1b76ada60cd11da8cc7918f7ae38acfe9a2b019b5fcea7d84c10110a0ed7661d,
                    0x017f334b7dc8be7498367109b7087b5f3c9ecac3e5c285281da5f90edd6b05d0
                ]
            ],
            [
                0x2456e8721a3a183b9f4eb69e6bf2cce2972084e7c0a06a2d18a43ee20511e36d,
                0x1cf221e6cda5b238f822e99798256f0f89a6115fb3530f9a2cc21d48cd5e9e76
            ],
            [code]
        );
        bytes memory signature = sign(bobsOtherWallet, proof);

        vm.prank(bobsOtherWallet.addr);
        wallet.withdraw(bob, initialBalance, proof, signature);
        assertEq(initialBalance, bob.balance);
    }

    function newStealthWallet(address deployerAddress, uint256 amount, bytes32 code, address verifierAddress)
        private
        returns (StealthWallet)
    {
        vm.startBroadcast(deployerAddress);
        StealthWallet wallet = new StealthWallet{value: amount}(code, verifierAddress);
        vm.stopBroadcast();
        return wallet;
    }

    function sign(Vm.Wallet memory signer, StealthWallet.OwnershipProof memory proof) private returns (bytes memory) {
        bytes32 digest = keccak256(abi.encodePacked(proof.piA, proof.piB[0], proof.piB[1], proof.piC, proof.pubSignals))
            .toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, digest);
        return abi.encodePacked(r, s, v);
    }
}
