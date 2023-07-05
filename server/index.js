const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const PUBLIC_ONE = process.env.PUBLIC_ONE || "one";
const PUBLIC_TWO = process.env.PUBLIC_TWO || "two";
const PUBLIC_THREE = process.env.PUBLIC_THREE || "three";

const balances = {
  [PUBLIC_ONE]: 100,
  [PUBLIC_TWO]: 50,
  [PUBLIC_THREE]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, messageHash } = req.body;
  const isSigned = secp256k1.verify(signature, messageHash, sender);

  if (!isSigned) throw new Error("Unauthorized transaction");

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
