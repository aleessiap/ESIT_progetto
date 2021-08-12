const express = require('express')
const router = express.Router()
const authorizationController = require('../controllers/authorizations')

router.get('/authorizations', authorizationController.getAllAuthorizations);
router.get('/authorizations/:name', authorizationController.getAuthorizations);
router.post('/authorizations', authorizationController.insertAuthorizations);
router.put('/authorizations', authorizationController.updateAuthorization);
router.delete('/authorizations/:name/:pin', authorizationController.deleteAuthorization);

module.exports = router
