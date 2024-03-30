export const metaStealthRegistryABI = [
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
] as const;

export const ephemeralKeyRegistryAbi = [
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
