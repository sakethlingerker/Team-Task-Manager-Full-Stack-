const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects (where user is member or creator)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ createdBy: req.user.id }, { members: req.user.id }],
  }).populate('createdBy', 'name email');

  res.status(200).json(projects);
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: [req.user.id],
  });

  res.status(201).json(project);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email role');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is member or creator
  if (
    project.createdBy.toString() !== req.user.id &&
    !project.members.some((m) => m._id.toString() === req.user.id)
  ) {
    return res.status(403).json({ message: 'User not authorized' });
  }

  res.status(200).json(project);
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin)
const addMember = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized as creator' });
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (project.members.includes(userToAdd._id)) {
    return res.status(400).json({ message: 'User already in project' });
  }

  project.members.push(userToAdd._id);
  await project.save();

  res.status(200).json(project);
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  addMember,
};
