const TELEGRAM_TOKEN = '1843846040:AAFzUIY65WOfHObppTFAfBz4gaNVQ1MyOC8';
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/user')
const {createHash} = require("crypto");
const {randomBytes} = require("crypto");

const PASSWORD_LENGTH = 6;
const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // 26 chars
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 chars
const NUMBERS = '0123456789'; // 10 chars
const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()'; // 32 chars
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars

function generateRandomPassword(length, alphabet) {

  let rb = randomBytes(length);
  let rp = "";

  for (let i = 0; i < length; i++) {

    rb[i] = rb[i] % alphabet.length;
    rp += alphabet[rb[i]];

  }

  return rp;

}

bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/register/, (msg, match) => {

  let chat_id = msg.chat.id;
  let username = msg.chat.username;

  User.findOne({chat_id: chat_id}, (err, doc) => {

    if (err) {

      bot.sendMessage(chat_id, err.message).then().catch()

    } else {

      if (doc) {

        bot.sendMessage(chat_id, 'Error!\nYou are already registered with username: ' + doc.username).then().catch();

      } else {

        User.findOne({username: username}, (err1, doc1) => {

          if (err1) {

            bot.sendMessage(chat_id, err1.message).then().catch();

          } else {

            if (doc1) {

              let password = generateRandomPassword(PASSWORD_LENGTH, ALL_CHARS)
              doc1.chat_id = chat_id
              doc1.password = createHash('sha256').update(password).digest('base64')
              console.log(doc1.password)

              User.findByIdAndUpdate(doc1._id, doc1, {useFindAndModify: false}, (err2, doc2, res) => {

                if(err2){

                  bot.sendMessage(chat_id, err2.message).then().catch();

                } else {

                  bot.sendMessage(chat_id, 'You are registered!\nUse your username/email and this password to login to the webapp:\n' + password).then().catch();

                }

              })

            } else {

              bot.sendMessage(chat_id, 'Error!\nCan\'t find an user with username: ' + username).then().catch();

            }

          }

        })

      }

    }

  })

});

module.exports = bot;
