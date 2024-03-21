import { Component, For, Match, Show, Switch, createResource } from "solid-js";
import {
  web3,
  type StealthAddress,
  fetchBalance,
  fetchStealthAddresses,
  bobsPrimaryAccount,
  bobsSecondaryAccounts,
} from "../lib/provider";
import WalletHeader from "../components/WalletHeader";
import { formatWei, shortenAddress } from "../lib/format";
import WithdrawDialog from "../components/WithdrawDialog";

const BobsMainWallet: Component = () => {
  const [balance] = createResource(bobsPrimaryAccount, fetchBalance);
  const [stealthAddresses] = createResource(
    bobsPrimaryAccount,
    fetchStealthAddresses,
  );

  const stealthAddressesListItem = (address: StealthAddress) => {
    return (
      <div class="text-base grid grid-cols-6">
        <span class="col-span-2">{shortenAddress(address.address)}</span>
        <span class="text-right col-span-3">
          {formatWei(address.balance)} ETH
        </span>
        <Show when={address.balance !== 0n}>
          <WithdrawDialog
            from={address.address}
            amount={address.balance}
            withdrawalAccounts={bobsSecondaryAccounts}
            onWithdraw={(addr) => console.log("withdrawing to:", addr)}
          />
        </Show>
      </div>
    );
  };

  const stealthAddressesList = () => {
    return (
      <div class="rounded-lg my-2 bg-violet-100 w-full">
        <h1 class="text-lg p-2 rounded-t-lg bg-violet-300">
          Bob's Stealth Addresses
        </h1>
        <div class="space-y-2 p-2">
          <Switch fallback={<span>0.0 ETH</span>}>
            <Match when={stealthAddresses.loading}>
              <span>0.0 ETH</span>
            </Match>
            <Match when={stealthAddresses.error}>
              <span>-.- ETH</span>
            </Match>
            <Match when={stealthAddresses()}>
              {(addresses) => (
                <For each={addresses()}>{stealthAddressesListItem}</For>
              )}
            </Match>
          </Switch>
        </div>
      </div>
    );
  };

  return (
    <div class="p-2 w-full">
      <div class="max-w-xl mx-auto">
        <WalletHeader
          balance={balance}
          name="Bob's Primary Wallet"
          colorCls="bg-violet-300"
        />
        <div>{stealthAddressesList()}</div>
      </div>
    </div>
  );
};

const BobWallet: Component = () => {
  return (
    <div class="p-2 h-screen w-screen">
      <BobsMainWallet />
    </div>
  );
};

export default BobWallet;
