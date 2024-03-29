pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DeployVerifier} from "../script/DeployVerifier.s.sol";
import {StealthWallet} from "../src/StealthWallet.sol";
import {DeployConfig} from "../script/DeployConfig.s.sol";
import {Vm} from "forge-std/Vm.sol";
import {Groth16Verifier} from "../src/Verifier.sol";

contract StealthWalletTest is Test {
    address bob;
    address alice;

    DeployVerifier deployer;
    DeployConfig config;
    Groth16Verifier verifier;

    function setUp() public {
        bob = makeAddr("bob");
        alice = makeAddr("alice");
        vm.deal(alice, 1000 ether);

        deployer = new DeployVerifier();
        (verifier, config) = deployer.run();
    }

    function testFundedOnCreation() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, address(verifier));
        assertEq(initialBalance, address(wallet).balance);
    }

    function testFundAfterCreation() public {
        uint256 initialBalance = 0 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        uint256 fundAmount = 10 ether;
        vm.prank(alice);
        address(wallet).call{value: fundAmount}("");
        assertEq(fundAmount, address(wallet).balance);
    }

    function testWithdrawExceedsBalance() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        vm.expectRevert(StealthWallet.StealthWallet__AmountExceedsBalance.selector);
        wallet.withdraw(bob, initialBalance + 1 ether);
    }

    function testWithdraw() public {
        uint256 initialBalance = 10 ether;
        StealthWallet wallet = newStealthWallet(alice, initialBalance, address(verifier));
        assertEq(initialBalance, address(wallet).balance);

        wallet.withdraw(bob, initialBalance);
        assertEq(initialBalance, bob.balance);
    }

    function newStealthWallet(address deployer, uint256 amount, address verifier) private returns (StealthWallet) {
        vm.startBroadcast(deployer);
        StealthWallet wallet = new StealthWallet{value: amount}(0, verifier);
        vm.stopBroadcast();
        return wallet;
    }
}
