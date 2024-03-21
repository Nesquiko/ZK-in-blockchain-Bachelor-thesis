import { web3 } from "./provider";

export function shortenAddress(address: string): string {
  if (!address.startsWith("0x")) {
    return address;
  }

  const startPortion = address.slice(0, 6);
  const endPortion = address.slice(-4);

  return `${startPortion}...${endPortion}`;
}

export function formatWei(amount: bigint): string {
  if (amount === 0n) return "0";
  return web3.utils.fromWei(amount, "ether").slice(0, 6);
}
