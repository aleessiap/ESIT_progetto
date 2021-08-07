const express = require('express')
const router = express.Router()
const doorController = require('../controllers/door')

router.get('/doors', doorController.getAllDoor);
router.get('/doors/:name', doorController.getDoor);
router.post('/doors', doorController.insertDoor);
router.put('/doors/:name', doorController.updateDoor);
router.delete('/doors/:name', doorController.deleteDoor);

module.exports = router
