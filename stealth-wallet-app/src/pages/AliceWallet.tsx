import { Component } from "solid-js";
import WalletHeader from "../components/WalletHeader";

// TODO do the Alice part
//  1. deploy contracts into local anvil chain
//  1. first put bobs meta stealth address into registry
//  2. make alice choose to whom send
//  3. send funds
//  4. Submitter contract?? one tx to deploy contract and to submit into registry
const AliceWallet: Component = () => {
  return <div class="p-2 h-screen w-screen">Alice</div>;
};

export default AliceWallet;
