import { useSDK } from '@metamask/sdk-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderBar = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const navigate = useNavigate();

    const connect = async () => {
        try {
            await sdk?.connect();
        } catch (err) {
            console.warn('failed to connect..', err);
        }
    };

    const disconnect = () => {
        try {
            sdk?.terminate();
        } catch (err) {
            console.warn('failed to connect..', err);
        }
    };
    return (
        <>
            <div className=" flex w-full max-w-screen-md h-16 justify-between items-center px-5 pt-3 mb-2">
                <h1 onClick={() => navigate('/')} className=" inline hover:cursor-pointer">
                    Rock Paper Scissors!
                </h1>
                {connected ? (
                    <button onClick={disconnect} className={' text-red-300'}>
                        <h3>Disconnect</h3>
                        <h3>MetaMask</h3>
                    </button>
                ) : (
                    <button onClick={connect} className={' text-blue-300'}>
                        <h3>Connect</h3>
                        <h3>MetaMask</h3>
                    </button>
                )}
            </div>
        </>
    );
};

export default HeaderBar;
