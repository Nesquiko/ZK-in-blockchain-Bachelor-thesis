// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {MetaStealthAddressRegistry} from "../src/MetaStealthAddressRegistry.sol";
import {DeployConfig} from "./DeployConfig.s.sol";

contract DeployMetaStealthAddressRegistry is Script {
    function run() external returns (MetaStealthAddressRegistry, DeployConfig) {
        DeployConfig config = new DeployConfig();

        (uint256 deployerPK) = config.activeConfig();

        vm.startBroadcast(deployerPK);
        MetaStealthAddressRegistry registry = new MetaStealthAddressRegistry();
        vm.stopBroadcast();

        return (registry, config);
    }
}
