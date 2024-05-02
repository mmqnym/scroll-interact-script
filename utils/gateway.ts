import config from "../config.json";

const CoinMarketCap = {
    async getPrice(ticker: string): Promise<number> {
        try {
            const res = await fetch(
                "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?" + 
                `symbol=${ticker}&CMC_PRO_API_KEY=${config.coinMarketsCapApiKey}`);

            const data = await res.json();

            const price = data?.data?.[ticker]?.[0]?.quote?.USD?.price ?? -1;
            return price;
        } catch (error) {
            console.error(error);
            return -1;
        }
    }
};

export { CoinMarketCap }