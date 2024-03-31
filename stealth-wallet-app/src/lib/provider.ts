import {
  HttpProvider,
  MatchPrimitiveType,
  Web3,
  Web3BaseWalletAccount,
} from "web3";
import {
  ephemeralKeyRegistryABI,
  metaStealthRegistryABI,
  stealthWalletABI,
} from "./contract-abis";
import { poseidon } from "./poseidon/poseidon";
import { getRandomBytesSync } from "ethereum-cryptography/random.js";
import {
  DencryptedEphemeralKey,
  EncryptedEphemeralKey,
  dencryptEphemeralKey,
  encryptEphemeralKey,
} from "./crypto";
import { getContractAddress } from "@ethersproject/address";
import {
  SerializedStealthWallet,
  readLasEphemeralKeyIndex,
  readStealthWallets,
  saveLastEphemeralKeyIndex,
  saveStealthWallets,
} from "./local-storage";
import { strip0x } from "./convert";
import { OwnershipProof, calculateProof } from "./prover";

const verifierAddress = import.meta.env.PROD
  ? "" // TODO address on sepolia
  : "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // address on local anvil

const metaStealthRegistryAddress = import.meta.env.PROD
  ? "" // TODO address on sepolia
  : "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // address on local anvil

const ephemeralKeyRegistryAddress = import.meta.env.PROD
  ? "" // TODO address on sepolia
  : "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // address on local anvil

export const web3 = import.meta.env.PROD
  ? new Web3(import.meta.env.VITE_SEPOLIA_RPC)
  : new Web3(new HttpProvider("http://127.0.0.1:8545"));

export const metaStealthRegistry = new web3.eth.Contract(
  metaStealthRegistryABI,
  metaStealthRegistryAddress,
);

export const ephemeralKeyRegistry = new web3.eth.Contract(
  ephemeralKeyRegistryABI,
  ephemeralKeyRegistryAddress,
);

export const BOBS_SECRET = 10n; // hash = 0x2778f900758cc46e051040641348de3dacc6d2a31e2963f22cbbfb8f65464241

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

export interface StealthWallet {
  address: string;
  balance: bigint;
  senderSecret: bigint;
}

export async function fetchBalance(
  account: Web3BaseWalletAccount,
): Promise<bigint> {
  return addressBalance(account.address);
}

async function addressBalance(address: string) {
  return await web3.eth.getBalance(address);
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

export async function sendToNewStealthWallet(
  deployer: Web3BaseWalletAccount,
  amount: bigint,
  metaAddress: MetaStealthAddress,
): Promise<void> {
  const senderSecret = Buffer.from(getRandomBytesSync(32));
  const futureWalletAddress = await contractDeploymentAddress(deployer);
  const ek = await encryptEphemeralKey(
    senderSecret,
    futureWalletAddress,
    metaAddress.pubKey.toString(),
  );

  const code =
    "0x" +
    poseidon([
      BigInt(metaAddress.h.toString()),
      BigInt("0x" + senderSecret.toString("hex")),
    ])
      .toString(16)
      .padStart(64, "0");

  await deployStealthWallet(deployer, code, amount);
  await submitEphemeralKey(deployer, ek);
}

async function deployStealthWallet(
  deployer: Web3BaseWalletAccount,
  code: string,
  amount: bigint,
): Promise<void> {
  const contract = await (await fetch("/StealthWallet.json")).json();
  const newStealthWallet = new web3.eth.Contract(contract.abi);
  const contractDeployer = newStealthWallet.deploy({
    data: contract.bytecode.object,
    arguments: [code, verifierAddress],
  });
  const gas = await contractDeployer.estimateGas({
    from: deployer.address,
  });
  const gasPrice = await web3.eth.getGasPrice();

  await contractDeployer.send({
    from: deployer.address,
    value: amount.toString(),
    gas: gas.toString(),
    gasPrice: gasPrice.toString(),
  });
}

async function submitEphemeralKey(
  deployer: Web3BaseWalletAccount,
  ek: EncryptedEphemeralKey,
): Promise<void> {
  const submit = ephemeralKeyRegistry.methods.submit(ek);
  const gas = await submit.estimateGas({
    from: deployer.address,
    data: submit.encodeABI(),
  });

  const gasPrice = await web3.eth.getGasPrice();
  await submit.send({
    from: deployer.address,
    gas: gas.toString(),
    gasPrice: gasPrice.toString(),
  });
}

function readSavedStealthWallets(): StealthWallet[] {
  const wallets = readStealthWallets();
  return wallets.map((addr) => {
    return {
      address: addr.address,
      senderSecret: BigInt(addr.senderSecret),
      balance: BigInt(addr.balance),
    };
  });
}

export function updateSavedStealthWallets(wallets: StealthWallet[]) {
  const serialized: SerializedStealthWallet[] = wallets.map((w) => {
    return {
      address: w.address,
      senderSecret: w.senderSecret.toString(10),
      balance: w.balance.toString(10),
    };
  });
  saveStealthWallets(serialized);
}

const BATCH_SIZE = 20n;
export async function fetchStealthWallets(
  account: Web3BaseWalletAccount,
): Promise<StealthWallet[]> {
  let lastIndex = readLasEphemeralKeyIndex();
  const totalKeys = await ephemeralKeyRegistry.methods
    .totalKeys()
    .call({ from: account.address });

  let total = BigInt(totalKeys.toString());
  const newWallets = readSavedStealthWallets();
  while (lastIndex < total) {
    const eks = await ephemeralKeyRegistry.methods
      .getKeysBatch(lastIndex, BATCH_SIZE)
      .call({ from: account.address });
    total = BigInt(eks[1].toString());

    const decrypted = await filterAccountsAddresses(account, eks[0]);
    for (const dec of decrypted) {
      const wallet = await convertDecryptedEphemeralKey(dec);
      if (wallet.balance === 0n) continue;
      newWallets.push(wallet);
    }
    lastIndex += BATCH_SIZE;
  }
  newWallets.sort((a, b) => Number(b.balance - a.balance));

  saveLastEphemeralKeyIndex(total);
  updateSavedStealthWallets(newWallets);

  return newWallets;
}

interface Web3jsEphemeralKey {
  iv: MatchPrimitiveType<"bytes16", unknown>;
  ephemPublicKey1: MatchPrimitiveType<"bytes1", unknown>;
  ephemPublicKey2: MatchPrimitiveType<"bytes32", unknown>;
  ephemPublicKey3: MatchPrimitiveType<"bytes32", unknown>;
  mac: MatchPrimitiveType<"bytes32", unknown>;
  ciphertext1: MatchPrimitiveType<"bytes32", unknown>;
  ciphertext2: MatchPrimitiveType<"bytes32", unknown>;
}

async function filterAccountsAddresses(
  account: Web3BaseWalletAccount,
  eks: Web3jsEphemeralKey[],
): Promise<DencryptedEphemeralKey[]> {
  const ret = new Array<DencryptedEphemeralKey>();

  for (const web3Ek of eks) {
    try {
      const ek = convertEphemeralKey(web3Ek);
      const decrypted = await dencryptEphemeralKey(
        ek,
        Buffer.from(strip0x(account.privateKey), "hex"),
      );
      ret.push(decrypted);
    } catch (e) {}
  }

  return ret;
}

async function contractDeploymentAddress(
  deployer: Web3BaseWalletAccount,
): Promise<string> {
  const nonce = await web3.eth.getTransactionCount(deployer.address);
  const futureAddress = getContractAddress({
    from: deployer.address,
    nonce: nonce,
  });
  return futureAddress;
}

function convertEphemeralKey(ek: Web3jsEphemeralKey): EncryptedEphemeralKey {
  return {
    iv: Buffer.from(strip0x(ek.iv.toString()), "hex"),
    ephemPublicKey1: Buffer.from(strip0x(ek.ephemPublicKey1.toString()), "hex"),
    ephemPublicKey2: Buffer.from(strip0x(ek.ephemPublicKey2.toString()), "hex"),
    ephemPublicKey3: Buffer.from(strip0x(ek.ephemPublicKey3.toString()), "hex"),
    mac: Buffer.from(strip0x(ek.mac.toString()), "hex"),
    ciphertext1: Buffer.from(strip0x(ek.ciphertext1.toString()), "hex"),
    ciphertext2: Buffer.from(strip0x(ek.ciphertext2.toString()), "hex"),
  };
}

async function convertDecryptedEphemeralKey(
  ek: DencryptedEphemeralKey,
): Promise<StealthWallet> {
  const balance = await addressBalance(ek.walletAddress);
  return {
    address: "0x" + ek.walletAddress,
    balance,
    senderSecret: ek.senderSecret,
  };
}

export async function withdraw(
  withdrawee: Web3BaseWalletAccount,
  wallet: StealthWallet,
  ownersSecret: bigint,
) {
  const walletContract = new web3.eth.Contract(
    stealthWalletABI,
    wallet.address,
  );
  const code = BigInt((await walletContract.methods.code().call()).toString());
  const proof = await calculateProof(ownersSecret, wallet.senderSecret, code);
  const balance = await addressBalance(wallet.address);
  const signature = await signProof(proof, withdrawee);

  const withdraw = walletContract.methods.withdraw(
    withdrawee.address,
    balance,
    proof,
    signature,
  );

  const gas = await withdraw.estimateGas({
    from: withdrawee.address,
  });
  const gasPrice = await web3.eth.getGasPrice();

  await withdraw.send({
    from: withdrawee.address,
    gas: gas.toString(),
    gasPrice: gasPrice.toString(),
  });
}

async function signProof(
  proof: OwnershipProof,
  signer: Web3BaseWalletAccount,
): Promise<string> {
  const hashed = web3.utils.keccak256(
    web3.utils.encodePacked(
      { value: proof.piA, type: "uint256[2]" },
      { value: proof.piB[0], type: "uint256[2]" },
      { value: proof.piB[1], type: "uint256[2]" },
      { value: proof.piC, type: "uint256[2]" },
      { value: proof.pubSignals, type: "uint256[1]" },
    ),
  );
  const signature = signer.sign(hashed);
  return signature.signature;
}
