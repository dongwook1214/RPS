import React from "react";
import HomeHeader from "./homeHeader";
import GameList from "./gameList";

const Home = () => {
  return (
    <div className=" px-5 w-full flex flex-col items-center h-full ">
      <HomeHeader />
      <br />
      <br />
      <GameList />
    </div>
  );
};

export default Home;
