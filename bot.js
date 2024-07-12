require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = '6522836138:AAEJuk5QQ0Wp-YdCyv5ca9cZM0uL5ombtH4';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const port = process.env.PORT || 3000;

const url1 = process.env.APP_URL || 'https://email-extarctor-telegram-bot.vercel.app/';
const webhookUrl = `${url1}/bot${token}`;
bot.setWebHook(webhookUrl);

// Regex for email extraction
const extractEmails = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    return text.match(emailRegex) || [];
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello! Send me a text and I will extract all the emails from it.');
});

// Handle text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text) {
        const emails = extractEmails(msg.text);
        if (emails.length > 0) {
            bot.sendMessage(chatId, `Extracted emails:\n${emails.join('\n')}`);
        } else {
            bot.sendMessage(chatId, 'No emails found.');
        }
    }
});

// Web server to keep the bot running (useful for deployment)
app.get('/', (req, res) => {
    res.send('Telegram Email Extraction Bot is running.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log('Bot is running...');
