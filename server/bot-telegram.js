const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/user');

// Cryptographic functions
const {generateRandomPassword} = require('./passwd')
const {createHash} = require('./passwd')
const {ALL_CHARS} = require('./passwd')

// Load the api token for telegram
const conf = require('../config')
const TELEGRAM_TOKEN = conf['BOT_TELEGRAM_API_TOKEN'];

// Connect to Bot instance
bot = new TelegramBot(TELEGRAM_TOKEN, {polling:true});

// Define /help command behavior
bot.onText(/\/help/, (msg) =>{

  let chat_id = msg.chat.id;

  // Show available commands
  bot.sendMessage(chat_id, 'Comandi disponibili:\n/help\n/register')

})

// Define /start command behavior
bot.onText(/\/start/, (msg) => {

  // Get user info
  let chat_id = msg.chat.id;
  let username = msg.chat.username;

  // Search the user using the chat id
  User.findOne({chat_id: chat_id}, (err, doc) => {

    if (err) {

      // Send error message to user
      bot.sendMessage(chat_id, err.message).then().catch()

    } else {

      if (doc) {

        // If the user was found, warn the user that he/she is already registered
        bot.sendMessage(chat_id, 'Benvenuto ' + username + ' nell\'app ESIT!\nSei gia registrato con username: ' + doc.username + '\nUsa il comando /help per ulteriori informazioni').then().catch();

      } else {

        // User not found. Warn the user that he have to register.
        bot.sendMessage(chat_id, 'Benvenuto ' + username + ' nell\'app ESIT!\nUsa il comando \/register per registrarti\nUsa il comando /help per ulteriori informazioni')

      }

    }

  })

})

// Define /register command behavior
bot.onText(/\/register/, (msg) => {

  // Get user infos
  let chat_id = msg.chat.id;
  let username = msg.chat.username;

  // Search the user by chat_id
  User.findOne({chat_id: chat_id}, (err, doc) => {

    if (err) {

      // Send error message to user
      bot.sendMessage(chat_id, err.message).then().catch()

    } else {

      if (doc) {

        // If the user was found by chat id he is already registered.
        bot.sendMessage(chat_id, 'Errore!\nSei gia registrato con username: ' + doc.username).then().catch();

      } else {

        // The user was not found! search the user again by username
        User.findOne({username: username}, (err1, doc1) => {

          if (err1) {

            // Send error message to user
            bot.sendMessage(chat_id, err1.message).then().catch();

          } else {

            if (doc1) {

              // Create a password for the user
              let password = generateRandomPassword(6, ALL_CHARS)
              doc1.chat_id = chat_id

              // Store the hash of the generated password
              doc1.password = createHash('sha256').update(password).digest('base64')

              // Update user found info (add chat_id and password fields)
              User.findByIdAndUpdate(doc1._id, doc1, {useFindAndModify: false}, (err2) => {

                if(err2){

                  // Send error message to user
                  bot.sendMessage(chat_id, err2.message).then().catch();

                } else {

                  // Notify the correct registration
                  bot.sendMessage(chat_id, 'Sei registrato!\nUsa la tua username/email e questa password per fare il login alla web app:\n' + password).then().catch();

                }

              })

            } else {

              // The username is not registered in the db
              bot.sendMessage(chat_id, 'Errore!\nNon esiste un utente con username: ' + username).then().catch();

            }

          }

        })

      }

    }

  })

});

// Exports
module.exports = bot;
