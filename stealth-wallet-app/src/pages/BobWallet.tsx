import { Component, For, Match, Show, Switch, createResource } from "solid-js";
import {
  type StealthWallet,
  fetchBalance,
  fetchStealthAddresses,
  bobsPrimaryAccount,
  bobsSecondaryAccounts,
  fetchMetaStealthAddres,
} from "../lib/provider";
import WalletHeader from "../components/WalletHeader";
import { formatWei, shortenAddress } from "../lib/format";
import WithdrawDialog from "../components/WithdrawDialog";
import { Callout, CalloutTitle } from "../components/ui/callout";
import Spinner from "../components/ui/Spinner";
import { Web3BaseWalletAccount } from "web3";

const BobsWallet: Component = () => {
  const [balance] = createResource(bobsPrimaryAccount, fetchBalance);
  const [otherBalances] = createResource(
    bobsSecondaryAccounts,
    async (wallets: Web3BaseWalletAccount[]) => {
      const balances = new Array<bigint>();
      for (const wallet of wallets) {
        balances.push(await fetchBalance(wallet));
      }
      return balances;
    },
  );
  const [metaStealthAddress] = createResource(
    bobsPrimaryAccount.address,
    fetchMetaStealthAddres,
  );
  const [stealthAddresses] = createResource(
    bobsPrimaryAccount,
    fetchStealthAddresses,
  );

  const stealthAddressesListItem = (address: StealthWallet) => {
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
            onWithdraw={(addr) => console.log("TODO", addr)}
          />
        </Show>
      </div>
    );
  };

  const stealthAddressesList = () => {
    return (
      <div class="shadow shadow-gray-300 rounded-lg">
        <Switch
          fallback={
            <Callout variant="warning">
              <CalloutTitle>No meta stealth address</CalloutTitle>
            </Callout>
          }
        >
          <Match when={metaStealthAddress.loading}>
            <Callout>
              <CalloutTitle>Fetching meta stealth address</CalloutTitle>
            </Callout>
          </Match>
          <Match when={metaStealthAddress.error}>
            <Callout variant="error">
              <CalloutTitle>
                Error while fetching meta stealth address
              </CalloutTitle>
            </Callout>
          </Match>
          <Match
            when={
              metaStealthAddress() !== undefined &&
              metaStealthAddress()?.pubKey !== "0x"
            }
          >
            <h1 class="text-lg p-2 rounded-t-lg bg-violet-300">
              Bob's Meta Stealth Addresses
            </h1>
            <div class="rounded-b-lg bg-violet-100 w-full min-h-20 space-y-2 p-2">
              <Switch>
                <Match when={stealthAddresses.loading}>
                  <Spinner remSize={4} colorCls="fill-violet-500" />
                </Match>
                <Match when={stealthAddresses.error}>
                  <Callout variant="error">
                    <CalloutTitle>
                      Error while fetching stealth addresses
                    </CalloutTitle>
                  </Callout>
                </Match>
                <Match
                  when={stealthAddresses() && stealthAddresses()?.length === 0}
                >
                  <p class="text-lg text-center">
                    No stealth addresses with balance
                  </p>
                </Match>
                <Match when={stealthAddresses()}>
                  {(addresses) => (
                    <For each={addresses()}>{stealthAddressesListItem}</For>
                  )}
                </Match>
              </Switch>
            </div>
          </Match>
        </Switch>
      </div>
    );
  };

  const bobsOtherWallets = () => {
    return (
      <div class="shadow shadow-gray-300 rounded-lg">
        <h1 class="text-lg p-2 rounded-t-lg bg-violet-400">
          Bob's other wallets
        </h1>
        <div class="rounded-b-lg bg-violet-200 w-full min-h-20 space-y-2 p-2">
          <For each={bobsSecondaryAccounts}>
            {(wallet, i) => (
              <div class="text-base flex justify-between">
                <span class="col-span-2">{shortenAddress(wallet.address)}</span>
                {!otherBalances.loading &&
                  !otherBalances.error &&
                  otherBalances() && (
                    <span class="text-right col-span-3">
                      {formatWei(otherBalances()![i()])} ETH
                    </span>
                  )}
              </div>
            )}
          </For>
        </div>
      </div>
    );
  };

  return (
    <div class="p-2 w-full">
      <div class="max-w-xl mx-auto space-y-2">
        <WalletHeader
          balance={balance}
          address={bobsPrimaryAccount.address}
          name="Bob's Primary Wallet"
          colorCls="bg-violet-400"
        />
        {bobsOtherWallets()}
        {stealthAddressesList()}
      </div>
    </div>
  );
};

export default BobsWallet;
