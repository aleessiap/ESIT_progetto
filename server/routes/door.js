const express = require('express')
const router = express.Router()
const doorController = require('../controllers/door')


router.delete('/:_id', doorController.deleteDoor);
router.get('/', doorController.getAllDoors);
router.get('/user/:_id', doorController.getDoorsByUserId);
router.get('/:_id', doorController.getDoor);
router.post('/', doorController.insertDoor);
router.put('/', doorController.updateDoor);
router.get('/search/:name', doorController.searchDoor);

module.exports = router;
