import config from "../config.json";


/**
 * Calculates the slippage amount based on the given amount and slippage percentage.
 *
 * @param {number} amount - The amount for which the slippage is calculated.
 * @param {number} slippage - The percentage of slippage.
 * @return {bigint} The calculated slippage amount.
 */
function getSlippage(amount: number, slippage: number, decimal: number): number {
    const slippageAmount = amount * (1 - (slippage / 100));
    decimal = Math.pow(10, decimal);
    const fixedSlippageAmount = Math.round(slippageAmount * decimal) / decimal;
    return fixedSlippageAmount;
}

/**
 * Generates a random amount within the specified range defined by `config.randomAmountMin` and `config.randomAmountMax`.
 * The amount is rounded to 4 decimal places.
 *
 * @return {number} The randomly generated amount.
 */
function getRandomAmount(): number {
    const amount = Math.random() * (config.randomAmountMax - config.randomAmountMin) + config.randomAmountMin;
    const fixedAmount = Math.round(amount * 10000) / 10000; 
    return fixedAmount;
}

/**
 * Generates a random time interval within the specified range defined by `config.txIntervalMax` and `config.txIntervalMin`.
 * The unit is in seconds.
 * 
 * @return {number} The randomly generated time interval.
 */
function getRandomTimeInterval(): number {
    const interval = Math.random() * (config.txIntervalMax - config.txIntervalMin) + config.txIntervalMin;
    const fixedInterval = Math.round(interval); 
    return fixedInterval;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export { getSlippage, getRandomAmount, getRandomTimeInterval, delay };
