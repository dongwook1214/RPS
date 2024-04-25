import Web3 from "web3";
import Web3Instance from "../repository/web3Instance";

class GameContract {
  // Ethereum 네트워크에 연결 (여기서는 Rinkeby 테스트넷의 Infura 엔드포인트를 사용)
  web3Instance: Web3 = Web3Instance.getInstance();

  // 스마트 컨트랙트의 ABI와 주소
  contractABI = [
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_game_id",
          type: "uint32",
        },
        {
          internalType: "uint32",
          name: "_period",
          type: "uint32",
        },
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "c_player1",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "c_player2",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "forfeit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "game_id",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "is_open_player1",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "is_open_player2",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "m_player1",
      outputs: [
        {
          internalType: "enum Game.M",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "m_player2",
      outputs: [
        {
          internalType: "enum Game.M",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ongoing",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "open_block_number",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum Game.M",
          name: "_m",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "_r",
          type: "bytes32",
        },
      ],
      name: "open_commit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "participate",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "participate_block_number",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "period",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "player1",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "player2",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "refund",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "stake",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_c",
          type: "bytes32",
        },
      ],
      name: "submit_commit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "winner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  contractAddress: string;
  contract;

  constructor(_contractAddress: string) {
    this.contractAddress = _contractAddress;
    this.contract = new this.web3Instance.eth.Contract(
      this.contractABI,
      this.contractAddress
    );
  }

  public async getGameInfo(): Promise<GameInfo> {
    let _game_id = this.contract.methods.game_id().call();
    let _stake = this.contract.methods.stake().call();
    let _ongoing = this.contract.methods.ongoing().call();
    let _period = this.contract.methods.period().call();
    let _winner = this.contract.methods.winner().call();
    let _player1 = this.contract.methods.player1().call();
    let _player2 = this.contract.methods.player2().call();
    let game_id = (await _game_id).toString();
    let stake = (await _stake).toString();
    let ongoing = await _ongoing;
    let period = (await _period).toString();
    let winner = await _winner;
    let player1 = await _player1;
    let player2 = await _player2;

    return {
      game_id,
      stake,
      ongoing,
      period,
      player1,
      player2,
      winner,
      address: this.contractAddress,
    };
  }

  public async participate(amount: number): Promise<boolean> {
    try {
      let tx = await this.contract.methods.participate().send({
        from: (await this.web3Instance.eth.getAccounts())[0],
        value: Web3.utils.toWei(amount, "gwei"),
      });
    } catch (error) {
      console.log(error);
      alert("에러!");
      return false;
    }
    return true;
  }

  public async forfeit(): Promise<boolean> {
    try {
      let tx = await this.contract.methods
        .forfeit()
        .send({ from: (await this.web3Instance.eth.getAccounts())[0] });
    } catch (error) {
      console.log(error);
      alert("에러!");
      return false;
    }

    return true;
  }
  public async refund(): Promise<boolean> {
    try {
      let tx = await this.contract.methods
        .refund()
        .send({ from: (await this.web3Instance.eth.getAccounts())[0] });
    } catch (error) {
      console.log(error);
      alert("에러!");
      return false;
    }

    return true;
  }
  public async openCommit(m: number, r: string) {
    try {
      let tx = await this.contract.methods
        .open_commit(m, r)
        .send({ from: (await this.web3Instance.eth.getAccounts())[0] });
    } catch (error) {
      console.log(error);
      alert("에러!");
      return false;
    }

    return true;
  }
  public async submitCommit(c: string): Promise<boolean> {
    try {
      let tx = await this.contract.methods
        .submit_commit(c)
        .send({ from: (await this.web3Instance.eth.getAccounts())[0] });
    } catch (error) {
      console.log(error);
      alert("에러!");
      return false;
    }
    return true;
  }
  public async getWinner(): Promise<string> {
    let winner = await this.contract.methods.winner().call();
    return winner;
  }
  public async isFinishedAndWin(): Promise<string> {
    let _ongoing: Promise<boolean> = this.contract.methods.ongoing().call();
    let _winner = this.contract.methods.winner().call();
    let _address = this.web3Instance.eth.getAccounts();
    let ongoing = await _ongoing;
    let winner = (await _winner).toUpperCase();
    let address = (await _address)[0].toUpperCase();
    if (ongoing) {
      return "게임이 진행중입니다...";
    }
    if (winner == "0x0000000000000000000000000000000000000000") {
      return "무승부!";
    }
    return winner == address ? "승리!!!" : "패배 ㅜㅜ";
  }
  public async getOpponentUserProcessState(): Promise<UserProcessState> {
    let player1 = (await this.contract.methods.player1().call()).toUpperCase();
    let address = (await this.web3Instance.eth.getAccounts())[0].toUpperCase();
    if (player1 == address) {
      let _c = this.contract.methods.c_player2().call();
      let _m = this.contract.methods.m_player2().call();
      let _isOpen = this.contract.methods.is_open_player2().call();
      return {
        c: (await _c).toString(),
        m: (await _m).toString(),
        isOpen: await _isOpen,
      };
    } else {
      let _c = this.contract.methods.c_player1().call();
      let _m = this.contract.methods.m_player1().call();
      let _isOpen = this.contract.methods.is_open_player1().call();
      return {
        c: (await _c).toString(),
        m: (await _m).toString(),
        isOpen: await _isOpen,
      };
    }
  }
}

export interface GameInfo {
  game_id: string;
  stake: string;
  ongoing: boolean;
  period: string;
  player1: string;
  player2: string;
  winner: string;
  address: string;
}

export interface UserProcessState {
  c: string;
  m: string;
  isOpen: boolean;
}

export default GameContract;
