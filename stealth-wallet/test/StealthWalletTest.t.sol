pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {StealthWallet} from "../src/StealthWallet.sol";
import {Groth16Verifier} from "../src/Verifier.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Vm} from "forge-std/Vm.sol";

contract StealthWalletTest is Test {
    using MessageHashUtils for bytes32;

    address bob;
    Vm.Wallet bobsOtherWallet;
    address alice;
    Groth16Verifier verifier;

    function setUp() public {
        bob = makeAddr("bob");
        bobsOtherWallet = vm.createWallet(uint256(keccak256(bytes("1"))));
        alice = makeAddr("alice");
        vm.deal(alice, 1000 ether);
        verifier = new Groth16Verifier();
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
                [uint256(0), uint256(0)], [[uint256(0), uint256(0)], [uint256(0), uint256(0)]], [uint256(0), uint256(0)]
            )
        );
    }

    function testWithdrawInvaliProof() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, 0, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory invalidProof = StealthWallet.OwnershipProof(
            [uint256(0), uint256(0)], [[uint256(0), uint256(0)], [uint256(0), uint256(0)]], [uint256(0), uint256(0)]
        );

        vm.prank(bobsOtherWallet.addr);
        vm.expectRevert(StealthWallet.StealthWallet__InvalidProof.selector);
        wallet.withdraw(bobsOtherWallet.addr, initialBalance, invalidProof);
    }

    function testWithdraw() public {
        address withdrawee = vm.addr(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80);

        uint256 initialBalance = 10 ether;
        // owners secret is 10, and sender secret is 3483470154602476955580095072550274295529048159835637215612023280312161528373
        uint256 code = 8773147860295655865765957362831769614202560351882369012261198127295964487019;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, bytes32(code), address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory proof = StealthWallet.OwnershipProof(
            [
                0x2e3591c3fee568d00f4069d68895d4dabde1d5c251adc13177b9d8f43cd0f993,
                0x09b3f838b99ffb119e33cb01368c48104c7e3d155ea528d7c350e8e677cd4c82
            ],
            [
                [
                    0x28af2952b308f570c06f9a31b02b310a91a1767981aebd6b113a073cddbc821a,
                    0x15373bb42865f605996101ac66cd93e04af0925238e87ffa9caacab70843eb98
                ],
                [
                    0x0975b9715d4f2e48276578bcf60a12dd7aa3e2c6604779846b4ca6992f1f28d4,
                    0x1fd4240683a625c85fcdf89aaf12e5fa62298e1e10c127dd801c228c1c4b15c2
                ]
            ],
            [
                0x2b1a3caa419c3492e79ed7e08585658cc1f26f6369c17dd470a2651cbcea005c,
                0x1b372a32ee5d9d43c124437c62ef45db7704fc34194bdbae9d5b65e6f5ead129
            ]
        );

        vm.prank(withdrawee);
        wallet.withdraw(withdrawee, initialBalance, proof);
        assertEq(initialBalance, withdrawee.balance);
    }

    function testWithdrawFromNotProovedWithdrawee() public {
        address unproovedWithdrawee = vm.addr(123456);

        uint256 initialBalance = 10 ether;
        // owners secret is 10, and sender secret is 3483470154602476955580095072550274295529048159835637215612023280312161528373
        uint256 code = 8773147860295655865765957362831769614202560351882369012261198127295964487019;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, bytes32(code), address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        StealthWallet.OwnershipProof memory proof = StealthWallet.OwnershipProof(
            [
                0x2e3591c3fee568d00f4069d68895d4dabde1d5c251adc13177b9d8f43cd0f993,
                0x09b3f838b99ffb119e33cb01368c48104c7e3d155ea528d7c350e8e677cd4c82
            ],
            [
                [
                    0x28af2952b308f570c06f9a31b02b310a91a1767981aebd6b113a073cddbc821a,
                    0x15373bb42865f605996101ac66cd93e04af0925238e87ffa9caacab70843eb98
                ],
                [
                    0x0975b9715d4f2e48276578bcf60a12dd7aa3e2c6604779846b4ca6992f1f28d4,
                    0x1fd4240683a625c85fcdf89aaf12e5fa62298e1e10c127dd801c228c1c4b15c2
                ]
            ],
            [
                0x2b1a3caa419c3492e79ed7e08585658cc1f26f6369c17dd470a2651cbcea005c,
                0x1b372a32ee5d9d43c124437c62ef45db7704fc34194bdbae9d5b65e6f5ead129
            ]
        );

        vm.prank(unproovedWithdrawee);
        vm.expectRevert(StealthWallet.StealthWallet__InvalidProof.selector);
        wallet.withdraw(unproovedWithdrawee, initialBalance, proof);
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
}
