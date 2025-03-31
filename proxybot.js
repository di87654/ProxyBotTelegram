const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const geoip = require('geoip-lite');

const BOT_TOKEN = 'BOT';
const CHANNEL_ID = '-ID CHANNEL OF GROUP';  

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const proxy_sources = {
    "http": {
        "filename": "http.txt",
        "urls": [
 
            "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all",
            "https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/http.txt",
            "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
            "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/https.txt",
            "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt",
            "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt",
            "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt",
            "https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt",
            "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt",
            "https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt",
        ]
    },
    "socks5": {
        "filename": "socks5.txt",
        "urls": [
            "https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt",
            "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt",
            "https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/socks5.txt",
            "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt",
            "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/socks5.txt",
            "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/socks5.txt",
            "https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt",
            "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks5/socks5.txt",
            "https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.txt",
            "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt"
    
        ]
    },
    "socks4": {
        "filename": "socks4.txt",
        "urls": [
            "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000&country=all&ssl=all&anonymity=all",
            "https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt",
            "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks4.txt",
            "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/socks4.txt",
            "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/socks4.txt",
            "https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks4.txt",
            "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks4/socks4.txt",
            "https://sunny9577.github.io/proxy-scraper/generated/socks4_proxies.txt",
            "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt"

        ]
    }
};

async function fetchProxies(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 });
        return response.data.split("\n").filter(line => line.trim() !== "");
    } catch (error) {
        return [];
    }
}

function getCountry(ip) {
    const geo = geoip.lookup(ip);
    return geo ? geo.country : "UNKNOWN";
}

async function updateProxies() {
    console.log("🔄 Updating proxy...");
    let allProxies = [];
    let countryCount = {};

    for (const type in proxy_sources) {
        const sources = proxy_sources[type]; 
        if (sources && Array.isArray(sources.urls)) { // Check if sources exist and have valid urls
            for (const url of sources.urls) {
                const newProxies = await fetchProxies(url);
                for (const proxy of newProxies) {
                    let ip = proxy.split(":")[0];
                    let country = getCountry(ip);
                    countryCount[country] = (countryCount[country] || 0) + 1;
                }
                allProxies = allProxies.concat(newProxies);
            }
        } else {
            console.error(`❌ Error: Unable to get list of URLs from source ${type}`);
        }
    }

    allProxies = [...new Set(allProxies)]; // Remove duplicates
    fs.writeFileSync("PROXY_FREE.txt", allProxies.join("\n"));

    // Tìm quốc gia có nhiều proxy nhất
    let topCountry = Object.entries(countryCount).sort((a, b) => b[1] - a[1])[0] || ["UNKNOWN", 0];

    return { total: allProxies.length, topCountry };
}
async function sendProxiesToChannel() {
    let { total, topCountry } = await updateProxies();

    if (total > 0) {
        await bot.sendDocument(CHANNEL_ID, "PROXY_ZUKAX.txt", {
            caption: `🚀 *FREE PROXY * 🚀\n📌 *Total:* ${total}\n🌍 *Top Country:* ${topCountry[0]} \n\n🌍 `,
            parse_mode: "Markdown"
        });
    }
}

setInterval(sendProxiesToChannel, 1200000);
sendProxiesToChannel();

console.log("Bot start ");
