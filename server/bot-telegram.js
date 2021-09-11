const TELEGRAM_TOKEN = '1843846040:AAFzUIY65WOfHObppTFAfBz4gaNVQ1MyOC8';
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/user');
const {generateRandomPassword} = require('./passwd')
const {createHash} = require('./passwd')
const {ALL_CHARS} = require('./passwd')

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

              let password = generateRandomPassword(6, ALL_CHARS)
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
