// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game{
    enum M { Rock, Paper, Scissors }
    uint32 public game_id;
    uint256 public stake;
    bool public ongoing;
    uint256 public open_block_number;
    uint256 public participate_block_number;
    uint32 public period;
    address public player1;
    address public player2;
    address public winner;
    bytes32 public c_player1;
    bytes32 public c_player2;
    M public m_player1;
    M public m_player2;
    bool public is_open_player1;
    bool public is_open_player2;

    constructor(uint32 _game_id, uint32 _period, address sender) payable {
        require(msg.value > 0, "Must send some ether to bet.");
        require(_period > 19, "period is too short");
        game_id = _game_id;
        stake = msg.value;
        ongoing = true;
        period = _period;
        player1 = sender;
    }

    function participate() public payable {
        require(ongoing == true, "game finished.");
        require(player2 == address(0), "There are other participants.");
        require(msg.value == stake, "ether must be same to stake");
        player2 = msg.sender;
        participate_block_number = block.number;
    }

    function submit_commit(bytes32 _c) public {
        require(ongoing == true, "game finished.");
        require(msg.sender == player1 || msg.sender == player2, "Not a player.");
        require(c_player1 == bytes32(0) || c_player2 == bytes32(0), "Both players have already committed.");

        if (msg.sender == player1) {
            require(c_player1 == bytes32(0), "Player 1 has already committed.");
            c_player1 = _c;
        } else {
            require(c_player2 == bytes32(0), "Player 2 has already committed.");
            c_player2 = _c;
        }
    }

    function open_commit(M _m, bytes32 _r) public {
        require(ongoing == true, "game finished.");
        require(msg.sender == player1 || msg.sender == player2, "Not a player.");
        require(c_player1 != 0 && c_player2 != 0, "please wait other player");
        require(keccak256(abi.encodePacked(_m, _r)) == (msg.sender == player1 ? c_player1 : c_player2), "Move does not match commit.");

        if (msg.sender == player1) {
            m_player1 = _m;
            is_open_player1 = true;
        } else {
            m_player2 = _m;
            is_open_player2 = true;
        }
        open_block_number = block.number;
        if (is_open_player1 && is_open_player2) {
            determineWinner();
        }
    }

    function determineWinner() private {
        if (m_player1 == m_player2) {
            payable(player1).transfer(stake);
            payable(player2).transfer(stake);
        } else if ((m_player1 == M.Rock && m_player2 == M.Scissors) ||
                   (m_player1 == M.Scissors && m_player2 == M.Paper) ||
                   (m_player1 == M.Paper && m_player2 == M.Rock)) {
            payable(player1).transfer(stake*2);
            winner = player1;
        } else {
            payable(player2).transfer(stake*2);
            winner = player2;
        }
        ongoing = false;
    }

    function refund() public {
        require(ongoing == true, "game finished.");
        require(msg.sender == player1 || msg.sender == player2, "Not a player.");
        require(player2 == address(0) || player2 != address(0) && c_player2 == 0,"player2 already submit commitment");
        ongoing = false;
        if(player2 == address(0)){
            payable(player1).transfer(stake);
        }else{
            payable(player1).transfer(stake);
            payable(player2).transfer(stake);
        }
    }

    function forfeit() public {
        require(ongoing == true, "game finished.");
        require(msg.sender == player1 || msg.sender == player2, "Not a player.");
        require(block.number > open_block_number + period && block.number > participate_block_number + period, "period has not passed");
        require(player1 != address(0) && player2 != address(0), "forfeit function must be executed when both players exist");
        require((is_open_player1 == true && is_open_player2 == false) || (is_open_player1 == false && is_open_player2 == true), "least one player must open commit.");
        ongoing = false;
        if(is_open_player1){
            payable(player1).transfer(stake*2);
            winner = player1;
        }else{
            payable(player2).transfer(stake*2);
            winner = player2;
        }
    }
}