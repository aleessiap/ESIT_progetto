const express = require('express')
const router = express.Router()
const accessController = require('../controllers/access')

router.get('/', accessController.getAllAccess);
router.get('/:_id', accessController.getAccess);
router.get('/door/:_id', accessController.getAccessByDoorId);
router.get('/door/:door_id/:user_id', accessController.getAccessByDoorIdAndUserId);
router.post('/', accessController.insertAccess);
router.put('/', accessController.updateAccess);
router.delete('/:_id', accessController.deleteAccess);

module.exports = router;
