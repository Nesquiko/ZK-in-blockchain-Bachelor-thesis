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
