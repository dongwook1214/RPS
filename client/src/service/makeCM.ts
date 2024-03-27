import Web3 from 'web3';

function makeCM(_m: number, _r: number) {
    let a = Web3.utils.keccak256(
        Web3.utils.encodePacked({ value: _m, type: 'uint8' }, { value: numberToBytes32(_r), type: 'bytes32' })
    );
    return a;
}

export function numberToBytes32(num: number) {
    // 숫자를 16진수로 변환하고, 앞에 0x를 추가합니다.
    let hex = num.toString(16);

    // bytes32는 32바이트이므로, 64자리 16진수 문자열이 필요합니다.
    // 남는 공간을 0으로 채웁니다.
    while (hex.length < 64) {
        hex = '0' + hex;
    }

    // 최종적으로 '0x' 접두어를 붙여 반환합니다.
    return '0x' + hex;
}

export default makeCM;
