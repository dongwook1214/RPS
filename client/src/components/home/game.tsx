import React from "react";
import { useNavigate } from "react-router-dom";
import GameContract from "../../contract/gameContract";
import { useSDK } from "@metamask/sdk-react";

const Game = ({
  game_id,
  stake,
  ongoing,
  period,
  player1,
  player2,
  winner,
  address,
}: {
  game_id: string;
  stake: string;
  ongoing: boolean;
  period: string;
  player1: string;
  player2: string;
  winner: string;
  address: string;
}) => {
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();
  const navigate = useNavigate();

  const onClick = () => {
    if (ongoing) {
      if (
        player2.toUpperCase() == account?.toUpperCase() ||
        player1.toUpperCase() == account?.toUpperCase()
      ) {
        navigate("/game/participate/" + address);
      } else if (
        player2 == "0x0000000000000000000000000000000000000000" &&
        window.confirm("판돈을 지불하고 게임에 입장하시겠습니까?")
      ) {
        let gameContract = new GameContract(address);
        gameContract.participate(parseInt(stake)).then((v) => {
          if (v) {
            navigate("/game/participate/" + address);
          }
        });
      }
    } else {
      alert("이미 종료된 게임입니다.");
    }
  };
  return (
    <div
      onClick={onClick}
      className={
        " w-full hover:cursor-pointer" + (ongoing ? " " : " opacity-30")
      }
    >
      <div className=" w-full h-28 flex justify-between">
        <div className=" flex flex-col justify-between">
          <h1>{game_id}</h1>
          <h3>{ongoing ? "진행중" : "완료"}</h3>
          <h3 className=" overflow-ellipsis overflow-hidden inline-block max-w-40">
            {player1}
          </h3>
        </div>
        <div
          className={
            " flex flex-col items-center justify-evenly" +
            (ongoing ? " hidden" : " ")
          }
        >
          <h1>승자</h1>
          <h3 className=" overflow-ellipsis overflow-hidden inline-block max-w-40">
            {winner}
          </h3>
        </div>
        <div className=" flex flex-col justify-between">
          <h1 className=" overflow-ellipsis overflow-hidden inline-block max-w-40">
            {stake + "gwei"}
          </h1>
          <h3>{"period: " + period + " block"}</h3>
          <h3 className=" overflow-ellipsis overflow-hidden inline-block max-w-40">
            {player2}
          </h3>
        </div>
      </div>
      <div
        className="w-full h-1 bg-gray-200 my-4"
        style={{ height: "1px" }}
      ></div>
    </div>
  );
};

export default Game;
