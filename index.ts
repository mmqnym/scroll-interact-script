import { exit } from "process";
import config from "./config.json";
import doTasks from "./core/task";

function configCheck(): boolean {
    // Check private keys
    if (!config.privateKeys || config.privateKeys.length === 0) {
        console.error("No private keys provided.");
        return false;
    }

    // Check repeat count
    if (!config.repeatCount || config.repeatCount <= 0) {
        console.error("Invalid repeat count provided.");
        return false;
    }

    // Check input amount
    if (!config.amount || config.amount <= 0) {
        console.error("Invalid amount provided.");
        return false;
    }

    // Check random amount
    if (config.useRandomAmount && 
        (config.randomAmountMin <= 0 ||
         config.randomAmountMax <= 0) ||
         (config.randomAmountMax - config.randomAmountMin) < 0.001 ) {
        console.error("Invalid random amount provided.");
        return false;
    }

    // Check tx interval
    if (!config.txIntervalMin || !config.txIntervalMax || config.txIntervalMax < config.txIntervalMin) {
        console.error("Invalid tx interval provided.");
        return false;
    }

    // Check RPC URL
    if (!config.rpcURL || config.rpcURL.length === 0) {
        console.error("No RPC URL provided.");
        return false;
    }


    // Check contracts
    if (!config.syncswapRouterContract || !config.wethContract || !config.usdcContract) {
        console.error("No contracts provided.");
        return false;
    }

    return true;
}

async function main() {
    const res = configCheck();
    
    if (!res) {
        exit(1);
    }

    console.log("### Precheck OK.");
    console.log("### The tasks will be executed [" + config.repeatCount + "] times.");

    for (let i = 0; i < config.repeatCount; i++) {
        console.log("### The repeatation [" + (i + 1) + "] is about to start.");
        await doTasks();
    }
    console.log("### The batch has been done.");
}

main()