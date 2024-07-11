require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const token = '6522836138:AAEJuk5QQ0Wp-YdCyv5ca9cZM0uL5ombtH4';
const bot = new TelegramBot(token, { polling: true });

const getTopGainersAndLosers = async () => {
    try {
        const { data } = await axios.get('https://www.nseindia.com');
        const $ = cheerio.load(data);
        const gainers = [];
        const losers = [];

        // Scrape top gainers
        $('#tab1Ganier tbody tr').each((i, element) => {
            const name = $(element).find('td:nth-child(1)').text().trim();
            const price = $(element).find('td:nth-child(2)').text().trim();
            const change = $(element).find('td:nth-child(3)').text().trim();
            const percentChange = $(element).find('td:nth-child(4)').text().trim();
            if (name && price && change && percentChange) {
                gainers.push({ name, price, change, percentChange });
            }
        });

        // Scrape top losers
        $('#tab1Loser tbody tr').each((i, element) => {
            const name = $(element).find('td:nth-child(1)').text().trim();
            const price = $(element).find('td:nth-child(2)').text().trim();
            const change = $(element).find('td:nth-child(3)').text().trim();
            const percentChange = $(element).find('td:nth-child(4)').text().trim();
            if (name && price && change && percentChange) {
                losers.push({ name, price, change, percentChange });
            }
        });

        return { gainers: gainers.slice(0, 5), losers: losers.slice(0, 5) }; // Get top 5 gainers and losers
    } catch (error) {
        console.error('Error fetching data from NSE India:', error);
        return { gainers: [], losers: [] };
    }
};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello! Use /topgainers to get today\'s top gained stocks and /toplosers to get today\'s top lost stocks.');
});

bot.onText(/\/topgainers/, async (msg) => {
    const chatId = msg.chat.id;
    const { gainers } = await getTopGainersAndLosers();
    if (gainers.length > 0) {
        let response = 'Today\'s Top Gained Stocks:\n\n';
        gainers.forEach((gainer, index) => {
            response += `${index + 1}. ${gainer.name}\nPrice: ${gainer.price}\nChange: ${gainer.change} (${gainer.percentChange})\n\n`;
        });
        bot.sendMessage(chatId, response);
    } else {
        bot.sendMessage(chatId, 'Could not retrieve top gainers. Please try again later.');
    }
});

bot.onText(/\/toplosers/, async (msg) => {
    const chatId = msg.chat.id;
    const { losers } = await getTopGainersAndLosers();
    if (losers.length > 0) {
        let response = 'Today\'s Top Lost Stocks:\n\n';
        losers.forEach((loser, index) => {
            response += `${index + 1}. ${loser.name}\nPrice: ${loser.price}\nChange: ${loser.change} (${loser.percentChange})\n\n`;
        });
        bot.sendMessage(chatId, response);
    } else {
        bot.sendMessage(chatId, 'Could not retrieve top losers. Please try again later.');
    }
});


const url = 'https://en.wikipedia.org/wiki/Main_Page';

// Function to fetch and extract data from the website
const fetchData = async () => {
  try {
    // Fetch the HTML of the website
    const { data } = await axios.get(url);
    // Load the HTML into Cheerio
    const $ = cheerio.load(data);
      const response = 'heads:';

    // Select and extract the data
    const headlines = [];
    $('#mp-itn b a').each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline);
    });

    // Output the extracted data
    console.log('Headlines from the "In the news" section:');
    headlines.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
        response +=`${index + 1}. ${headline}\n\n`
    });

      return response;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

bot.onText(/\/head/, async (msg) => {
    const chatId = msg.chat.id;
    const heads = 'heads: ';
   const { hhh } = await fetchData();
 
      bot.sendMessage(chatId, hhh);
};
   

bot.onText(/\/up/, async (msg) => {
        const chatId = msg.chat.id;
   bot.sendMessage(chatId, 'updated 3');
});

console.log('Bot is running...');
