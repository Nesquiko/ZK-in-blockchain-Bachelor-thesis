import { Web3, Web3BaseWalletAccount } from "web3";

const web3 = new Web3(import.meta.env.VITE_SEPOLIA_RPC);

export interface StealthAddress {
  address: string;
  balance: bigint;
}

export async function fetchBalance(
  account: Web3BaseWalletAccount,
): Promise<bigint> {
  return await web3.eth.getBalance(account.address);
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

const META_REGISTRY_ADDRESS = "0x8eC2d4D162E8b34e544D0B129e84698D99914771";

const metaRegistryABI = [
  {
    type: "function",
    name: "BYTES_LENGTH_END_OFFSET",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "EIP_191_PREFIX",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "R_LENGTH_END_OFFSET",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SIG_LENGTH",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "S_LENGTH_END_OFFSET",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addressMetaStealthAddress",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct MetaStealthAddressRegistry.MetaStealthAddress",
        components: [
          {
            name: "pubKey",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "h",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setMetaStealthAddress",
    inputs: [
      {
        name: "newMetaAddress",
        type: "tuple",
        internalType: "struct MetaStealthAddressRegistry.MetaStealthAddress",
        components: [
          {
            name: "pubKey",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "h",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "signaturePrefix",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "error",
    name: "MetaStealthAddressRegistry__InvalidSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "MetaStealthAddressRegistry__UnauthorizedSender",
    inputs: [],
  },
  {
    type: "error",
    name: "MetaStealthAddressRegistry__UnauthorizedSigner",
    inputs: [],
  },
];

export const metaAddressRegistry = new web3.eth.Contract(
  metaRegistryABI,
  META_REGISTRY_ADDRESS,
);

export default web3;
