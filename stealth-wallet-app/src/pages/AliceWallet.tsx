import {
  Component,
  Match,
  Show,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import WalletHeader from "../components/WalletHeader";
import {
  MetaStealthAddress,
  aliceAccount,
  fetchBalance,
  fetchMetaStealthAddres,
  sendToNewStealthWallet,
} from "../lib/provider";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Callout,
  CalloutContent,
  CalloutTitle,
} from "../components/ui/callout";
import { toWei } from "../lib/convert";
import { isValidAddress } from "../lib/validation";
import { showToast } from "../components/ui/toast";
import { shortenAddress } from "../lib/format";

const ErrorMetaAddressNotFound = new Error("meta stealth address not found");

const AliceWallet: Component = () => {
  const [balance, { refetch }] = createResource(aliceAccount, fetchBalance);
  const [recipient, setRecipient] = createSignal<string | undefined>(undefined);
  const [recipientMetaAddress, setRecipientMetaAddress] = createSignal<
    MetaStealthAddress | undefined
  >(undefined);
  const [fetchError, setFetchError] = createSignal<
    "not found" | "different" | undefined
  >(undefined);
  const [ethAmount, setEthAmount] = createSignal<string | undefined>(undefined);
  const [loading, setLoading] = createSignal(false);

  const fetchRecipientsMetaStealthAddres = async (address: string) => {
    setLoading(true);
    await fetchMetaStealthAddres(address)
      .then((metaAddr) => {
        if (metaAddr.pubKey === "0x") {
          return Promise.reject(ErrorMetaAddressNotFound);
        }
        setFetchError(undefined);
        return setRecipientMetaAddress(metaAddr);
      })
      .catch((err) => {
        setRecipientMetaAddress(undefined);
        if (err === ErrorMetaAddressNotFound) {
          setFetchError("not found");
        } else {
          setFetchError("different");
        }
      });
    setLoading(false);
  };

  const onSend = async (
    ethAmount: string | undefined,
    metaAddr: MetaStealthAddress,
  ) => {
    const weiAmount = toWei(ethAmount);
    if (weiAmount === 0n) {
      return;
    }
    setLoading(true);
    await sendToNewStealthWallet(aliceAccount, weiAmount, metaAddr);
    refetch();
    const title = "Transaction successful!";
    const description = `Stealth transfer of ${ethAmount} ETH to ${shortenAddress(recipient())} was successful!`;
    setEthAmount(undefined);
    setRecipient(undefined);
    setRecipientMetaAddress(undefined);
    setLoading(false);
    showToast({
      title,
      description,
      icon: <i class="fa-solid fa-circle-check fa-lg text-emerald-500"></i>,
      duration: 4000,
    });
  };

  const findRecipientMetaAddressForm = () => {
    return (
      <div class="py-4 space-y-2 w-full">
        <Label class="text-lg w-60" for="recipient">
          Recipient's address
        </Label>
        <div class="md:flex gap-4 space-y-2 md:space-y-0">
          <Input
            class="text-lg"
            maxLength={42}
            id="recipient"
            placeholder="0x1234..."
            value={recipient() ? recipient() : ""}
            onInput={(e) => setRecipient(e.target.value)}
          />
          <Button
            class="text-lg w-20 bg-emerald-500 hover:bg-emerald-700/90"
            loading={loading()}
            disabled={!isValidAddress(recipient())}
            onClick={() => {
              if (recipient() === undefined) {
                return;
              }
              fetchRecipientsMetaStealthAddres(recipient()!);
            }}
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </Button>
        </div>
        <Switch>
          <Match when={fetchError() === "not found"}>
            <Callout variant="warning">
              <CalloutTitle>No meta stealth address</CalloutTitle>
              <CalloutContent>
                Entered address doesn't have a meta steatlth address
              </CalloutContent>
            </Callout>
          </Match>

          <Match when={fetchError() === "different"}>
            <Callout variant="error">
              <CalloutTitle>
                Error while fetching meta stealth address
              </CalloutTitle>
            </Callout>
          </Match>
        </Switch>
      </div>
    );
  };

  const sentEthForm = (metaAddr: MetaStealthAddress) => {
    return (
      <div class="space-y-2">
        <Label class="text-lg w-60" for="amount">
          Amount to send
        </Label>
        <Input
          id="amount"
          class="text-lg"
          type="number"
          inputmode="numeric"
          placeholder="0.01 ether"
          value={ethAmount() ? ethAmount() : ""}
          onInput={(e) => setEthAmount(e.target.value)}
        />
        <Button
          class="text-xl w-full bg-emerald-500 hover:bg-emerald-700/90"
          onClick={() => onSend(ethAmount(), metaAddr)}
          loading={loading()}
          disabled={!ethAmount()}
        >
          Send
        </Button>
      </div>
    );
  };

  return (
    <div class="p-2 w-full">
      <div class="max-w-xl mx-auto">
        <WalletHeader
          balance={balance}
          address={aliceAccount.address}
          name="Alice's Wallet"
          colorCls="bg-green-300"
        />
        {findRecipientMetaAddressForm()}

        <Show when={recipientMetaAddress()} keyed>
          {sentEthForm}
        </Show>
      </div>
    </div>
  );
};

export default AliceWallet;
