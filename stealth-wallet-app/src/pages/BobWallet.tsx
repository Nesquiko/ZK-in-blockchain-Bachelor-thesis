import { Component, For, Match, Show, Switch, createResource } from "solid-js";
import {
  type StealthAddress,
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

const BobsMainWallet: Component = () => {
  const [balance] = createResource(bobsPrimaryAccount, fetchBalance);
  const [metaStealthAddress] = createResource(
    bobsPrimaryAccount.address,
    fetchMetaStealthAddres,
  );
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
      <div class="p-2">
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
            <div class="rounded-b-lg bg-violet-100 w-full">
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
          </Match>
        </Switch>
      </div>
    );
  };

  return (
    <div class="p-2 w-full">
      <div class="max-w-xl mx-auto">
        <WalletHeader
          balance={balance}
          address={bobsPrimaryAccount.address}
          name="Bob's Primary Wallet"
          colorCls="bg-violet-300"
        />
        {stealthAddressesList()}
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
