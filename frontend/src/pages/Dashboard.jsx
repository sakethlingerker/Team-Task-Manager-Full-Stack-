import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Clock, CheckCircle2, ListTodo, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        api.get('/tasks/dashboard'),
        api.get('/projects'),
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Dashboard...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Project Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of your team's progress</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            New Project
          </button>
        )}
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">Total Tasks</span>
            <ListTodo size={20} color="var(--primary)" />
          </div>
          <div className="stat-value">{stats?.totalTasks || 0}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">Done</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div className="stat-value">{stats?.statusCounts?.done || 0}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">In Progress</span>
            <Clock size={20} color="var(--warning)" />
          </div>
          <div className="stat-value">{stats?.statusCounts?.['in-progress'] || 0}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">Overdue</span>
            <AlertCircle size={20} color="var(--danger)" />
          </div>
          <div className="stat-value" style={{ color: stats?.overdueTasks > 0 ? 'var(--danger)' : 'inherit' }}>
            {stats?.overdueTasks || 0}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="task-card" style={{ display: 'block' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {project.description.substring(0, 100)}...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Created by {project.createdBy?.name}
              </span>
              <span className="badge" style={{ background: '#f3f4f6' }}>
                {project.members?.length || 1} members
              </span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No projects found. Create one to get started!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
