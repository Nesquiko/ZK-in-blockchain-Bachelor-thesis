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
} from "../lib/provider";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Callout,
  CalloutContent,
  CalloutTitle,
} from "../components/ui/callout";

const ErrorMetaAddressNotFound = new Error("meta stealth address not found");

const AliceWallet: Component = () => {
  const [balance] = createResource(aliceAccount, fetchBalance);
  const [recipient, setRecipient] = createSignal<string | undefined>(undefined);
  const [recipientMetaAddress, setRecipientMetaAddress] = createSignal<
    MetaStealthAddress | undefined
  >(undefined);
  const [fetchError, setFetchError] = createSignal<
    "not found" | "different" | undefined
  >(undefined);

  const fetchRecipientsMetaStealthAddres = async (address: string) => {
    await fetchMetaStealthAddres(address)
      .then((metaAddr) => {
        if (metaAddr.pubKey === "0x") {
          return Promise.reject(ErrorMetaAddressNotFound);
        }
        setFetchError(undefined);
        return setRecipientMetaAddress(metaAddr);
      })
      .catch((err) => {
        if (err === ErrorMetaAddressNotFound) {
          setFetchError("not found");
        } else {
          setFetchError("different");
        }
      });
  };

  const findRecipientMetaAddressForm = () => {
    return (
      <div class="py-4 space-y-2 w-full">
        <Label class="text-lg w-60" for="recipient">
          Recipient's address
        </Label>
        <Input
          class="text-lg"
          maxLength={42}
          id="recipient"
          placeholder="0x1234..."
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Button
          class="text-lg bg-emerald-500 hover:bg-emerald-700/90"
          onClick={() => {
            if (recipient() === undefined) {
              return;
            }
            fetchRecipientsMetaStealthAddres(recipient()!);
          }}
        >
          Find
        </Button>
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

  // 0x7d577a597B2742b498Cb5Cf0C26cDCD726d39E6e
  // TODO
  // 1. Stealth wallet
  // 2. Ephemeral key registry
  // 3. Submitter contract?? one tx to deploy contract and to submit into registry
  const sentEthForm = (metaAddr: MetaStealthAddress) => {
    return (
      <div>
        <Button class="text-xl bg-emerald-500 hover:bg-emerald-700/90">
          Send to stealth wallet
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
      </div>

      <Show when={recipientMetaAddress()} keyed>
        {sentEthForm}
      </Show>
    </div>
  );
};

export default AliceWallet;
