import { web3 } from "./provider";

export function toWei(amount?: string): bigint {
  if (!amount || amount === "") return 0n;
  try {
    return BigInt(web3.utils.toWei(amount, "ether"));
  } catch (e) {
    return 0n;
  }
}

export function strip0x(s: string) {
  if (s.startsWith("0x")) return s.slice(2);
  return s;
}
