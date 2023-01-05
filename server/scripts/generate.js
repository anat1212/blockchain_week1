const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

async function main() {
  const privateKey = secp.utils.randomPrivateKey();
  console.log("my private key is:", toHex(privateKey));

  const publicKey = secp.getPublicKey(privateKey);
  console.log("my public key is:", toHex(publicKey));
  console.log("my public key address:", getAddress(publicKey));

  const msgHash = await secp.utils.sha256("Anatoliy");
  const signature = await secp.sign(msgHash, privateKey, { recovered: true });
  console.log("My signature length is", toHex(signature[0]), signature[1]);

  const recoveredPublicKey = await secp.recoverPublicKey(
    msgHash,
    signature[0],
    signature[1]
  );

  console.log(
    "Is recovered public key match public key: ",
    toHex(recoveredPublicKey) === toHex(publicKey)
  );

  function getAddress(publicKey) {
    let address = keccak256(publicKey.slice(1)).slice(-20);
    return "0x" + toHex(address).toString();
  }
}

main();
