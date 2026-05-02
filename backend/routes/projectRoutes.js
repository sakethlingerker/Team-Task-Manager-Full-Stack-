const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  addMember,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .get(protect, getProjectById);

router.put('/:id/members', protect, admin, addMember);

module.exports = router;
