const express = require('express')
const router = express.Router()
const authorizationController = require('../controllers/authorization')

router.get('/authorizations', authorizationController.getAllAuthorizations);
router.get('/authorizations/denied', authorizationController.getAllNotAuthorized);
router.get('/authorizations/:name', authorizationController.getAuthorizations);
router.get('/authorizations/denied/:name', authorizationController.getNotAuthorized);
router.post('/authorizations', authorizationController.insertAuthorizations);
router.put('/authorizations', authorizationController.updateAuthorization);
router.delete('/authorizations/:name/:pin', authorizationController.deleteAuthorization);

module.exports = router
