import { DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, MODULE_URL } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { MoveResource } from '@martiandao/aptos-web3-bip44.js/dist/generated';
import { useState, useEffect } from 'react';
import React from 'react';
import { AptosAccount, WalletClient, HexString } from '@martiandao/aptos-web3-bip44.js';
import Image from 'next/image';

// import { CodeBlock } from "../components/CodeBlock";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const [hasAddrAggregator, setHasAddrAggregator] = React.useState<boolean>(false);
  const [services, setServices] = React.useState<Array<any>>([]);
  const { account, signAndSubmitTransaction } = useWallet();
  // TODO: refresh page after disconnect.
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  // const [resource, setResource] = React.useState<MoveResource>();
  const [formInput, updateFormInput] = useState<{
    name: string;
    github_acct: string;
    description: string;
    gist_id: string;
    expired_at: number;
  }>({
    name: 'github',
    github_acct: '',
    description: 'my github account.',
    gist_id: '',
    expired_at: 0,
  });

  const [randomColor, setRandomColor] = useState<string>('red');
  const [randomIcon, setRandomIcon] = useState<string>('/random_icon_0.png');

  useEffect(() => {
    const colors = ['red', 'lightblue', 'orange', 'green', 'blackf'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    setRandomColor(colors[randomIndex]);

    const iconIndex = Math.floor(Math.random() * 5); // 0 to 4
    setRandomIcon(`/random_icon_${iconIndex}.png`);
  }, []);

  async function add_service() {
    await signAndSubmitTransaction(do_add_service(), { gas_unit_price: 100 }).then(() => {
      // updated it
      setTimeout(get_services, 3000);
    });
  }

  function do_add_service() {
    const { name, description, github_acct, gist_id, expired_at } = formInput;
    let github_url = "https://github.com/" + github_acct;
    let gist_url = "https://gist.github.com/" + github_acct + "/" + gist_id;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::service_aggregator::add_service',
      type_arguments: [],
      arguments: [name, description, github_url, gist_url, "", expired_at],
    };
  }

  async function update_service() {
    await signAndSubmitTransaction(do_update_service(), { gas_unit_price: 100 }).then(() => {
      // updated it
      setTimeout(get_services, 3000);
    });
  }

  function do_update_service() {
    const { name, description, github_acct, gist_id, expired_at } = formInput;
    let github_url = "https://github.com/" + github_acct;
    let gist_url = "https://gist.github.com/" + github_acct + "/" + gist_id;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::service_aggregator::update_service',
      type_arguments: [],
      arguments: [name, description, github_url, gist_url, "", expired_at],
    };
  }

  async function delete_service() {
    await signAndSubmitTransaction(do_delete_service(), { gas_unit_price: 100 }).then(() => {
      // updated it
      setTimeout(get_services, 3000);
    });
  }

  function do_delete_service() {
    const { name } = formInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::service_aggregator::delete_service',
      type_arguments: [],
      arguments: [name],
    };
  }

  // function log_acct() {
  //   console.log(resource)
  //   console.log(account!.address!.toString());
  // }

  async function check_service_aggregator() {
    if (account && account.address) {
      try {
        const service_aggregator: any = await client.aptosClient.getAccountResource(
          account.address.toString(),
          DAPP_ADDRESS + '::service_aggregator::ServiceAggregator'
        );
        console.log('service_aggregator: ' + service_aggregator.data);
        console.log(service_aggregator.data);
        setHasAddrAggregator(true);
      } catch (err: any) {
        console.log('check_service_aggregator: ' + err);
        setHasAddrAggregator(false);
      }
    }
  }

  async function get_services() {
    if (account && account.address) {
      try {
        const service_aggregator: any = await client.aptosClient.getAccountResource(
          account.address.toString(),
          DAPP_ADDRESS + '::service_aggregator::ServiceAggregator'
        );
        // console.log(service_aggregator);
        if (service_aggregator) {
          const names: Array<string> = service_aggregator.data.names;
          const service_infos_map_handle: string = service_aggregator.data.services_map.handle;
          // console.log(addresses);
          // console.log(addr_infos_map_handle);
          const res: Array<any> = [];
          for (let i = 0; i < names.length; i++) {
            const table_item = await client.aptosClient.getTableItem(service_infos_map_handle, {
              key_type: '0x1::string::String',
              value_type: DAPP_ADDRESS + '::service_aggregator::Service',
              key: names[i],
            });
            table_item.name = names[i];
            res.push(table_item);
          }
          console.log('services:');
          res.forEach(function (entry) {
            console.log(entry);
          });
          setServices(res);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    check_service_aggregator();
  }, [account]);
  useEffect(() => {
    get_services();
  }, [account]);
  useEffect(() => {
    console.log(hasAddrAggregator);
  }, [hasAddrAggregator]);
  useEffect(() => {
    console.log(services);
  }, [services]);

  async function init_did() {
    await signAndSubmitTransaction(do_init_did(), { gas_unit_price: 100 }).then(() => {
      setTimeout(get_services, 3000);
    });
  }

  function do_init_did() {
    const { description, resource_path, addr_type, addr, pubkey, addr_description, chains } = addAddrInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::init::init',
      type_arguments: [],
      arguments: [0, description],
    };
  }

  const [addAddrInput, setAddAddrInput] = useState<{
    did_type: number;
    description: string;
    resource_path: string;
    addr_type: number;
    addr: string;
    pubkey: string;
    addr_description: string;
    chains: Array<string>;
    expired_at: number;
  }>({
    did_type: 0,
    description: '',
    resource_path: '',
    addr_type: 0,
    addr: '',
    pubkey: '',
    addr_description: '',
    chains: [],
    expired_at: 0,
  });

  const render_services_table = () => {
    return (
      <table className="table table-compact w-full my-2">
        <thead>
          <tr className="text-center">
            <th>Service Name</th>
            <th>Description</th>
            <th>URL</th>
            <th>Verification URL</th>
            <th>Expired at</th>
            <th>Load to form</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 &&
            services.map((service, index) => {
              return (
                <tr className="text-center" key={index}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>
                    <a href={service.url} target="_blank" rel="noreferrer">
                      <p className="underline">{service.url} </p>
                    </a>
                  </td>
                  <td>
                    <a href={service.verification_url} target="_blank" rel="noreferrer">
                      <p className="underline">{service.verification_url} </p>
                    </a>
                  </td>
                  <td>{service.expired_at}</td>
                  <td>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => load_service(service)}>LOAD</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };
  const load_service = (service: any) => {
    const { name, description, url, verification_url, expired_at } = service;
    let arr_url = url.split("/");
    let github_acct = arr_url[arr_url.length - 1];
    let arr_verification_url = verification_url.split("/");
    let gist_id = arr_verification_url[arr_verification_url.length - 1];
    const loadInput = { name, description, github_acct, gist_id, expired_at };
    updateFormInput({ ...loadInput });
  };
  return (
    <div>
      <center>
      <p>
        <b>Module Path: </b>
        <a target="_blank" href={MODULE_URL} className="underline">
          {DAPP_ADDRESS}::address_aggregator
        </a>
      </p>
      <br></br>
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: randomColor }}>
          Generate the Profile for you on the Movement!
        </h2>
        &nbsp;&nbsp;&nbsp;<Image src={randomIcon} alt="Random Icon" width={32} height={32} className="ml-2" />
      </div>

      {!hasAddrAggregator && (
        <>
          <input
            placeholder="Description for your DID"
            className="mt-8 p-4 input input-bordered input-primary w-1/2"
            onChange={(e) => setAddAddrInput({ ...addAddrInput, description: e.target.value })}
          />
          <br></br>
          <br></br>
          The type of DID Owner: &nbsp; &nbsp; &nbsp; &nbsp;
          <select
            value={addAddrInput.did_type}
            onChange={(e) => {
              setAddAddrInput({ ...addAddrInput, did_type: parseInt(e.target.value) });
            }}>
            <option value="0">Individual</option>
            <option value="1">DAO</option>
            <option value="2">Bot</option>
            <option value="3">Repo</option>
          </select>
          <br></br>
          <button onClick={init_did} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
            Init Your DID
          </button>{' '}
          &nbsp; &nbsp; &nbsp; &nbsp; 💡 INIT Your DID on Movement before the other Operations!
          <br></br>
          <button
            onClick={get_services}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Refresh the Services Info
          </button>
          <br></br>
        </>
      )}
      {hasAddrAggregator && (
        <>
          <button
            onClick={get_services}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Refresh the Services Info
          </button>
          <div className="overflow-x-auto mt-2">
            {services.length > 0 && (
              <>
                <h3 className="text-center font-bold">Services</h3>
                <div>{render_services_table()}</div>
              </>
            )}
          <br></br>
          </div>



        <input
          placeholder="service Name"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          value={formInput.name}
        />
        <br></br>
        <input
          placeholder="service Description"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          value={formInput.description}
        />
        <br></br>
        <br></br>
        <br></br>

        <div className="inline-flex relative mr-3 formkit-field">
          <p>https://github.com/</p>
          <input
            placeholder="github account"
            className="p-4 input input-bordered input-primary ml-2"
            onChange={(e) => updateFormInput({ ...formInput, github_acct: e.target.value })}
            value={formInput.github_acct}
          />
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field">
          <a href="https://docs.movedid.build/guides-for-the-scenarios-of-move-did/bind-github-and-movedid/" target="_blank">
            <p className="underline">💡 How can I create a gist to verify my github acct?</p>
          </a>
        </div>
        <br></br>

        <div className="inline-flex relative mr-3 formkit-field">
          <a href="https://gist.github.com" target="_blank">
            <button className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Create a gist!
            </button>
          </a>
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field w-1/4">
          <p>https://gist.github.com/{formInput.github_acct}/</p>
        <input
          placeholder="gist Verification URL"
          className="p-4 input input-bordered input-primary w-full ml-2"
          onChange={(e) => updateFormInput({ ...formInput, gist_id: e.target.value })}
          value={formInput.gist_id}
        />
        </div>
        <br></br>
        <br></br>
        <div className="inline-flex relative mr-3 formkit-field">
          <p>0 means never expire: </p>
        <input
          className="p-4 input input-bordered input-primary ml-2"
          onChange={(e) => updateFormInput({ ...formInput, expired_at: parseInt(e.target.value) })}
          placeholder="0"
          value={formInput.expired_at}
        />
        </div>

        <br></br>
        <button onClick={add_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Add Service
        </button>
        <br></br>
        <button onClick={update_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Update Service
        </button>
        <br></br>
        <input
          placeholder="service Name"
          className="mt-8 p-4 input input-bordered input-primary w-1/4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          value={formInput.name}
        />
        <br></br>
        <button onClick={delete_service} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
          Delete Service
        </button>
        </>
      )}
      </center>
    </div>
  );
}
