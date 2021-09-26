const express = require('express')
const router = express.Router()
const authorizationController = require('../controllers/authorization')

// Authorization routes
router.get('/', authorizationController.getAllAuthorizations);
router.get('/denied', authorizationController.getAllNotAuthorized);
router.get('/:_id', authorizationController.getAuthorizations);
router.get('/denied/:_id', authorizationController.getNotAuthorized);
router.post('/', authorizationController.insertAuthorization);
router.put('/', authorizationController.updateAuthorization);
router.delete('/:door_id/:user_id', authorizationController.deleteAuthorization);

module.exports = router
