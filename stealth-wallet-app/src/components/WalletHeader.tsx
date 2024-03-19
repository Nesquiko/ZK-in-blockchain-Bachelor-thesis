import { Component, Match, Resource, Switch } from "solid-js";
import web3 from "../lib/provider";

interface WalletHeaderProps {
  name: string;
  balance: Resource<bigint>;
  colorCls: string;
}

const WalletHeader: Component<WalletHeaderProps> = (props) => {
  return (
    <div class="flex justify-between text-xl">
      <h2 classList={{ [props.colorCls]: true }} class="rounded-full px-4 py-2">
        {props.name}
      </h2>
      <h2 class="rounded-full px-4 py-2 bg-gray-300">
        <Switch fallback={<span>0.0 ETH</span>}>
          <Match when={props.balance.loading}>
            <span>0.0 ETH</span>
          </Match>
          <Match when={props.balance.error}>
            <span>-.- ETH</span>
          </Match>
          <Match when={props.balance()}>
            {(balance) => (
              <span>{web3.utils.fromWei(balance(), "ether")} ETH</span>
            )}
          </Match>
        </Switch>
      </h2>
    </div>
  );
};

export default WalletHeader;
