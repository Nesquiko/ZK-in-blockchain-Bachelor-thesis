export function shortenAddress(address: string): string {
  if (!address.startsWith("0x")) {
    return address;
  }

  const startPortion = address.slice(0, 6);
  const endPortion = address.slice(-4);

  return `${startPortion}...${endPortion}`;
}
