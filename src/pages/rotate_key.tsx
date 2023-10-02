import { NETWORK } from '../config/constants';
import { useState } from 'react';
import React from 'react';
import { rotate } from '../utils/rotate';
export default function Home() {
  const [privateKey, setPrivateKey] = useState('');
  const [rotatedKey, setRotatedKey] = useState('');
  const [rotatedHash, setRotatedHash] = useState('');
  const url = `https://explorer.aptoslabs.com/txn/${rotatedHash}?network=${NETWORK}`;
  
  async function do_rotate() {
    const result = await rotate(privateKey);
    setRotatedKey(result.rotatedKey);
    setRotatedHash(result.hash);
  }

  function handle_pk_change(event: React.ChangeEvent<HTMLInputElement>) {
    setPrivateKey(event.target.value);
  }

  return (
    <div>
      {(
        <>
          <input
            placeholder="Input your private key (0x...)"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={handle_pk_change}
          />
          <br></br>
          <button onClick={do_rotate} className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
            Rotate your key
          </button>{' '}
          &nbsp; &nbsp; &nbsp; &nbsp; 💡 Generate a new key pair and rotate your key.
          <br></br>
          <br></br>
          <p>Your new private key: {rotatedKey}</p>
          <br></br>
          <p>Transaction hash: <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>{rotatedHash}</a></p>
        </>
      )}
    </div>
  );
}
