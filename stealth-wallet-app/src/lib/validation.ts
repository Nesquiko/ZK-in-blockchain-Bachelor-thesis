import { isAddress } from "web3-validator";

export function isValidAddress(address?: string): boolean {
  if (!address) return false;
  return isAddress(address);
}
