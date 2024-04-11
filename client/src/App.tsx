import { useSDK } from '@metamask/sdk-react';
import './App.css';
import Home from './components/home/home';
import HeaderBar from './components/layout/headerBar';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './components/util/notFound';
import ParticipatePage from './components/participate/ParticipatePage';
import MakePage from './components/make/makePage';

function App() {
    const { sdk, connected, connecting, provider, chainId, account } = useSDK();
    const desiredChainId = '0x89';

    useEffect(() => {
        if (connected && account) {
            changeNetwork();
        }
    }, [chainId]);

    async function changeNetwork() {
        try {
            const currentChainId = await provider?.request({ method: 'eth_chainId' });
            if (currentChainId !== desiredChainId) {
                await provider?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: desiredChainId }],
                });
            }
        } catch (error) {
            console.error('네트워크 전환 에러', error);
        }
    }

    return (
        <>
            <div className=" App fixed w-full h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-purple-200">
                <BrowserRouter>
                    <header className="w-full max-w-screen-md">
                        <HeaderBar />
                    </header>
                    <body className="min-h-screen w-full max-w-screen-md">
                        {connected && account ? (
                            <Routes>
                                <Route path="/" element={<Home />}></Route>
                                <Route path="game/participate/:address" element={<ParticipatePage />}></Route>
                                <Route path="game/make" element={<MakePage />}></Route>
                                <Route path="*" element={<NotFound />}></Route>
                            </Routes>
                        ) : (
                            <h1 className=" px-5 w-full h-full flex flex-col items-center justify-center text-red-600">
                                로그인을 해주세요!
                            </h1>
                        )}
                    </body>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;
