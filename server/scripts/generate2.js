const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

async function main(signature, sender) {
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

main(
  "3044022066bf5b2202e0d2a72077634f2af87c3df80c97c87c5d471bc0cd4d5311bd740d022004ef108882f2aa944bf82dc585a95949c49fe08f190b8a788965e567da820cb51"
);
