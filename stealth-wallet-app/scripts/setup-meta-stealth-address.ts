import Web3, { HttpProvider } from "web3";
import { privateToPublic, toBuffer } from "ethereumjs-util";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

const web3 = new Web3(new HttpProvider("http://127.0.0.1:8545"));

const META_STEALTH_REGISTRY_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const PRIVATE_KEY =
  "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6";
const PUBLIC_KEY = privateToPublic(toBuffer(PRIVATE_KEY));
const HASH_OF_SECRET =
  "0x2D2EDD9BFE1CC6A328E52CC8989C4F27955F68B9BB0EC136D45100CE9C6C61F4"; // secret is 0xb7cf302145348387b9e69fde82d8e634a0f87

interface MetaStealthAddress {
  pubKey: Uint8Array; // Represents bytes in TypeScript
  h: string; // Assuming bytes32 is a 32-byte hex representation
  signature: Uint8Array;
}

const metaStealthRegistryABI = [
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

const metaStealthRegistry = new web3.eth.Contract(
  metaStealthRegistryABI,
  META_STEALTH_REGISTRY_ADDRESS,
);

const dataToSign = web3.utils.keccak256(
  web3.utils.encodePacked(
    { value: "0x" + PUBLIC_KEY.toString("hex"), type: "bytes" },
    { value: HASH_OF_SECRET, type: "bytes32" },
  ),
);
const digest = web3.utils.keccak256(
  web3.utils.encodePacked(
    {
      value: "\x19Ethereum Signed Message:\n32",
      type: "string",
    },
    { value: dataToSign.slice(2), type: "bytes32" },
  ),
);

const rawSignature = secp256k1.sign(digest.slice(2), PRIVATE_KEY.slice(2));
const r = rawSignature.r.toString(16).padStart(64, "0");
const s = rawSignature.s.toString(16).padStart(64, "0");
const v = rawSignature.recovery! + 27;
const signature = web3.utils.encodePacked(
  { value: r, type: "bytes32" },
  { value: s, type: "bytes32" },
  { value: v, type: "uint8" },
);

const metaStealthAddress: MetaStealthAddress = {
  pubKey: PUBLIC_KEY,
  h: HASH_OF_SECRET,
  signature: Buffer.from(signature.slice(2), "hex"),
};
metaStealthRegistry.handleRevert = true;

const sender = web3.eth.accounts.wallet.add(PRIVATE_KEY).get(0);
const txReceipt = await metaStealthRegistry.methods
  .setMetaStealthAddress(metaStealthAddress)
  .send({ from: sender?.address, gas: "1000000", gasPrice: "10000000000" });

console.log(txReceipt);
