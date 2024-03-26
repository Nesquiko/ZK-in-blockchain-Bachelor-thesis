import {
  HttpProvider,
  MatchPrimitiveType,
  Web3,
  Web3BaseWalletAccount,
} from "web3";
import { metaStealthRegistryABI } from "./contract-abis";

const metaStealthRegistryAddress = import.meta.env.PROD
  ? "" // address on sepolia
  : "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // address on local anvil

export const web3 = import.meta.env.PROD
  ? new Web3(import.meta.env.VITE_SEPOLIA_RPC)
  : new Web3(new HttpProvider("http://127.0.0.1:8545"));

export const metaStealthRegistry = new web3.eth.Contract(
  metaStealthRegistryABI,
  metaStealthRegistryAddress,
);

export const bobsPrimaryAccount = web3.eth.accounts.privateKeyToAccount(
  import.meta.env.PROD
    ? import.meta.env.VITE_BOB_PK
    : "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
);

export const bobsSecondaryAccounts = (
  import.meta.env.PROD
    ? [import.meta.env.VITE_BOB_PK_2, import.meta.env.VITE_BOB_PK_3]
    : [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
        "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
      ]
).map((pk) => web3.eth.accounts.privateKeyToAccount(pk));

export const aliceAccount = web3.eth.accounts.privateKeyToAccount(
  import.meta.env.PROD
    ? import.meta.env.VITE_ALICE_PK
    : "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
);

export interface StealthAddress {
  address: string;
  balance: bigint;
}

export async function fetchBalance(
  account: Web3BaseWalletAccount,
): Promise<bigint> {
  return await web3.eth.getBalance(account.address);
}

export interface MetaStealthAddress {
  pubKey: MatchPrimitiveType<"bytes", unknown>;
  h: MatchPrimitiveType<"bytes32", unknown>;
  signature: MatchPrimitiveType<"bytes", unknown>;
}

export async function fetchMetaStealthAddres(
  address: string,
): Promise<MetaStealthAddress> {
  return await metaStealthRegistry.methods
    .addressMetaStealthAddress(address)
    .call();
}

export async function fetchStealthAddresses(
  account: Web3BaseWalletAccount,
): Promise<StealthAddress[]> {
  return [
    { address: "0xAb988E86af062772227994030A4D448EEE783617", balance: 0n },
    {
      address: "0x156d4C4Fd135Ba1ff36D995570599F5330bC2Aa3",
      balance: 1000000000000000000n,
    },
    {
      address: "0xA2e1534F3Ad88161525acBDa43ED7f6f19D561Da",
      balance: 431512512412510000n,
    },
    {
      address: "0x099Ad3e6C13810F171d8bed8581828416e4689F6",
      balance: 22125125126136160000n,
    },
  ];
}

export async function withDrawStealthWallet(
  stealtWalletAddress: string,
  withdrawee: Web3BaseWalletAccount,
  amount: bigint,
): Promise<void> {}
