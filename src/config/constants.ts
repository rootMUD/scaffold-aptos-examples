export const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const DAPP_NAME = process.env.NEXT_PUBLIC_DAPP_NAME!; // changed here.
export const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS!; // changed here.
export const MARKET_COINT_TYPE = process.env.NEXT_PUBLIC_MARKET_COIN_TYPE!;

export const APTOS_NODE_URL = process.env.NEXT_PUBLIC_APTOS_NODE_URL!;
export const APTOS_FAUCET_URL = "https://faucet.devnet.aptoslabs.com/v1/";

export const NETWORK=process.env.NEXT_PUBLIC_APTOS_NETWORK!;

// TODO: network update here.
export const MODULE_URL=`https://explorer.movementnetwork.xyz/account/${  DAPP_ADDRESS  }/modules/code/addr_aggregator?network=testnet`

export const ETH_SIGNER_URL="https://eth-signer-react-app.vercel.app/?msg=";
export const APTOS_SIGNER_URL="https://aptos-signer.vercel.app/?msg="
