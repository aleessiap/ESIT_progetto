const express = require("express");
const router = express.Router();
const User = require('../controllers/users');

router.get('/get-users', User.getUsers);
router.post('/login', User.login);
router.post('/add-user', User.register);

module.exports=router;
