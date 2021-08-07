const express = require('express')
const router = express.Router()
const accessController = require('../controllers/access')

router.get('/access', accessController.getAllAccess);
router.get('/access/:id', accessController.getAccess);
router.post('/access', accessController.insertAccess);
router.put('/access/:id', accessController.updateAccess);
router.delete('/access/:id', accessController.deleteAccess);

module.exports = router
