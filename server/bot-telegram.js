const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/user');
const {generateRandomPassword} = require('./passwd')
const {createHash} = require('./passwd')
const {ALL_CHARS} = require('./passwd')

const conf = require('../config')

const TELEGRAM_TOKEN = conf['BOT_TELEGRAM_API_TOKEN'];

bot = new TelegramBot(TELEGRAM_TOKEN, {polling:true});

bot.onText(/\/help/, (msg) =>{

  let chat_id = msg.chat.id;

  bot.sendMessage(chat_id, 'Comandi disponibili:\n/help\n/register')

})

bot.onText(/\/start/, (msg) => {

  let chat_id = msg.chat.id;
  let username = msg.chat.username;

  User.findOne({chat_id: chat_id}, (err, doc) => {

    if (err) {

      bot.sendMessage(chat_id, err.message).then().catch()

    } else {

      if (doc) {

        bot.sendMessage(chat_id, 'Benvenuto ' + username + ' nell\'app ESIT!\nSei gia registrato con username: ' + doc.username + '\nUsa il comando /help per ulteriori informazioni').then().catch();

      } else {

        bot.sendMessage(chat_id, 'Benvenuto ' + username + ' nell\'app ESIT!\nUsa il comando \/register per registrarti\nUsa il comando /help per ulteriori informazioni')

      }

    }

  })

})


bot.onText(/\/register/, (msg) => {

  let chat_id = msg.chat.id;
  let username = msg.chat.username;

  User.findOne({chat_id: chat_id}, (err, doc) => {

    if (err) {

      bot.sendMessage(chat_id, err.message).then().catch()

    } else {

      if (doc) {

        bot.sendMessage(chat_id, 'Errore!\nSei gia registrato con username: ' + doc.username).then().catch();

      } else {

        User.findOne({username: username}, (err1, doc1) => {

          if (err1) {

            bot.sendMessage(chat_id, err1.message).then().catch();

          } else {

            if (doc1) {

              let password = generateRandomPassword(6, ALL_CHARS)
              doc1.chat_id = chat_id
              doc1.password = createHash('sha256').update(password).digest('base64')

              User.findByIdAndUpdate(doc1._id, doc1, {useFindAndModify: false}, (err2) => {

                if(err2){

                  bot.sendMessage(chat_id, err2.message).then().catch();

                } else {

                  bot.sendMessage(chat_id, 'Sei registrato!\nUsa la tua username/email e questa password per fare il login alla web app:\n' + password).then().catch();

                }

              })

            } else {

              bot.sendMessage(chat_id, 'Errore!\nNon esiste un utente con username: ' + username).then().catch();

            }

          }

        })

      }

    }

  })

});

module.exports = bot;
