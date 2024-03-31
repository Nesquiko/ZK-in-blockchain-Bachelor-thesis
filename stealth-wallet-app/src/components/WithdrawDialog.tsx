import { Component, createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { formatWei, shortenAddress } from "../lib/format";
import { Web3BaseWalletAccount } from "web3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

interface WithdrawDialogProps {
  from: string;
  amount: bigint;
  withdrawalAccounts: Web3BaseWalletAccount[];
  onWithdraw: (withdrawalAddres: string) => Promise<void>;
}

const WithdrawDialog: Component<WithdrawDialogProps> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [choosenAddress, setChoosenAddress] = createSignal(
    props.withdrawalAccounts[0].address,
  );
  const withdrawalAddresses = () =>
    props.withdrawalAccounts.map((acc) => acc.address);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger>
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Withdrawing from {shortenAddress(props.from)}</DialogTitle>
        <DialogDescription>
          Select withdrawal address for{" "}
          <span class="text-violet-500 font-bold">
            {formatWei(props.amount)} ETH
          </span>
        </DialogDescription>
        <div>
          <Select
            value={choosenAddress()}
            disabled={loading()}
            onChange={setChoosenAddress}
            options={withdrawalAddresses()}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger aria-label="Withdrawal Address">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            class="bg-violet-500 w-20 hover:bg-violet-700/90"
            loading={loading()}
            onClick={async () => {
              setLoading(true);
              await props.onWithdraw(choosenAddress());
              setOpen(false);
              setLoading(false);
            }}
          >
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
