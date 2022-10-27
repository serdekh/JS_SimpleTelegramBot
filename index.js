const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, retryGameOptions } = require('./options')
const token = "5657473375:AAEjHMH2OVHfK7KzQoV7qKRxrHvEMXXqFMc";

const bot = new TelegramApi(token, { polling: true });

const chats = {}

const startGuessNumberGame = async (chatId) => {
  await bot.sendMessage(chatId, "I'm going to create a number from 0 to 10. Guess which one!")
  const rand = Math.floor(Math.random() * 10)
  chats[chatId] = rand
  await bot.sendMessage(chatId, "Write a number...", gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "greeting user" },
    { command: "/get_info", description: "get information of chat id and your account" },
    { command: "/play_game", description: "guess number that bot generated" }
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/051/930/051930eb-7332-45f9-a866-268b0631c48e/3.webp");
      return bot.sendMessage(chatId, "Hi! Nice to see you! Let's get started!");
    }

    if (text === "/get_info") {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}\n\nYou can be called by @${msg.from.username}\n\nYour chat id is ${chatId}`);
    }

    if (text === "/play_game") {
      startGuessNumberGame(chatId)
    }

    return bot.sendMessage(chatId, "I don't understand you :(\n\nTry another command!")
  })

  bot.on('callback_query', async (msg) => {
    const text = msg.data
    const chatId = msg.message.chat.id

    if (text === "/retry_game") {
      return startGuessNumberGame(chatId)
    }
    if (text == chats[chatId]) {
      await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/051/930/051930eb-7332-45f9-a866-268b0631c48e/1.webp")
      return await bot.sendMessage(chatId, `Congrats! You guessed the number ${chats[chatId]}`, retryGameOptions)
    }
    else {
      await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/051/930/051930eb-7332-45f9-a866-268b0631c48e/12.webp")
      return await bot.sendMessage(chatId, `Sorry bro, you didn't guess. The number was ${chats[chatId]} :(\nTry again!`, retryGameOptions)
    }
  })
}

start()