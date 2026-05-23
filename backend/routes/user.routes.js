const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.use(auth);

router.get('/', role('admin'), userController.getUsers);
router.put('/:id/role', role('admin'), userController.updateUserRole);

module.exports = router;
