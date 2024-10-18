import "../styles/globals.css";
import "../styles/loading.css";
import "../styles/select-input.css";
import { NavBar } from "../components/NavBar";
import type { AppProps } from "next/app";
import { useMemo, useState } from "react";
import {
  PontemWalletAdapter,
  WalletProvider,
  AptosWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";

// import { useAptosWallet } from '@razorlabs/wallet-kit';
// import '@razorlabs/wallet-kit/style.css';
import { ModalContext, ModalState } from "../components/ModalContext";
function WalletSelector({ Component, pageProps }: AppProps) {
  const [modalState, setModalState] = useState<ModalState>({
    walletModal: false,
  });
  const wallets = useMemo(
    () => [
      new AptosWalletAdapter(),
      new PontemWalletAdapter(),
    ],
    []
  );
  const modals = useMemo(
    () => ({
      modalState,
      setModalState: (modalState: ModalState) => {
        setModalState(modalState);
      },
    }),
    [modalState]
  );

  return (
    <WalletProvider wallets={wallets} autoConnect={false}>
      <ModalContext.Provider value={modals}>
        <div className="px-8">
          <NavBar />
          <Component {...pageProps} className="bg-base-300" />
        </div>
      </ModalContext.Provider>
    </WalletProvider>
  );
}

export default WalletSelector;
