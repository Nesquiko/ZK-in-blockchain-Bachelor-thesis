import { Component, For, Match, Switch, createResource } from "solid-js";
import web3, {
  type StealthAddress,
  fetchBalance,
  fetchStealthAddresses,
} from "../lib/provider";
import WalletHeader from "../components/WalletHeader";
import { shortenAddress } from "../lib/format";

const BobsMainWallet: Component = () => {
  const account = web3.eth.accounts.privateKeyToAccount(
    import.meta.env.VITE_BOB_PK,
  );
  const [balance] = createResource(account, fetchBalance);
  const [stealthAddresses] = createResource(account, fetchStealthAddresses);

  const stealthAddressesListItem = (address: StealthAddress) => {
    return (
      <div class="flex justify-between text-base gap-8">
        <span>{shortenAddress(address.address)}</span>
        <span>{web3.utils.fromWei(address.balance, "ether")} ETH</span>
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

// TODO withdraw from into the second pk
const BobWallet: Component = () => {
  return (
    <div class="p-2 h-screen w-screen">
      <div class="h-full">
        <BobsMainWallet />
      </div>
    </div>
  );
};

export default BobWallet;
