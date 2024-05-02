import { ethers } from 'ethers';
import config from "../config.json";
import { wethContractABI } from "../abis/weth";

const WETH = {
    async deposit(signer: ethers.Wallet, value: bigint): Promise<bigint> {
        const contract = new ethers.Contract(config.wethContract, wethContractABI, signer);

        try {
            const tx = await contract.deposit({ value: value, gasLimit: 51892 });
            console.log(`Pending: https://scrollscan.com/tx/${tx.hash}`);
            await tx.wait();
            console.log(`Confirmed.`);
            return BigInt(value);
        } catch (error) {
            console.error("Error:", error);
            return BigInt(-1);
        }
    },
    async withdraw(signer: ethers.Wallet, wad: bigint): Promise<bigint> {
        const contract = new ethers.Contract(config.wethContract, wethContractABI, signer);

        try {
            const tx = await contract.withdraw(wad, { gasLimit: 42789 });
            console.log(`Pending: https://scrollscan.com/tx/${tx.hash}`);
            await tx.wait();
            console.log(`Confirmed.`);
            return BigInt(wad);
        } catch (error) {
            console.error("Error:", error);
            return BigInt(-1);
        }
    }
};

export default WETH;