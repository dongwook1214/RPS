import Web3 from 'web3';
import Web3Instance from '../repository/web3Instance';

class RockPaperScissors {
    private static instance: RockPaperScissors;

    // Ethereum 네트워크에 연결 (여기서는 Rinkeby 테스트넷의 Infura 엔드포인트를 사용)
    web3Instance: Web3 = Web3Instance.getInstance();

    // 스마트 컨트랙트의 ABI와 주소
    contractABI = [
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '_period',
                    type: 'uint32',
                },
            ],
            name: 'make_game',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'game_list',
            outputs: [
                {
                    internalType: 'contract Game',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'get_game_list',
            outputs: [
                {
                    internalType: 'contract Game[]',
                    name: '',
                    type: 'address[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ] as const;
    contractAddress = '0x250bBB985EE526d7522C4Bd604704D8A2dF7BCD4';

    // 스마트 컨트랙트 인스턴스 생성
    contract = new this.web3Instance.eth.Contract(this.contractABI, this.contractAddress);

    private constructor() {}

    public static getInstance() {
        if (!RockPaperScissors.instance) {
            RockPaperScissors.instance = new RockPaperScissors();
        }
        return RockPaperScissors.instance;
    }

    public async getGameList(): Promise<string[]> {
        let game_list: string[] = await this.contract.methods.get_game_list().call();
        return game_list;
    }

    public async makeGame(period: number, amount: number): Promise<boolean> {
        try {
            this.contract.methods.make_game(period).send({
                from: (await this.web3Instance.eth.getAccounts())[0],
                value: Web3.utils.toWei(amount, 'gwei'),
            });
        } catch (error) {
            console.log(error);
            alert('에러!');
            return false;
        }
        return true;
    }
}

export default RockPaperScissors;
