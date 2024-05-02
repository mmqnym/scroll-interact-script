import { ethers } from 'ethers';
import config from "../config.json";
import { syncswapContractABI } from "../abis/syncswap";
import { CoinMarketCap } from '../utils/gateway';
import { getSlippage } from '../utils/local';
import USDC from "../contracts/usdc";


const SyncSwap = {
    async swapETHForUSDC(signer: ethers.Wallet, value: bigint): Promise<bigint> {
        const usdcBalanceOfSigner = await USDC.getBalance(new ethers.JsonRpcProvider(config.rpcURL), signer.address);

        const contract = new ethers.Contract(config.syncswapRouterContract, syncswapContractABI, signer);
        const addrParam = signer.address.slice(2)

        try {
            const paths = [
                {
                  steps: [
                    {
                      pool: '0x814A23B053FD0f102AEEda0459215C2444799C70',
                      data: `0x0000000000000000000000005300000000000000000000000000000000000004000000000000000000000000${addrParam}0000000000000000000000000000000000000000000000000000000000000002`,
                      callback: '0x0000000000000000000000000000000000000000',
                      callbackData: '0x'
                    }
                  ],
                  tokenIn: '0x0000000000000000000000000000000000000000',
                  amountIn: value
                }
            ];

            const currentETHPrice = await CoinMarketCap.getPrice("ETH");
            const swapSrcValue = currentETHPrice * Number(ethers.formatEther(value));
            const slippagePrice = getSlippage(swapSrcValue, 2, 6);
            const amountOutMin = ethers.parseUnits(slippagePrice.toString(), 6);
            const deadline = Math.floor(Date.now() / 1000) + 200 * 60; // after 200 minutes
            
            const tx = await contract.swap(paths, amountOutMin, deadline, { value: value });
            console.log(`Pending: https://scrollscan.com/tx/${tx.hash}`);
            await tx.wait();
            console.log(`Confirmed.`);

            const newUsdcBalanceOfSigner = await USDC.getBalance(new ethers.JsonRpcProvider(config.rpcURL), signer.address);
            return newUsdcBalanceOfSigner - usdcBalanceOfSigner;
        } catch (error) {
            console.error("Error:", error);
            return BigInt(-1);
        }
    },

    async swapUSDCForETH(signer: ethers.Wallet, value: bigint): Promise<bigint> {
        const provider = new ethers.JsonRpcProvider(config.rpcURL)
        const ethBalanceOfSigner = await provider.getBalance(signer.address);

        // precheck usdc allowance
        const usdcAllowance = await USDC.allowance(provider, signer.address, config.syncswapRouterContract);
        if (usdcAllowance < value) {
            console.log("The USDC allowance is not enough. Approving unlimited value...");
            const res = await USDC.approve(signer, config.syncswapRouterContract, ethers.MaxUint256);
            
            if (!res) {
                console.log("Approve failed. Interrupting...");
                return BigInt(-1);
            }
        }

        const contract = new ethers.Contract(config.syncswapRouterContract, syncswapContractABI, signer);
        const addrParam = signer.address.slice(2)

        try {
            const paths = [
                {
                  steps: [
                    {
                      pool: '0x814A23B053FD0f102AEEda0459215C2444799C70',
                      data: `0x00000000000000000000000006efdbff2a14a7c8e15944d1f4a48f9f95f663a4000000000000000000000000${addrParam}0000000000000000000000000000000000000000000000000000000000000001`,
                      callback: '0x0000000000000000000000000000000000000000',
                      callbackData: '0x'
                    }
                  ],
                  tokenIn: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
                  amountIn: value
                }
            ];

            const currentETHPrice = await CoinMarketCap.getPrice("ETH");
            const swapSrcValue = Number(ethers.formatUnits(value, 6)) / currentETHPrice;
            const slippagePrice = getSlippage(swapSrcValue, 2, 18);
            const amountOutMin = ethers.parseEther(slippagePrice.toString());
            const deadline = Math.floor(Date.now() / 1000) + 200 * 60; // after 200 minutes
            
            const tx = await contract.swap(paths, amountOutMin, deadline);
            console.log(`Pending: https://scrollscan.com/tx/${tx.hash}`);
            await tx.wait();
            console.log(`Confirmed.`);

            const newEthBalanceOfSigner = await provider.getBalance(signer.address);
            return newEthBalanceOfSigner - ethBalanceOfSigner;
        } catch (error) {
            console.error("Error:", error);
            return BigInt(-1);
        }
    },
};

export default SyncSwap;