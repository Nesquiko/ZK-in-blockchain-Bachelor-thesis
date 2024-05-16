# Aderyn Analysis Report

This report was generated by [Aderyn](https://github.com/Cyfrin/aderyn), a static analysis tool built by [Cyfrin](https://cyfrin.io), a blockchain security company. This report is not a substitute for manual audit or security review. It should not be relied upon for any purpose other than to assist in the identification of potential security vulnerabilities.

# Table of Contents

- [Summary](#summary)
  - [Files Summary](#files-summary)
  - [Files Details](#files-details)
  - [Issue Summary](#issue-summary)
- [Low Issues](#low-issues)
  - [L-1: Solidity pragma should be specific, not wide](#l-1-solidity-pragma-should-be-specific-not-wide)
  - [L-2: Missing checks for `address(0)` when assigning values to address state variables](#l-2-missing-checks-for-address0-when-assigning-values-to-address-state-variables)
  - [L-3: `public` functions not used internally could be marked `external`](#l-3-public-functions-not-used-internally-could-be-marked-external)
  - [L-4: PUSH0 is not supported by all chains](#l-4-push0-is-not-supported-by-all-chains)

# Summary

## Files Summary

| Key         | Value |
| ----------- | ----- |
| .sol Files  | 4     |
| Total nSLOC | 204   |

## Files Details

| Filepath                           | nSLOC   |
| ---------------------------------- | ------- |
| src/EphemeralKeyRegistry.sol       | 37      |
| src/MetaStealthAddressRegistry.sol | 28      |
| src/StealthWallet.sol              | 35      |
| src/Verifier.sol                   | 104     |
| **Total**                          | **204** |

## Issue Summary

| Category | No. of Issues |
| -------- | ------------- |
| High     | 0             |
| Low      | 4             |

# Low Issues

## ✅ L-1: Solidity pragma should be specific, not wide

Consider using a specific version of Solidity in your contracts instead of a wide version. For example, instead of `pragma solidity ^0.8.0;`, use `pragma solidity 0.8.0;`

- Found in src/EphemeralKeyRegistry.sol [Line: 2](src/EphemeralKeyRegistry.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/MetaStealthAddressRegistry.sol [Line: 2](src/MetaStealthAddressRegistry.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/StealthWallet.sol [Line: 2](src/StealthWallet.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/Verifier.sol [Line: 21](src/Verifier.sol#L21)

  ```solidity
  pragma solidity >=0.7.0 <0.9.0;
  ```

### Fixed

## ✅ L-2: Missing checks for `address(0)` when assigning values to address state variables

Check for `address(0)` when assigning values to address state variables.

- Found in src/StealthWallet.sol [Line: 22](src/StealthWallet.sol#L22)

  ```solidity
          verifier = Groth16Verifier(verifierAddr);
  ```

### Fixed

## ✅ L-3: `public` functions not used internally could be marked `external`

Instead of marking a function as `public`, consider marking it as `external` if it is not used internally.

- Found in src/StealthWallet.sol [Line: 29](src/StealthWallet.sol#L29)

  ```solidity
      function withdraw(address to, uint256 amount, OwnershipProof calldata proof) public returns (bool) {
  ```

- Found in src/Verifier.sol [Line: 60](src/Verifier.sol#L60)

  ```solidity
      function verifyProof(
  ```

### Fixed

## ✅ L-4: PUSH0 is not supported by all chains

Solc compiler version 0.8.20 switches the default target EVM version to Shanghai, which means that the generated bytecode will include PUSH0 opcodes. Be sure to select the appropriate EVM version in case you intend to deploy on a chain other than mainnet like L2 chains that may not support PUSH0, otherwise deployment of your contracts will fail.

- Found in src/EphemeralKeyRegistry.sol [Line: 2](src/EphemeralKeyRegistry.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/MetaStealthAddressRegistry.sol [Line: 2](src/MetaStealthAddressRegistry.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/StealthWallet.sol [Line: 2](src/StealthWallet.sol#L2)

  ```solidity
  pragma solidity ^0.8.13;
  ```

- Found in src/Verifier.sol [Line: 21](src/Verifier.sol#L21)

  ```solidity
  pragma solidity >=0.7.0 <0.9.0;
  ```

### Addressed

These contracts will not be deployed only on chains supporting EVM Shanghai.