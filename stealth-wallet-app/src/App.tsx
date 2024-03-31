import { Route, Router } from "@solidjs/router";
import type { Component } from "solid-js";
import AliceWallet from "./pages/AliceWallet";
import BobsWallet from "./pages/BobWallet";
import { Toaster } from "./components/ui/toast";

const App: Component = () => {
  const home = () => {
    return (
      <div class="flex flex-col gap-4 justify-center items-center text-center min-h-screen">
        <a
          href="/alice"
          class="bg-emerald-400 text-white w-56 text-4xl rounded"
        >
          Alice
        </a>
        <a href="/bob" class="bg-violet-400 text-white w-56 text-4xl rounded">
          Bob
        </a>
      </div>
    );
  };

  return (
    <Router
      root={(props) => (
        <div class="h-screen">
          {props.children}
          <Toaster />
        </div>
      )}
    >
      <Route path="/" component={home} />
      <Route path="/alice" component={AliceWallet} />
      <Route path="/bob" component={BobsWallet} />
    </Router>
  );
};

export default App;
