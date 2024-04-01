import Web3, { HttpProvider } from "web3";
import { metaStealthRegistryABI } from "../src/lib/contract-abis";
import { privateToPublic } from "@ethereumjs/util";
import { BOBS_SECRET, bobsPrimaryAccount } from "../src/lib/provider";
import { strip0x } from "../src/lib/convert";
import { poseidon } from "../src/lib/poseidon/poseidon";

const web3 = new Web3(new HttpProvider("http://127.0.0.1:8545"));
web3.transactionPollingInterval = 5000;
web3.transactionReceiptPollingInterval = 5000;
web3.transactionConfirmationPollingInterval = 5000;

const META_STEALTH_REGISTRY_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const secret = BOBS_SECRET;

const account = bobsPrimaryAccount;
web3.eth.accounts.wallet.add(account);
const privateKey = account.privateKey;
const publicKey = privateToPublic(Buffer.from(strip0x(privateKey), "hex"));
const hashOfSecret = "0x" + poseidon([secret]).toString(16);

interface MetaStealthAddress {
  pubKey: Uint8Array;
  secretHash: string;
}

const metaStealthRegistry = new web3.eth.Contract(
  metaStealthRegistryABI,
  META_STEALTH_REGISTRY_ADDRESS,
);

const dataToSign = web3.utils.keccak256(
  web3.utils.encodePacked(
    { value: "0x" + Buffer.from(publicKey).toString("hex"), type: "bytes" },
    { value: hashOfSecret, type: "bytes32" },
  ),
);
const signature = account.sign(dataToSign);

const metaStealthAddress: MetaStealthAddress = {
  pubKey: publicKey,
  secretHash: hashOfSecret,
};

const txReceipt = await metaStealthRegistry.methods
  .setMetaStealthAddress(metaStealthAddress, signature.signature)
  .send({ from: account.address, gas: "1000000", gasPrice: "10000000000" });

console.log(txReceipt);
