import fs from "fs";
import yaml from "js-yaml";
import fetch from "node-fetch";

const messages = yaml.load(fs.readFileSync("bed_bot_messages.yml", "utf8")).messages;
const stateFile = "state.json";

let state = {};
if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
}

function eligible(msg) {
  const last = state[msg.id] || 0;
  const hours = (Date.now() - last) / (1000 * 60 * 60);
  return hours >= (msg.cooldown_hours || 0);
}

function weightedPick(list) {
  const total = list.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const m of list) {
    if ((r -= m.weight) <= 0) return m;
  }
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
}

async function main() {
  const eligibleMessages = messages.filter(eligible);
  if (eligibleMessages.length === 0) return;

  const msg = weightedPick(eligibleMessages);
  await sendTelegram(msg.text);

  state[msg.id] = Date.now();
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

main();
