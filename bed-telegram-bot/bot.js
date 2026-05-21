const fs = require("fs");
const yaml = require("js-yaml");
const TelegramBot = require("node-telegram-bot-api");

// MUST specify polling: false for GitHub Actions
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

function getRandomMessage() {
  const file = yaml.load(fs.readFileSync("bed_bot_messages.yml", "utf8"));
  const messages = file.messages;
  return messages[Math.floor(Math.random() * messages.length)];
}

async function autopost() {
  try {
    const msg = getRandomMessage();

    console.log("Loaded message:", msg);

    await bot.sendMessage(process.env.CHAT_ID, msg.text);

    console.log("Message sent successfully.");
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

autopost();
