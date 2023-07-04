const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x03bff667c37a8b58284da29c6c0a8d48a60750d0da30b1ab451c470fab46662ea4": 100,
  "0x0364f9e8fef23df8194a680e3a70144da1f4a32da0f293348caea8eeca80bc61c8": 50,
  "0x02b19317c3e991dea49990b6f69564174fd3ae2fc718d0e0c5e4b0ef5e000a1a7c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: verify the signed message with the public key

  const { sender, recipient, amount } = req.body;

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
