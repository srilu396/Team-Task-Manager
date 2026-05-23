const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.use(auth);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', role('admin'), taskController.deleteTask);
router.post('/:id/comments', taskController.addComment);
router.get('/:id/comments', taskController.getComments);

module.exports = router;
