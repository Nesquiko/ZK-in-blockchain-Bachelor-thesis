// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Groth16Verifier} from "../src/Verifier.sol";
import {DeployConfig} from "./DeployConfig.s.sol";
import {Script} from "forge-std/Script.sol";

contract DeployVerifier is Script {
    function run() external returns (Groth16Verifier, DeployConfig) {
        DeployConfig config = new DeployConfig();

        (uint256 deployerPK) = config.activeConfig();

        vm.startBroadcast(deployerPK);
        Groth16Verifier verifier = new Groth16Verifier();
        vm.stopBroadcast();

        return (verifier, config);
    }
}
