const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

// User routes
router.get('/logout', userController.logout);
router.get('/get-users', userController.getUsers);
router.post('/login', userController.login);
router.post('/add-user', userController.register);
router.post('/recover-pin', userController.pinRequest);
router.post('/recover-password', userController.recoverPassword);
router.delete('/:_id', userController.deleteUser);
router.get('/:_id', userController.getUser);
router.get('/search/:name', userController.searchUser);
router.put('/', userController.modifyProfile);
router.put('/modify-password/:_id', userController.modifyPassword);

module.exports=router;
