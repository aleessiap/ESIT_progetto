const express = require("express");
const router = express.Router();
const User = require('../controllers/users');


router.get('/', User.getUsers);
router.post('/access', User.login);
router.post('/add-user', User.register);

module.exports=router;
