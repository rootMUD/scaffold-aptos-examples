import { AptosAccount, Network, Provider, HexString } from "aptos";
import { NETWORK } from '../config/constants';

let network;
switch (NETWORK) {
  case "mainnet":
    network = Network.MAINNET;
    break;
  case "testnet":
    network = Network.TESTNET;
    break;
  case "devnet":
    network = Network.DEVNET;
    break;
  default:
    throw new Error("Invalid network");
}

const WIDTH = 32;
const provider = new Provider(network);

interface RotationResult {
  rotatedKey: string;
  hash: string;
}

function truncate(address: HexString): string {
  return `${address.toString().substring(0, 6)}...${address
    .toString()
    .substring(address.toString().length - 4, address.toString().length)}`;
}

function formatAccountInfo(account: AptosAccount): string {
  const vals: any[] = [
    account.address(),
    account.authKey(),
    HexString.fromUint8Array(account.signingKey.secretKey),
    HexString.fromUint8Array(account.signingKey.publicKey),
  ];

  return vals.join(" ");
}

export const rotate = async (key: string): Promise<RotationResult> => {
  const newAccount = new AptosAccount();
  const auth_key_account = new AptosAccount(new HexString(key).toUint8Array());
  let originalAccount: AptosAccount;
  try {
    // when the account does not have any rotation events, it will throw an error
    const req_addr = await provider.aptosClient.lookupOriginalAddress(auth_key_account.authKey());
    originalAccount = new AptosAccount(new HexString(key).toUint8Array(), req_addr);
  } catch (e) {
    originalAccount = new AptosAccount(new HexString(key).toUint8Array());
  }

  console.log(
    `\n${"Account".padEnd(WIDTH)} ${"Address".padEnd(WIDTH)} ${"Auth Key".padEnd(WIDTH)} ${"Private Key".padEnd(
      WIDTH,
    )} ${"Public Key".padEnd(WIDTH)}`,
  );
  console.log(`---------------------------------------------------------------------------------`);
  console.log(`${"originalAccount".padEnd(WIDTH)} ${formatAccountInfo(originalAccount)}`);
  console.log(`${"newAccount".padEnd(WIDTH)} ${formatAccountInfo(newAccount)}`);
  console.log("\n...rotating...".padStart(WIDTH));

  // Rotate the key!
  const response = await provider.aptosClient.rotateAuthKeyEd25519(originalAccount, newAccount.signingKey.secretKey); // <:!:rotate_key
  const aliceNew = new AptosAccount(
    newAccount.signingKey.secretKey,
    originalAccount.address(),
  );
    
  console.log(`\n${"new account".padEnd(WIDTH)} ${formatAccountInfo(aliceNew)}`);
  const rotatedKey = HexString.fromUint8Array(newAccount.signingKey.secretKey).toString();
  const hash = response.hash;
  return {rotatedKey, hash};
}