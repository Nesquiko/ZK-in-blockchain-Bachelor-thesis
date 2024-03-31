// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DeployConfig} from "./DeployConfig.s.sol";
import {MetaStealthAddressRegistry} from "../src/MetaStealthAddressRegistry.sol";
import {Groth16Verifier} from "../src/Verifier.sol";
import {EphemeralKeyRegistry} from "../src/EphemeralKeyRegistry.sol";

contract SetupSepolia is Script {
    uint256 public constant SEPOLIA_CHAIN_ID = 11155111;

    function run() external {
        require(block.chainid == SEPOLIA_CHAIN_ID, "Running on wrong network, only for Sepolia");

        DeployConfig config = new DeployConfig();
        (uint256 deployerPK) = config.activeConfig();

        vm.startBroadcast(deployerPK);
        new MetaStealthAddressRegistry();
        new Groth16Verifier();
        new EphemeralKeyRegistry();
        vm.stopBroadcast();
    }
}
