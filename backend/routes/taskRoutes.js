const express = require('express');
const router = express.Router();
const {
  getProjectTasks,
  createTask,
  updateTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.post('/', protect, admin, createTask);
router.put('/:id', protect, updateTask);
router.get('/project/:projectId', protect, getProjectTasks);

module.exports = router;
