# ZK in Blockchain - Bachelor thesis - Stealth Address Scheme

This Bachelor thesis explores zero knowledge proofs in context of a stealth address
scheme on Ethereum.

Stealth addresses enable one to receive transactions without any on-chain link.
Additional benefit over the good old _generating a new wallet for each
transaction_, is that senders don't have to wait for recipients to give them a
new wallet, rather they derive it themselves with on-chain data from the recipient.

Thanks to zero knowledge proofs, recipient can prove ownership to his stealth address
without leaking any linking data.

## Directory Structure

- `circuits` - contains [Circom](https://docs.circom.io/ "Circom") circuit used for
  ZKP creation and validation
- `docs` - contains the Bachelor thesis latex source code
- `stealth-wallet` - includes the [Foundry](https://github.com/foundry-rs/foundry/tree/master "Foundry")
  project, which comprises the essential smart contracts required for implementation
  of the stealth address ZKP scheme
- `stealth-wallet-app` - frontend for interacting with stealth addresses build with
  [SolidJS](https://www.solidjs.com/ "SolidJS")
