import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching project details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
      fetchProjectData();
    } catch (err) {
      console.error('Error creating task', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Project...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{project.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {isAdmin && (
            <>
              <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                Add Task
              </button>
              <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>
                <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
                Add Member
              </button>
            </>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Tasks</h2>
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {task.description}
                  </p>
                </div>
                <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    Assigned to: {task.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
                
                <select 
                  value={task.status} 
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No tasks yet.</p>}
        </section>

        <aside>
          <div className="stat-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Team Members</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {project.members.map(member => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ margin: 'auto' }}>{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select 
                  value={newTask.assignedTo} 
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Select Member</option>
                  {project.members.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Task</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ marginBottom: '1.5rem' }}>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Member Email</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Note: The user must already have an account.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Member</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowMemberModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
