import React, { useState } from 'react';
import RockPaperScissors from '../../contract/rockPaperScissors';
import { useNavigate } from 'react-router-dom';

const MakePage = () => {
    const [amount, setAmount] = useState<number>(1);
    const [period, setPeriod] = useState<number>(20);
    const navigate = useNavigate();

    const makeGame = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (amount < 1 || period < 20) {
            alert('amount 는 1 이상, period 는 20 이상이어야 합니다.');
            return;
        }
        RockPaperScissors.getInstance()
            .makeGame(period, amount)
            .then((v) => {
                if (v) navigate('/');
            });
    };

    return (
        <>
            <div className="w-full flex flex-col items-center p-20">
                <form onSubmit={makeGame} id="makeGameForm">
                    <label htmlFor="amount">amount: </label>
                    <input
                        type="number"
                        name="amount"
                        className=" bg-gray-100"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                    <br />
                    <br />
                    <label htmlFor="period">period: </label>
                    <input
                        type="number"
                        name="period"
                        className=" bg-gray-100"
                        value={period}
                        onChange={(e) => setPeriod(parseInt(e.target.value))}
                    />
                    <br />
                    <br />
                </form>
                <button className=" bg-blue-300 py-2 px-4 rounded" form="makeGameForm">
                    make!
                </button>
            </div>
        </>
    );
};

export default MakePage;
