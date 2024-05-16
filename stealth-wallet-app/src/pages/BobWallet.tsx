import { Component, For, Match, Show, Switch, createResource } from "solid-js";
import {
  type StealthWallet,
  fetchBalance,
  fetchStealthWallets,
  bobsPrimaryAccount,
  bobsSecondaryAccounts,
  fetchMetaStealthAddres,
  withdraw,
  BOBS_SECRET,
  updateSavedStealthWallets,
} from "../lib/provider";
import WalletHeader from "../components/WalletHeader";
import { formatWei, shortenAddress } from "../lib/format";
import WithdrawDialog from "../components/WithdrawDialog";
import { Callout, CalloutTitle } from "../components/ui/callout";
import Spinner from "../components/ui/Spinner";
import { Web3BaseWalletAccount } from "web3";
import { showToast } from "../components/ui/toast";

const BobsWallet: Component = () => {
  const [balance] = createResource(bobsPrimaryAccount, fetchBalance);
  const [otherBalances, { refetch: refetchBalances }] = createResource(
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
  const [
    stealthWallets,
    { mutate: mutateStealthWallets, refetch: refetchStealthWallets },
  ] = createResource(bobsPrimaryAccount, fetchStealthWallets);

  async function withdrawFromStealthWallet(
    walletAddr: string,
    stealthWallet: StealthWallet,
  ): Promise<void> {
    const wallet = bobsSecondaryAccounts.find((w) => w.address === walletAddr);
    if (!wallet) return;

    let title = "Withdraw successful!";
    let description = `Withdrawal of ${formatWei(stealthWallet.balance)} ETH to ${shortenAddress(wallet.address)} was successful!`;
    let icon = <i class="fa-solid fa-circle-check fa-lg text-emerald-500"></i>;
    let variant: "default" | "destructive" = "default";
    try {
      await withdraw(wallet, stealthWallet, BOBS_SECRET);
    } catch (e) {
      console.error(e);
      title = "Withdrawal failed";
      description = "There was an error during the withdrawal process";
      icon = <i class="fa-solid fa-circle-xmark fa-lg text-white"></i>;
      variant = "destructive";
    }
    refetchBalances();

    showToast({
      title,
      description,
      icon,
      duration: 3000,
      variant,
    });

    const updatedStealthAddresses = stealthWallets()?.filter(
      (w) => w.address !== stealthWallet.address,
    );
    mutateStealthWallets(updatedStealthAddresses ?? []);
    updateSavedStealthWallets(stealthWallets()!);
  }

  const stealthAddressesListItem = (wallet: StealthWallet) => {
    return (
      <div class="text-base grid grid-cols-6">
        <span class="col-span-2">{shortenAddress(wallet.address)}</span>
        <span class="text-right col-span-3">
          {formatWei(wallet.balance)} ETH
        </span>
        <Show when={wallet.balance !== 0n}>
          <WithdrawDialog
            from={wallet.address}
            amount={wallet.balance}
            withdrawalAccounts={bobsSecondaryAccounts}
            onWithdraw={async (withdrawee) =>
              await withdrawFromStealthWallet(withdrawee, wallet)
            }
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
            <h1 class="text-lg p-2 rounded-t-lg bg-violet-300 flex justify-between items-center">
              <span>Bob's Stealth Addresses</span>
              <i
                class="fa-solid fa-rotate fa-lg cursor-pointer"
                onClick={refetchStealthWallets}
              />
            </h1>

            <div class="rounded-b-lg bg-violet-100 w-full min-h-20 space-y-2 p-2">
              <Switch>
                <Match when={stealthWallets.loading}>
                  <Spinner remSize={4} colorCls="fill-violet-500" />
                </Match>
                <Match when={stealthWallets.error}>
                  <Callout variant="error">
                    <CalloutTitle>
                      Error while fetching stealth addresses
                    </CalloutTitle>
                  </Callout>
                </Match>
                <Match
                  when={stealthWallets() && stealthWallets()?.length === 0}
                >
                  <p class="text-lg text-center">
                    No stealth addresses with balance
                  </p>
                </Match>
                <Match when={stealthWallets()}>
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
                <span
                  class="col-span-2 cursor-pointer hover:underline hover:text-violet-800"
                  onClick={() => navigator.clipboard.writeText(wallet.address)}
                >
                  {shortenAddress(wallet.address)}
                </span>
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
