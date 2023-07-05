import React from "react";
import server from "./server";

function Wallet({
  publicKey,
  privateKey,
  setPrivateKey,
  setPublicKey,
  balance,
  setBalance,
}) {
  async function handleChange(evt) {
    setPublicKey(evt.target.value);

    if (evt.target.value) {
      const {
        data: { balance },
      } = await server.get(`balance/${evt.target.value}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key
        <input
          placeholder="Enter your public key"
          value={publicKey}
          onChange={handleChange}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Enter your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
