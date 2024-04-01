export const metaStealthRegistryABI = [
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
            name: "secretHash",
            type: "bytes32",
            internalType: "bytes32",
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
            name: "secretHash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "signature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "ECDSAInvalidSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureLength",
    inputs: [
      {
        name: "length",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureS",
    inputs: [
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
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
] as const;

export const ephemeralKeyRegistryABI = [
  {
    type: "function",
    name: "getKeysBatch",
    inputs: [
      {
        name: "from",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "size",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct EphemeralKeyRegistry.EphemeralKey[]",
        components: [
          {
            name: "iv",
            type: "bytes16",
            internalType: "bytes16",
          },
          {
            name: "ephemPublicKey1",
            type: "bytes1",
            internalType: "bytes1",
          },
          {
            name: "ephemPublicKey2",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ephemPublicKey3",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "mac",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ciphertext1",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ciphertext2",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
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
    name: "submit",
    inputs: [
      {
        name: "key",
        type: "tuple",
        internalType: "struct EphemeralKeyRegistry.EphemeralKey",
        components: [
          {
            name: "iv",
            type: "bytes16",
            internalType: "bytes16",
          },
          {
            name: "ephemPublicKey1",
            type: "bytes1",
            internalType: "bytes1",
          },
          {
            name: "ephemPublicKey2",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ephemPublicKey3",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "mac",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ciphertext1",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "ciphertext2",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalKeys",
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
    type: "error",
    name: "EphemeralKeyRegistry__OutOfRange",
    inputs: [],
  },
] as const;

export const stealthWalletABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_code",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "verifierAddr",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "fallback",
    stateMutability: "payable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "code",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifier",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract Groth16Verifier",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "proof",
        type: "tuple",
        internalType: "struct StealthWallet.OwnershipProof",
        components: [
          {
            name: "piA",
            type: "uint256[2]",
            internalType: "uint256[2]",
          },
          {
            name: "piB",
            type: "uint256[2][2]",
            internalType: "uint256[2][2]",
          },
          {
            name: "piC",
            type: "uint256[2]",
            internalType: "uint256[2]",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "StealthWallet__AmountExceedsBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "StealthWallet__InvalidProof",
    inputs: [],
  },
  {
    type: "error",
    name: "StealthWallet__WithdrawFailed",
    inputs: [],
  },
] as const;
