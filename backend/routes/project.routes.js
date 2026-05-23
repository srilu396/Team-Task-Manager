const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.use(auth);

router.get('/', projectController.getProjects);
router.post('/', role('admin'), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', role('admin'), projectController.updateProject);
router.delete('/:id', role('admin'), projectController.deleteProject);
router.post('/:id/members', role('admin'), projectController.addMember);
router.delete('/:id/members/:userId', role('admin'), projectController.removeMember);

module.exports = router;
