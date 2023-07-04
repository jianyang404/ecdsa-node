import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import React, { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setPublicKey={setPublicKey}
      />
      <Transfer setBalance={setBalance} publicKey={publicKey} />
    </div>
  );
}

export default App;
