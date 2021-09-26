const express = require('express')
const router = express.Router()
const doorController = require('../controllers/door')

// Door routes
router.delete('/:_id', doorController.deleteDoor);
router.get('/', doorController.getAllDoors);
router.get('/user/:_id', doorController.getDoorsByUserId);
router.get('/:_id', doorController.getDoor);
router.post('/', doorController.insertDoor);
router.post('/lock', doorController.lockDoor);
router.post('/unlock', doorController.unlockDoor);
router.put('/', doorController.updateDoor);
router.get('/search/:name', doorController.searchDoor);
router.get('/search/:name/:user_id', doorController.searchDoorByUserId);

module.exports = router;
