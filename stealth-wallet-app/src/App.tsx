import { Route, Router } from "@solidjs/router";
import type { Component } from "solid-js";
import AliceWallet from "./pages/AliceWallet";

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
    <Router>
      <Route path="/" component={home} />
      <Route path="/alice" component={AliceWallet} />
    </Router>
  );
};

export default App;
