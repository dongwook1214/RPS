import React, { useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import makeCM, { numberToBytes32 } from '../../service/makeCM';
import GameContract, { UserProcessState } from '../../contract/gameContract';

enum rpsEnum {
    scissors = 2,
    rock = 0,
    paper = 1,
}

const ParticipatePage = () => {
    const contractAddress = useParams().address;
    const [password, setPassword] = useState<number>(0);
    const [rps, setRps] = useState<rpsEnum>(0);
    const [opponentUserProcessState, setOpponentUserProcessState] = useState<UserProcessState>({
        c: '',
        m: '',
        isOpen: false,
    });
    const [winState, setWinState] = useState<string>('');
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const gameContract = new GameContract(contractAddress!);
        const intervalId = setInterval(() => {
            gameContract.getOpponentUserProcessState().then((v) => {
                setOpponentUserProcessState(v);
            });
            gameContract.isFinishedAndWin().then((v) => setWinState(v));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const submitCM = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cm = makeCM(rps, password);
        const gameContract = new GameContract(contractAddress!);
        gameContract.submitCommit(cm).then((v) => {
            if (v) alert('제출 완료');
        });
    };

    const open = () => {
        const gameContract = new GameContract(contractAddress!);
        try {
            gameContract.openCommit(rps, numberToBytes32(password)).then((v) => {
                if (v) {
                    alert('open 완료');
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const refund = () => {
        const gameContract = new GameContract(contractAddress!);
        gameContract.refund().then((v) => {
            if (v) {
                alert('refund 완료');
                navigate('/');
            }
        });
    };

    const forfeit = () => {
        const gameContract = new GameContract(contractAddress!);
        gameContract.forfeit().then((v) => {
            if (v) {
                alert('forfeit 완료');
                navigate('/');
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center p-20">
            <form onSubmit={submitCM} id="submitCMForm" className="w-full flex flex-col items-center">
                <select
                    className=" w-36 bg-gray-200"
                    name="rps"
                    id="rpsg"
                    value={rps}
                    onChange={(e) => setRps(parseInt(e.target.value))}
                >
                    <option value={'2'}>가위</option>
                    <option value={'0'}>바위</option>
                    <option value={'1'}>보</option>
                </select>
                <br />
                <br />
                <div className="flex h-10 items-center">
                    <label htmlFor="password" className="pr-3">
                        password:{' '}
                    </label>
                    <input
                        type="number"
                        name="password"
                        className=" bg-gray-200 h-8 p-2"
                        value={password}
                        onChange={(e) => setPassword(parseInt(e.target.value))}
                    />
                </div>

                <br />
                <br />
            </form>
            <div className="flex mb-3 justify-evenly w-full">
                <button className=" bg-blue-300 py-2 px-4 rounded mr-2 w-36" form="submitCMForm">
                    submit!
                </button>
                <button className=" bg-blue-300 py-2 px-4 rounded w-36 " onClick={open}>
                    open!
                </button>
            </div>
            <div className="flex mb-3 justify-evenly w-full">
                <button className=" bg-blue-300 py-2 px-4 rounded mr-2 w-36" onClick={refund}>
                    refund
                </button>
                <button className=" bg-blue-300 py-2 px-4 rounded w-36" onClick={forfeit}>
                    forfeit
                </button>
            </div>
            <div className="flex flex-col w-full">
                <h3>opponent</h3>
                <h3>commit: {opponentUserProcessState.c}</h3>
                <h3 className={' ' + (opponentUserProcessState.isOpen ? '' : ' hidden')}>
                    reveal: {rpsEnum[parseInt(opponentUserProcessState.m)]}
                </h3>
                <h2>{winState}</h2>
            </div>
        </div>
    );
};

export default ParticipatePage;
