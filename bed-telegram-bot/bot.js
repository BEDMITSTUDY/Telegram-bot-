const fs = require("fs");
const yaml = require("js-yaml");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

function getRandomMessage() {
  const file = yaml.load(fs.readFileSync("bed_bot_messages.yml", "utf8"));
  const messages = file.messages;
  return messages[Math.floor(Math.random() * messages.length)];
}

async function autopost() {
  try {
    const msg = getRandomMessage();
    await bot.sendMessage(process.env.CHAT_ID, msg);
    console.log("Message sent:", msg);
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

autopost();
