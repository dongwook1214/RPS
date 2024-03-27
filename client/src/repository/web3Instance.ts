import Web3 from 'web3';

class Web3Instance {
    private static instance: Web3;

    private constructor() {}

    public static getInstance() {
        if (!Web3Instance.instance) {
            Web3Instance.instance = new Web3(window.ethereum);
        }
        return Web3Instance.instance;
    }
}

export default Web3Instance;
