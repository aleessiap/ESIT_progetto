const express = require('express')
const router = express.Router()
const doorController = require('../controllers/door')

router.get('/', doorController.getAllDoors);
router.get('/:_id', doorController.getDoor);
router.post('/', doorController.insertDoor);
router.put('/', doorController.updateDoor);
router.delete('/:_id', doorController.deleteDoor);

module.exports = router
