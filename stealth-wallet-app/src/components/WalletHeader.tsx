import { Component, Match, Resource, Switch, createSignal } from "solid-js";
import { formatWei, shortenAddress } from "../lib/format";

interface WalletHeaderProps {
  name: string;
  address: string;
  balance: Resource<bigint>;
  colorCls: string;
}

const WalletHeader: Component<WalletHeaderProps> = (props) => {
  let copiedTimeout: NodeJS.Timeout | null = null;
  const [copied, setCopied] = createSignal(false);
  return (
    <div class="flex justify-between text-xl">
      <h2
        classList={{ [props.colorCls]: true }}
        class="rounded-full px-4 py-2 shadow shadow-gray-300"
      >
        <p class="text-black">{props.name}</p>
        <p class="text-sm text-center text-gray-700 select-none">
          {shortenAddress(props.address)}
          <i
            classList={{
              "fa-copy": !copied(),
              "fa-check text-lime-600": copied(),
            }}
            class="px-2 fa-solid fa-sm cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(props.address);
              setCopied(true);
              if (!copiedTimeout) {
                copiedTimeout = setTimeout(() => {
                  setCopied(false);
                  copiedTimeout = null;
                }, 2000);
              }
            }}
          ></i>
        </p>
      </h2>

      <div class="flex items-center justify-center">
        <p class="rounded-full px-4 py-2 bg-gray-300 shadow shadow-gray-300">
          <Switch fallback={"0.0 ETH"}>
            <Match when={props.balance.loading}>{"0.0 ETH"}</Match>
            <Match when={props.balance.error}>{"-.- ETH"}</Match>
            <Match when={props.balance()}>
              {(balance) => `${formatWei(balance())} ETH`}
            </Match>
          </Switch>
        </p>
      </div>
    </div>
  );
};

export default WalletHeader;
