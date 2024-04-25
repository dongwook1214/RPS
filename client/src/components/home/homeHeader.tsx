import React, { useLayoutEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { useNavigate } from "react-router-dom";
import Web3Instance from "../../repository/web3Instance";
import Web3 from "web3";

const HomeHeader = () => {
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();
  const [balances, setBalance] = useState<string>("");
  const navigate = useNavigate();
  useLayoutEffect(() => {
    getBalance(account!).then((v) => {
      setBalance(v);
    });
  }, [account, chainId]);

  const getBalance = async (account: string) => {
    const res = await Web3Instance.getInstance().eth.getBalance(account);
    return Web3Instance.getInstance().utils.fromWei(res, "ether");
  };

  const onClick = () => {
    navigate("/game/make");
  };

  return (
    <div className="w-full flex justify-between">
      <div className=" flex flex-col items-start">
        <h4 className=" inline-block max-w-48 overflow-ellipsis overflow-hidden">{`address:${account}`}</h4>
        <h4 className=" inline-block max-w-48 overflow-ellipsis overflow-hidden">
          {" "}
          {`balance:${balances}`}{" "}
        </h4>
        <h4 className=" inline-block">{`chainId: ${chainId}`}</h4>
      </div>
      <div
        className=" flex flex-col justify-center hover:cursor-pointer"
        onClick={onClick}
      >
        <h4 className=" text-blue-300">make game!</h4>
      </div>
    </div>
  );
};

export default HomeHeader;
