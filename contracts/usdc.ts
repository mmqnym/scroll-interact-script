import { ethers } from 'ethers';
import config from "../config.json";
import { usdcContractABI } from "../abis/usdc";

const USDC = {
    async allowance(provider: ethers.JsonRpcProvider, owner: string, spender: string): Promise<bigint> {
        const contract = new ethers.Contract(config.usdcContract, usdcContractABI, provider);
        const allowance = await contract.allowance(owner, spender);
        return allowance;
    },

    async approve(signer: ethers.Wallet, spender: string, value: bigint): Promise<boolean> {
        const contract = new ethers.Contract(config.usdcContract, usdcContractABI, signer);

        try {
            const tx = await contract.approve(spender, value);
            console.log(`Pending: https://scrollscan.com/tx/${tx.hash}`);
            await tx.wait();
            console.log(`Confirmed`);
            return true;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    },

    async getBalance(provider: ethers.JsonRpcProvider, address: string): Promise<bigint> {
        const contract = new ethers.Contract(config.usdcContract, usdcContractABI, provider);
        const balance = await contract.balanceOf(address);
        return balance;
    },

};

export default USDC;