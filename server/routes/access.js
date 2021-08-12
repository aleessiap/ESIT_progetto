const express = require('express')
const router = express.Router()
const accessController = require('../controllers/access')

router.get('/access', accessController.getAllAccess);
router.get('/access/:_id', accessController.getAccess);
router.post('/access', accessController.insertAccess);
router.put('/access', accessController.updateAccess);
router.delete('/access/:_id', accessController.deleteAccess);

module.exports = router
