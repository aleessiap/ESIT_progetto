const express = require("express");
const router = express.Router();
const User = require('../controllers/user');

router.get('/get-users', User.getUsers);
router.post('/login', User.login);
router.post('/add-user', User.register);
//router.post('/modify-user', User.modifyProfile);
router.delete('/:_id', User.deleteUser);
router.get('/:_id', User.getUser);
router.get('/search/:name', User.searchUser);
router.put('/', User.modifyProfile);
router.put('/modify-password/:_id', User.modifyPassword);

module.exports=router;
