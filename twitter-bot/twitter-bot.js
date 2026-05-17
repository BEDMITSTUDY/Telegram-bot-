import { TwitterApi } from "twitter-api-v2";
import fs from "fs";
import yaml from "js-yaml";

// Load messages
const file = yaml.load(fs.readFileSync("./twitter-bot.yaml", "utf8"));
const messages = file.messages;
const random = messages[Math.floor(Math.random() * messages.length)];
const text = random.text;

// Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function postTweet() {
  try {
    await client.v2.tweet(text);
    console.log("Tweet sent:", random.id);
  } catch (err) {
    console.error("Error sending tweet:", err);
  }
}

postTweet();
