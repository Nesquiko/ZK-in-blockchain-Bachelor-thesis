// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";

contract DeployConfig is Script {
    uint256 public constant ANVIL_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 public constant SEPOLIA_CHAIN_ID = 11155111;

    NetworkConfig public activeConfig;

    struct NetworkConfig {
        uint256 deployerPK;
    }

    constructor() {
        if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeConfig = getSepoliaConfig();
        } else {
            activeConfig = getAnvilConfig();
        }
    }

    function getSepoliaConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({deployerPK: vm.envUint("PRIVATE_KEY")});
    }

    function getAnvilConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({deployerPK: ANVIL_KEY});
    }
}
