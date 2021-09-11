const {createHash} = require("crypto");
const {randomBytes} = require("crypto");

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

module.exports.createHash = createHash
module.exports.generateRandomPassword = generateRandomPassword
module.exports.LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // 26 chars
module.exports.UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 26 chars
module.exports.NUMBERS = '0123456789'; // 10 chars
module.exports.SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()'; // 32 chars
module.exports.ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS; // 62 chars
module.exports.ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars
