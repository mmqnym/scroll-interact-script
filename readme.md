### Scroll Interact Script

這是 Scroll 鏈上的自動化交互腳本

**請先修改設定檔再執行。以下為設定檔說明，金額單位都是以太：**
把 `example_config.json` 的 `example_` 刪掉，再更改下面設定的數值。
※ // ... 是註解，請不要在你的設定中加入這些東西，JSON 檔案本身不能有註解，這個只是用於說明。

```json
{
  "privateKeys": [
    "YOUR_PRIVATE_KEY_HERE" // 填入你的私鑰，如果要添加更多，就是在每行後面放個, 然後跨行打 "新私鑰"
  ],
  "repeatCount": 3, // 整輪任務（所有私鑰跑一輪）重複執行的次數
  "amount": 0.01, // 填入你每筆交易要使用的以太數量
  "useRandomAmount": false, // 如果設為 true，每筆交易會使用不同的以太數量，數量介於下面兩個數值之間
  "randomAmountMin": 0.02, // 隨機以太數量最小值
  "randomAmountMax": 0.05, // 隨機以太數量最大值
  "txIntervalMin": 60, // 每筆交易的間隔時間最小值，以秒為單位
  "txIntervalMax": 200, // 每筆交易的間隔時間最大值，以秒為單位
  "rpcURL": "https://rpc.scroll.io/",
  "coinMarketsCapApiKey": "", // 你的 CoinMarketCap API KEY
  "syncswapRouterContract": "0x80e38291e06339d10aab483c65695d004dbd5c69",
  "wethContract": "0x5300000000000000000000000000000000000004",
  "usdcContract": "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4"
}
```

運行方式可以使用 node 或是 docker（推薦）
**※再次確認你已經設置好了私鑰等資訊在設定檔中**

<br/>

- #### docker 運行方法

  1. 安裝 docker-desktop

     - 至 https://www.docker.com/products/docker-desktop/ 下載最新版
     - 一路 Next
     - 打開你的任何終端機(cmd, powershell, sh, bash, zsh, ...) 執行 `docker -v` 確認安裝是否完成

  2. 運行
     - 切到腳本目錄或在腳本目錄裡打開終端(cd `<path>`)
     - 輸入 `docker build -t "scroll-interact-script:v1.0" .`
     - 輸入 `docker run --name scroll-interact-script scroll-interact-script:v1.0`
     - ※你可以在 docker desktop 上的 `container` 看到運行中的腳本，運行完畢後可以在該處刪除，請務必刪除，以避免下次使用腳本時發生讀到舊資料的問題。
     - ※如果你變更了 `config.json` 的設定，請把 `image` 以及 `container` 都刪掉。如果只是要重跑相同設定的任務把 `container` 刪掉就可以重跑了。

<br/>

- #### node 運行方法

  1. 安裝 node

     - 至 https://nodejs.org/en/download 下載 v20.12.2(LTS)
     - 一路 Next
     - 打開你的任何終端機(cmd, powershell, sh, bash, zsh, ...) 執行 `node -v` 確認安裝是否完成
     - ※會 NVM 或 curl 或 homebrew 的自己裝

  2. 下載相關依賴包

     - 切到腳本目錄或在腳本目錄裡打開終端(cd `<path>`)
     - 打開終端執行 npm i

  3. 運行
     - 切到腳本目錄或在腳本目錄裡打開終端
     - npx ts-node index.ts
