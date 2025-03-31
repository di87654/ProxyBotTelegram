# ProxyBotTelegram

ProxyBotTelegram is a Telegram bot that automatically updates and shares free proxy lists from various sources.

## 🚀 Features
- Fetch proxy lists from multiple public sources.
- Automatically updates proxies every 20 minutes.
- Categorizes proxies into HTTP, SOCKS4, and SOCKS5.
- Analyzes IP addresses to determine proxy locations.
- Sends proxy lists directly to a Telegram channel.
- You can replace the APIs there with your own if you have better ones
- If so, feel free to update the code and share it with the community for greater awareness.
## 🛠 Technologies Used
- Node.js
- node-telegram-bot-api
- axios
- fs
- geoip-lite

## 📌 Installation
1. Install Node.js (if not already installed):
   ```sh
   sudo apt update && sudo apt install nodejs npm -y
   ```
2. Clone this repository:
   ```sh
   git clone https://github.com/Thuankobtcode/ProxyBotTelegram
   cd ProxyBotTelegram
   ```
3. Install required dependencies:
   ```sh
   npm install
   ```
4. Configure the bot by replacing `BOT_TOKEN` and `CHANNEL_ID` in the `index.js` file.

## ▶️ Running the Bot
```sh
node index.js
```

## 📌 Notes
- Ensure that your bot has permission to send messages and documents to the Telegram channel.
- You can adjust the proxy update interval in `setInterval(sendProxiesToChannel, 1200000);`.

![image](https://github.com/user-attachments/assets/77b9336e-351a-4874-87b8-b1c3876fb177)

