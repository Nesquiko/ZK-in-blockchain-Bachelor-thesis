import * as eccrypto from "eccrypto";

export async function encrypt(
  senderSecret: Buffer,
  pubKey: string,
): Promise<string> {
  const pk = Buffer.from("04" + pubKey.slice(2), "hex");
  const encrypted = await eccrypto.encrypt(pk, senderSecret);

  console.log(encrypted);
  const compressed = Buffer.concat([
    encrypted.iv, // 16 bytes
    encrypted.ephemPublicKey, // 65 bytes
    encrypted.mac, // 32 bytes
    encrypted.ciphertext, // variable
  ]);

  return "0x" + compressed.toString("hex");
}
