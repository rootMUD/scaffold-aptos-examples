# Aptos Key Rotation Tool
## Start Guide

1. `git clone https://github.com/NonceGeek/scaffold-aptos.git`
2. `d scaffold-move/scaffold-aptos`
3. `yarn # Install the necessary front-end packages, pay attention to your local network environment`
4. Environment configuration, some global variables are in .env.local, which will be injected into the process started by yarn by default. Attention beginners, the testnet faucet url provided by aptos official website cannot be used directly.
5. `yarn dev`
6. `yarn build #compiled next.js application`

This project contract is based on MoveDID. Project address <https://github.com/NonceGeek/MoveDID>.

This project is maintained by [NonceGeek DAO](https://noncegeek.com/#/).

## Project Structure
```
src/
  config/
    constants.ts
  utils/
    rotate.ts
  rotate_key.tsx
```

- `rotate.ts` contains the rotate function, which is used to rotate private keys.
- `rotate_key.tsx` is the main file for the app, which allows users to input a private key and rotate it.

## Functionality
It allows users to input their private key and rotate it, 
The tool will generate a new private key and send a key rotation transaction. 
For now, it only supprots ed25519 auth key rotation.
Note that the tool will not store the key pair, so users should make sure to keep their private key safe.