// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./game.sol";

contract RockPaperScissors {
    Game[] public game_list;
    uint32 count = 0;
    
    function make_game (uint32 _period) public payable {
        require(msg.value > 0, "Must send some ether to bet.");
        require(_period > 19, "period is too short");
        Game new_game = (new Game){value: msg.value}(count, _period, msg.sender);
        game_list.push(new_game);
        count++;
    }

    function get_game_list () public view returns(Game[] memory) {
        return game_list;
    }

}
