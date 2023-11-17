import { DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, MODULE_URL, BLOCK_COLLECTION_NAME, STATE_SEED } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { MoveResource } from '@martiandao/aptos-web3-bip44.js/dist/generated';
import { useState, useEffect } from 'react';
import React from 'react';
import { AptosAccount, WalletClient, HexString, Provider, Network } from '@martiandao/aptos-web3-bip44.js';
import { BlockType } from '../types';
import toast, { LoaderIcon } from 'react-hot-toast';
import { Block } from '../types/Block';
import { BlockItem } from '../components/BlockItem';

export default function Home() {
  const { account, signAndSubmitTransaction } = useWallet();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [blockType, setBlockType] = useState<number>(BlockType.Log);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [isStackMode, setStackMode] = useState<boolean>(false);

  const loadBlocks = async () => {
    if (account && account.address) {

      try {

        setLoading(true);

        setStackMode(false);
        setSelectedId(undefined);

        const provider = new Provider({
          fullnodeUrl: APTOS_NODE_URL
        });
        const resourceAddress = await AptosAccount.getResourceAccountAddress(
          DAPP_ADDRESS,
          new TextEncoder().encode(STATE_SEED)
        )
        const collectionAddress = await provider.getCollectionAddress(
          resourceAddress,
          BLOCK_COLLECTION_NAME,
        );

        const tokens = await provider.getTokenOwnedFromCollectionAddress(
          account.address.toString(),
          collectionAddress,
          {
            tokenStandard: "v2"
          }
        );

        const blocks = tokens.current_token_ownerships_v2.map(t => {

          const token_data = t.current_token_data;
          const properties = token_data?.token_properties;

          return {
            name: token_data?.token_name || "",
            token_id: token_data?.token_data_id || "",
            token_uri: token_data?.token_uri || "",
            id: properties.id,
            type: properties.type,
            count: properties.count,
          }
        });
        console.log(tokens)
        setBlocks(blocks)
      }
      catch {

      }

      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlocks();
  }, [
    account
  ])

  const handleMintBlock = async () => {
    if (!account) {
      toast.error("You need to connect wallet");
      return;
    }

    const toastId = toast.loading("Minting block...");

    try {
      const payloads = {
        type: 'entry_function_payload',
        function: DAPP_ADDRESS + "::block::mint_by_type",
        type_arguments: [],
        arguments: [
          blockType
        ],
      };

      const tx = await signAndSubmitTransaction(payloads, { gas_unit_price: 100 });
      console.log(tx);

      toast.success("Minting block successed...", {
        id: toastId
      });

      setTimeout(() => {
        loadBlocks();
      }, 3000);
    }
    catch (ex) {
      console.log(ex);
      toast.error("Minting block failed...", {
        id: toastId
      });
    }

  }

  const handleBurnBlock = async () => {

    if (!account) {
      toast.error("You need to connect wallet");
      return;
    }

    if (!selectedId) {
      toast.error("You need to select burn block");
      return;
    }

    const toastId = toast.loading("Burning block...");

    try {
      const payloads = {
        type: 'entry_function_payload',
        function: DAPP_ADDRESS + "::block::burn_block",
        type_arguments: [],
        arguments: [
          selectedId
        ],
      };

      const tx = await signAndSubmitTransaction(payloads, { gas_unit_price: 100 });
      console.log(tx);

      toast.success("Burning block successed...", {
        id: toastId
      });
      setSelectedId(undefined);

      setTimeout(() => {
        loadBlocks();
      }, 3000);
    }
    catch (ex) {
      console.log(ex);
      toast.error("Burning block failed...", {
        id: toastId
      });
    }

  }

  const handleStackBlock = async (otherBlock: number) => {

    if (!account) {
      toast.error("You need to connect wallet");
      return;
    }

    if (!selectedId) {
      toast.error("You need to select start block");
      return;
    }

    const toastId = toast.loading("Stacking block...");

    try {
      const payloads = {
        type: 'entry_function_payload',
        function: DAPP_ADDRESS + "::block::stack_block",
        type_arguments: [],
        arguments: [
          selectedId,
          otherBlock
        ],
      };

      const tx = await signAndSubmitTransaction(payloads, { gas_unit_price: 100 });
      console.log(tx);

      toast.success("Stacking block successed...", {
        id: toastId
      });
      setSelectedId(undefined);

      setTimeout(() => {
        loadBlocks();
      }, 3000);
    }
    catch (ex) {
      console.log(ex);
      toast.error("Stacking block failed...", {
        id: toastId
      });
    }

  }

  const handleSelect = (id: number) => {
    if (isStackMode) {
      if (selectedId != id) {
        handleStackBlock(id);
      }
    }
    else {
      if (selectedId != id) {
        setSelectedId(id);
      }
      else {
        setSelectedId(undefined);
      }
    }
  }

  return (
    <div>
      <center>
        <p>
          <b>Module Path: </b>
          <a target="_blank" href={MODULE_URL} className="underline">
            {DAPP_ADDRESS}::block
          </a>
        </p>

        {
          account &&

          <div className='my-4'>

            <div className='flex gap-4 items-center justify-center'>

              <select
                value={blockType}
                onChange={(e) => {
                  setBlockType(parseInt(e.target.value));
                }}
                className='border border-blue-500 rounded-md px-4 py-2'
              >
                <option value={BlockType.Log}>Log</option>
                <option value={BlockType.Planks}>Planks</option>
              </select>

              <button type='button'
                className='bg-blue-500 rounded-md text-white px-4 py-2 hover:bg-blue-600'
                onClick={handleMintBlock}>
                Mint Block
              </button>

              {
                selectedId &&
                <>
                  <button type='button'
                    className='bg-red-500 rounded-md text-white px-4 py-2 hover:bg-red-600'
                    onClick={handleBurnBlock}>
                    Burn Block
                  </button>
                  <button type='button'
                    className='bg-green-500 rounded-md text-white px-4 py-2 hover:bg-green-600'
                    onClick={() => setStackMode(!isStackMode)}>
                    {
                      isStackMode ? 'Cancle Stack' : 'Stack Block'
                    }
                  </button>
                </>
              }

            </div>

            <div className='flex gap-4'>

              {
                isLoading ?
                  <LoaderIcon className='!w-8 !h-8' />
                  :
                  blocks.map((block, idx) =>
                    <BlockItem key={idx}
                      block={block}
                      selectedId={selectedId}
                      isStackMode={isStackMode}
                      handleSelect={handleSelect}
                    />
                  )
              }

            </div>

          </div>
        }

      </center>

    </div>
  );
}
