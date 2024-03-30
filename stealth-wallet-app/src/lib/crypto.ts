import * as eccrypto from "eccrypto";
import { stripOx } from "./convert";

interface EncryptedEphemeralKey {
  iv: Buffer;
  ephemPublicKey1: Buffer;
  ephemPublicKey2: Buffer;
  ephemPublicKey3: Buffer;
  mac: Buffer;
  ciphertext1: Buffer;
  ciphertext2: Buffer;
}

export async function encryptEphemeralKey(
  senderSecret: Buffer,
  walletAddress: string,
  pubKey: string,
): Promise<EncryptedEphemeralKey> {
  pubKey = stripOx(pubKey);
  walletAddress = stripOx(walletAddress);

  const pk = Buffer.from("04" + pubKey, "hex");
  const ek = Buffer.concat([senderSecret, Buffer.from(walletAddress, "hex")]);
  const encrypted = await eccrypto.encrypt(pk, ek);

  return toEncryptedEphemeralKey(encrypted);
}

interface DencryptedEphemeralKey {
  senderSecret: Buffer;
  walletAddress: string;
}

export async function dencryptEphemeralKey(
  ek: EncryptedEphemeralKey,
  privateKey: Buffer,
): Promise<DencryptedEphemeralKey> {
  const decrypted = await eccrypto.decrypt(privateKey, toEcies(ek));
  return {
    senderSecret: decrypted.subarray(0, 32),
    walletAddress: decrypted.subarray(32).toString("hex"),
  };
}

function toEncryptedEphemeralKey(
  encrypted: eccrypto.Ecies,
): EncryptedEphemeralKey {
  return {
    iv: encrypted.iv, // 16 bytes
    ephemPublicKey1: encrypted.ephemPublicKey.subarray(0, 1), // 1 byte
    ephemPublicKey2: encrypted.ephemPublicKey.subarray(1, 32), // 32 bytes
    ephemPublicKey3: encrypted.ephemPublicKey.subarray(32), // 32 bytes
    mac: encrypted.mac, // 32 bytes
    // senderSecret has 32 bytes and walletAddress has 20 bytes,
    // so the length of the ciphertext will not change, because the length
    // of the encrypted data has constant size
    ciphertext1: encrypted.ciphertext.subarray(0, 32), // 32 bytes
    ciphertext2: encrypted.ciphertext.subarray(32), // 32 bytes
  };
}

function toEcies(encrypted: EncryptedEphemeralKey): eccrypto.Ecies {
  return {
    iv: encrypted.iv,
    ephemPublicKey: Buffer.concat([
      encrypted.ephemPublicKey1,
      encrypted.ephemPublicKey2,
      encrypted.ephemPublicKey3,
    ]),
    mac: encrypted.mac,
    ciphertext: Buffer.concat([encrypted.ciphertext1, encrypted.ciphertext2]),
  };
}

export function fromHexString(hexString: string) {
  return Uint8Array.from(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
}

export function toHexString(bytes: Uint8Array) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}
