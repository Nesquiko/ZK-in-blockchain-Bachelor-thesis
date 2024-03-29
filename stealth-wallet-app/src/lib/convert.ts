import { web3 } from "./provider";

export function toWei(amount: string): bigint {
  if (amount === "") return 0n;
  try {
    return BigInt(web3.utils.toWei(amount, "ether"));
  } catch (e) {
    return 0n;
  }
}
