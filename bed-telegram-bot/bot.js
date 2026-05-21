import fs from "fs";
import yaml from "js-yaml";

// Load messages
const messages = yaml.load(fs.readFileSync("bed_bot_messages.yml", "utf8")).messages;
const stateFile = "state.json";

// Load cooldown state
let state = {};
if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
}

// Check cooldown eligibility
function eligible(msg) {
  const last = state[msg.id] || 0;
  const hours = (Date.now() - last) / (1000 * 60 * 60);
  return hours >= (msg.cooldown_hours || 0);
}

// Weighted random selection
function weightedPick(list) {
  const total = list.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const m of list) {
    if ((r -= m.weight) <= 0) return m;
  }
}

// Time‑of‑day → category mapping
function getCategoryForTime() {
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 12) return "intro";      // Morning
  if (hour >= 12 && hour < 17) return "mission";   // Mid‑day
  if (hour >= 17 && hour < 22) return "research";  // Evening
  return "meta";                                   // Night fallback
}

// Send message to Telegram
async function sendTelegram(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
      // No parse_mode to avoid Markdown issues
    })
  });
}

async function main() {
  const category = getCategoryForTime();

  // Filter by category + cooldown
  let eligibleMessages = messages.filter(
    (m) => m.category === category && eligible(m)
  );

  // If none available, fallback to ANY eligible message
  if (eligibleMessages.length === 0) {
    eligibleMessages = messages.filter(eligible);
  }

  // If still none, exit silently
  if (eligibleMessages.length === 0) return;

  // Pick message
  const msg = weightedPick(eligibleMessages);

  // Send it
  await sendTelegram(msg.text);

  // Update cooldown state
  state[msg.id] = Date.now();
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

main();
