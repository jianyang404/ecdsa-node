import React, { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ publicKey, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const derivedKey = toHex(secp256k1.getPublicKey(privateKey));

      if (publicKey !== derivedKey)
        return alert("Invalid public/private key pair");

      const payload = {
        sender: publicKey,
        amount: parseInt(sendAmount),
        recipient,
        timestamp: Date.now(),
      };

      const messageHash = toHex(
        keccak256(utf8ToBytes(JSON.stringify(payload)))
      );
      const signature = secp256k1.sign(messageHash, privateKey).toCompactHex();

      const {
        data: { balance },
      } = await server.post(`send`, { ...payload, messageHash, signature });
      setBalance(balance);
    } catch (ex) {
      alert(ex?.response?.data?.message ?? ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
