const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const upload = require('../middleware/upload.middleware');

router.use(auth);

router.put('/profile', userController.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), userController.uploadAvatar);
router.get('/', role('admin'), userController.getUsers);
router.put('/:id/role', role('admin'), userController.updateUserRole);

module.exports = router;
