const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getProjectTasks = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(tasks);
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Admin)
const createTask = async (req, res) => {
  const { title, description, status, dueDate, projectId, assignedTo } = req.body;

  if (!title || !description || !projectId) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Only project creator or members can create tasks? 
  // User request: Admin can assign tasks.
  if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Only admins can create tasks' });
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    dueDate,
    project: projectId,
    assignedTo,
    createdBy: req.user.id,
  });

  res.status(201).json(task);
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { status, assignedTo, title, description, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Check if user is project member or creator or assigned user
  const project = await Project.findById(task.project);
  if (!project.members.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Update fields
  if (status) task.status = status;
  if (assignedTo && req.user.role === 'Admin') task.assignedTo = assignedTo;
  if (title && req.user.role === 'Admin') task.title = title;
  if (description && req.user.role === 'Admin') task.description = description;
  if (dueDate && req.user.role === 'Admin') task.dueDate = dueDate;

  const updatedTask = await task.save();
  res.status(200).json(updatedTask);
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  // Get tasks where user is involved
  const userProjects = await Project.find({
    $or: [{ createdBy: req.user.id }, { members: req.user.id }],
  }).select('_id');

  const projectIds = userProjects.map(p => p._id);

  const tasks = await Task.find({ project: { $in: projectIds } });

  const totalTasks = tasks.length;
  const statusCounts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const overdueTasks = tasks.filter(t => 
    t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  res.status(200).json({
    totalTasks,
    statusCounts,
    overdueTasks,
    recentTasks: tasks.slice(-5).reverse()
  });
};

module.exports = {
  getProjectTasks,
  createTask,
  updateTask,
  getDashboardStats,
};
