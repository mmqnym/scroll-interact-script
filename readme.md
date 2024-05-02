### Scroll Bridge Script

這是 Scroll 官方橋的自動化跨鏈腳本

**請先修改設定檔再執行。以下為設定檔說明，單位都是以太：**

```json
{
  "privateKeys": [
    "" // 填入你的私鑰，如果要添加更多，就是在每行後面放個, 然後跨行打 "新私鑰"
  ],
  "amount": 0.01, // 填入你要跨的數量
  "randomAmount": false, // 如果設為 true，每個地址將會跨不同數量的以太到 Scroll
  "randomAmountMin": 0.01, // 隨機發送數量最小值
  "randomAmountMax": 0.1, // 隨機發送數量最大值
  "rpcURL": "", // 你的rpc url，懶得用 alchemy 或 infura 可以用公共的
  "advance": {
    "scrollGasFee": 0.0001 // 用於讓 Scroll 上的官橋合約發送給你的地址的 gas 費，多的會退，建議不要動或去看網頁上的顯示後再改
  }
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
     - 輸入 `docker build -t "scroll-bridge-script:v1.0" .`
     - 輸入 `docker run --name scroll-bridge-script scroll-bridge-script:v1.0`
     - ※你可以在 docker desktop 上的 container 看到運行中的腳本，運行完畢後可以在該處刪除，請務必刪除，以避免下次使用腳本時發生讀到舊資料的問題。

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
