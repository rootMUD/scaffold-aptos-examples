
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head'


export default function Home() {
  const router = useRouter();
  const { connected, signMessage, wallet } = useWallet();
  const [nonce, setNonce] = useState("random_string_may_change_as_nonce");
  const [msg, setMsg] = useState("");
  const [signData, setSignData] = useState("");
  const [signDetail, setSignDetail] = useState("");

  const buildSignMessagePayload = (messageToSign: string) => {
    let payload = [
      'pontem',
      'petra',
      'martian',
      'fewcha',
      'rise wallet',
      'snap',
      'bitkeep',
      'blocto',
      'coin98',
      'foxwallet',
      'openblock'
    ].includes(wallet?.adapter?.name?.toLowerCase() || '')
      ? {
        message: messageToSign,
        nonce
      }
      : messageToSign;
    console.log("sign payload ", payload);
    return payload;
  }

  useEffect(() => {
    (async () => {
      console.log("render once ...");
      if (typeof router.query.msg == 'string') {
        setMsg(router.query.msg);
      }
    })();
  }, [router.query]);

  // 参考代码: https://github.com/hippospace/aptos-wallet-adapter/blob/6c4f4f3e91a8985bb7ab40873afc44f7402ecd30/packages/wallet-nextjs/pages/index.tsx
  const signMessageAction = async () => {
    if (connected) {
      const signedMessage = await signMessage(buildSignMessagePayload(msg));

      const response = typeof signedMessage === 'string' ? signedMessage : signedMessage.signature;

      setSignData(response.toString());

      let detailObj = signedMessage as Object;
      console.log(detailObj);
      setSignDetail(JSON.stringify(detailObj, null, 2));
    } else {
      alert("connect wallet first...");
    }
  }

  return (
    <div>

      <Head>
        <title>Aptos signer</title>
      </Head>
      <div className="m-7 p-4  w-full rounded-md border-2">
        <input
          placeholder="nounce"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            setNonce(e.target.value)
          }
          value={nonce}
        />
        <input
          placeholder="message"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            setMsg(e.target.value)
          }
          value={msg}
        />
        <button
          onClick={signMessageAction}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Sign Messsage
        </button>

        <div className="w-full mt-3  rounded-md ">
          <p className="rounded-md border-slate-600	">
            Sign Content :  <b> {signData} </b>
          </p>
          <p className="rounded-md border-slate-600	mt-5">
            Sign Detail :  <b> {signDetail} </b>
          </p>
        </div>
      </div>

    </div>
  );
}
