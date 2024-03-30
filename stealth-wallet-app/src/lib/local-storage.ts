const LAST_EPHEMERAL_KEY_INDEX_KEY = "last-ephemeral-key-index";

export function saveLastEphemeralKeyIndex(i: bigint): void {
  localStorage.setItem(LAST_EPHEMERAL_KEY_INDEX_KEY, i.toString(10));
}

export function readLasEphemeralKeyIndex(): bigint {
  const i = localStorage.getItem(LAST_EPHEMERAL_KEY_INDEX_KEY);
  if (!i) {
    return 0n;
  }

  try {
    return BigInt(i);
  } catch (e) {
    return 0n;
  }
}

const STEALT_WALLETS_KEY = "stealth-wallets";

export interface SerializedStealthWallet {
  address: string;
  senderSecret: string;
  balance: string;
}

export function saveStealthWallets(wallets: SerializedStealthWallet[]): void {
  const serialized = JSON.stringify(wallets);
  localStorage.setItem(STEALT_WALLETS_KEY, serialized);
}

export function readStealthWallets(): SerializedStealthWallet[] {
  const serialized = localStorage.getItem(STEALT_WALLETS_KEY);
  if (!serialized) {
    return [];
  }

  try {
    return JSON.parse(serialized);
  } catch (e) {
    return [];
  }
}
