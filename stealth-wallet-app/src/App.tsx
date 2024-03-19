import { Route, Router } from "@solidjs/router";
import type { Component } from "solid-js";
import AliceWallet from "./pages/AliceWallet";
import BobWallet from "./pages/BobWallet";

const App: Component = () => {
  const home = () => {
    return (
      <div class="flex flex-col gap-4 justify-center items-center text-center min-h-screen">
        <a href="/alice" class="bg-blue-500 text-white w-56 text-4xl rounded">
          Alice
        </a>
        <a href="/bob" class="bg-green-500 text-white w-56 text-4xl rounded">
          Bob
        </a>
      </div>
    );
  };

  return (
    <Router root={(props) => <div class="h-screen">{props.children}</div>}>
      <Route path="/" component={home} />
      <Route path="/alice" component={AliceWallet} />
      <Route path="/bob" component={BobWallet} />
    </Router>
  );
};

export default App;
