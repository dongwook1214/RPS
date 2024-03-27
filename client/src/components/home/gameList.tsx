import React, { useLayoutEffect } from 'react';
import Game from './game';
import { useSDK } from '@metamask/sdk-react';
import RockPaperScissors from '../../contract/rockPaperScissors';
import GameContract, { GameInfo } from '../../contract/gameContract';
import Web3 from 'web3';

const GameList = () => {
    const { sdk, connected, connecting, provider, chainId, account } = useSDK();
    const [games, setGames] = React.useState<GameInfo[]>([]);

    useLayoutEffect(() => {
        async function fetchGames() {
            let gameList = await RockPaperScissors.getInstance().getGameList();
            let gameInfoList = await Promise.all(
                gameList.map((v) => {
                    let gameContract = new GameContract(v);
                    return gameContract.getGameInfo();
                })
            );
            gameInfoList.sort((a, b) => {
                if (a.ongoing && !b.ongoing) {
                    // a가 ongoing이면 a를 앞으로 보냅니다.
                    return -1;
                } else if (!a.ongoing && b.ongoing) {
                    // b가 ongoing이면 b를 앞으로 보냅니다.
                    return 1;
                }
                // 두 요소의 ongoing 상태가 같으면 순서를 변경하지 않습니다.
                return 0;
            });
            setGames(gameInfoList);
        }
        fetchGames();
    }, []);

    return (
        <div className={' w-full overflow-y-scroll'}>
            {games.map((v, i) => {
                return (
                    <Game
                        key={'game' + i}
                        game_id={v.game_id}
                        stake={Web3.utils.fromWei(v.stake, 'gwei')}
                        ongoing={v.ongoing}
                        period={v.period}
                        player1={v.player1}
                        player2={v.player2}
                        winner={v.winner}
                        address={v.address}
                    />
                );
            })}
        </div>
    );
};

export default GameList;
