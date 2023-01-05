import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex }  from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, signature, setSignature }) {
  async function onChangeSender(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChangeSignature(evt) {
    const signature = evt.target.value;
    setSignature(signature);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChangeSender}></input>
      </label>

      <label>
        Sender Signature
        <input placeholder="Type your signature" value={signature} onChange={onChangeSignature}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
