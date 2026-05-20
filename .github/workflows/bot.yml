name: BED Telegram Autoposter

on:
  schedule:
    - cron: "*/30 * * * *"   # runs every 30 minutes
  workflow_dispatch:

jobs:
  send:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install
        working-directory: ./bed-telegram-bot

      - name: Run autoposter
        run: node bot.js
        working-directory: ./bed-telegram-bot
        env:
          TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
