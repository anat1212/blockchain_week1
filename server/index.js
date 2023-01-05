const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0x4814e99ffb730495d716d92d1269b997e70cb46e": 100,
  "0x53268413cab50784cc134c4d0a2bd42461d0530e": 50,
  "0xfcd3a8cc537a82aca0eab6f3788436911ac8b3ef": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  // To od get a signature from the slient side application
  //recover the public address from signature
  //

  let isSignatureVarified = await RecoverAddressFromSign(signature, sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (isSignatureVarified === false) {
    res.status(400).send({ message: "Please provide correct signature" });
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

async function RecoverAddressFromSign(signature, sender) {
  const msgHash = await secp.utils.sha256("Anatoliy");
  console.log("Starting signature varification...");
  try {
    const recoveredPublicKey = await secp.recoverPublicKey(
      msgHash,
      hexToBytes(signature.slice(0, -1)),
      Number(signature.slice(-1)[0])
    );
    const recoveredAddress = await getAddress(recoveredPublicKey);
    if (recoveredAddress === sender) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error during signature varification: ", e);
    return false;
  }

  async function getAddress(publicKey) {
    let address = await keccak256(publicKey.slice(1)).slice(-20);
    return "0x" + toHex(address).toString();
  }
}
