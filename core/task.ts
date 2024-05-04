import config from "../config.json";
import { ethers } from 'ethers';

import WETH from "../contracts/weth";
import SyncSwap from "../contracts/syncswap";
import { delay, getRandomAmount, getRandomTimeInterval } from "../utils/local";

async function doTasks() {
    const tasks = [
        batchWrapETH,
        batchSyncSwap,
    ]

    tasks.sort(() => Math.random() - 0.5); // shuffle

    for (const task of tasks) {
        const privateKeys = config.privateKeys;
        const provider = new ethers.JsonRpcProvider(config.rpcURL);

        for (const privateKey of privateKeys) {
            let requireInterupt = false;

            const signer = new ethers.Wallet(privateKey, provider);
            let currentBalance = ethers.formatEther(await provider.getBalance(signer.address));

            console.log(`### Running task: ${task.name}`);
            console.log(`### Private key: ${privateKey.slice(0, 4)}...${privateKey.slice(-4)}`);
            console.log(`### Address: ${signer.address}`);
            console.log(`### Balance: ${currentBalance} ETH\n`);

            let amount = config.amount;

            if (config.useRandomAmount) {
                amount = getRandomAmount();
                console.log(`### Use random amount: ${amount} ETH\n`);
            } else {
                console.log(`### Use fixed amount: ${amount} ETH\n`);
            }

            requireInterupt = await task(signer, amount);

            if (requireInterupt) {
                console.error("Something went wrong. Task queue is interrupted.");
                continue;
            }

            currentBalance = ethers.formatEther(await provider.getBalance(signer.address));
            console.log(`### After the task, Balance: ${currentBalance} ETH\n`);
        }
    }
}

async function batchWrapETH(signer: ethers.Wallet, amount: number): Promise<boolean> {
    console.log("### Start to wrap ETH.");
    const holdedWETHValue = await WETH.deposit(signer, ethers.parseEther(amount.toString()));

    if (holdedWETHValue === BigInt(-1)) {
        console.error("Failed to wrap ETH.");
        console.error("Please check your address balance is enough to excute the contract call and pay gas fee.");
        return true;
    }

    let delaySeconds = getRandomTimeInterval();
    console.log("The task has been done. Waiting for " + delaySeconds + " seconds.");
    await delay(delaySeconds * 1000);

    console.log("### Start to unwrap ETH.");
    const holdedETHValue = await WETH.withdraw(signer, holdedWETHValue);

    if (holdedETHValue === BigInt(-1)) {
        console.error("Failed to unwrap ETH.");
        console.error("Please check your address balance is enough to excute the contract call and pay gas fee.");
        return true;
    }

    delaySeconds = getRandomTimeInterval();
    console.log("The task has been done. Waiting for " + delaySeconds + " seconds.");
    await delay(delaySeconds * 1000);

    return false;
}

async function batchSyncSwap(signer: ethers.Wallet, amount: number): Promise<boolean> {
    console.log("### Start to swap ETH for USDC.");
    const holdedUSDCValue = await SyncSwap.swapETHForUSDC(signer, ethers.parseEther(amount.toString()));

    if (holdedUSDCValue === BigInt(-1)) {
        console.error("Failed to swap ETH for USDC.");
        console.error("Please check your address balance is enough to excute the contract call and pay gas fee.");
        return true;
    }

    let delaySeconds = getRandomTimeInterval();
    console.log("The task has been done. Waiting for " + delaySeconds + " seconds.");
    await delay(delaySeconds * 1000);

    console.log("### Start to swap USDC for ETH.");
    const holdedETHValue = await SyncSwap.swapUSDCForETH(signer, holdedUSDCValue);

    if (holdedETHValue === BigInt(-1)) {
        console.error("Failed to swap USDC for ETH.");
        console.error("Please check your address balance is enough to excute the contract call and pay gas fee.");
        return true;
    }

    delaySeconds = getRandomTimeInterval();
    console.log("The task has been done. Waiting for " + delaySeconds + " seconds.");
    await delay(delaySeconds * 1000);

    return false;
}

export default doTasks;