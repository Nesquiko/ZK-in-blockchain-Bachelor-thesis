import { privateToPublic } from "@ethereumjs/util";
import { expect, test } from "vitest";
import {
  dencryptEphemeralKey,
  encryptEphemeralKey,
  fromHexString,
  toHexString,
} from "../src/lib/crypto";

test("encrypt and then decrypt", async () => {
  const senderSecret = Buffer.from(
    "ef6c94d36a8662ca3058cb472afebc73f33a8746bc6fa0105392490ce94c54bb",
    "hex",
  );
  const futureWalletAddress =
    "9965507D1a55bcC2695C58ba16FB37d819B0A4dc".toLowerCase();
  const privateKey =
    "47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";
  const publicKey = toHexString(privateToPublic(fromHexString(privateKey)));
  const ek = await encryptEphemeralKey(
    senderSecret,
    futureWalletAddress,
    publicKey,
  );

  const decrypted = await dencryptEphemeralKey(
    ek,
    Buffer.from(privateKey, "hex"),
  );

  expect(decrypted.walletAddress).toBe(futureWalletAddress);
  expect(decrypted.senderSecret.toString("hex")).toBe(
    senderSecret.toString("hex"),
  );
});

test("try to decrypt with different private key", async () => {
  const senderSecret = Buffer.from(
    "ef6c94d36a8662ca3058cb472afebc73f33a8746bc6fa0105392490ce94c54bb",
    "hex",
  );
  const futureWalletAddress =
    "9965507D1a55bcC2695C58ba16FB37d819B0A4dc".toLowerCase();
  const privateKey =
    "47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";
  const publicKey = toHexString(privateToPublic(fromHexString(privateKey)));
  const ek = await encryptEphemeralKey(
    senderSecret,
    futureWalletAddress,
    publicKey,
  );

  const differentPrivateKey =
    "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
  expect(
    async () =>
      await dencryptEphemeralKey(ek, Buffer.from(differentPrivateKey, "hex")),
  ).rejects.toThrowError("Bad MAC");
});
