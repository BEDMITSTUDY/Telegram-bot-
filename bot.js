import fs from "fs";
import yaml from "js-yaml";
import axios from "axios";

// === CONFIG ===
const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID_1;

// === LOAD YAML ===
const file = yaml.load(fs.readFileSync("./bed-telegram-bot/bot.yaml", "utf8"));
const messages = file.messages;

// === PICK RANDOM MESSAGE ===
const random = messages[Math.floor(Math.random() * messages.length)];
const text = random.text;

// === SEND TO TELEGRAM ===
async function sendMessage() {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "HTML"
    });

    console.log("Message sent:", random.id);
  } catch (err) {
    console.error("Error sending message:", err.response?.data || err);
  }
}

sendMessage();
