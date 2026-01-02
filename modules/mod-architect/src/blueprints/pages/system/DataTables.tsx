
import React, { useState } from 'react';
import { DataTable } from '@blueprints/components/functional/DataTable/index';
import type { ColumnDef } from '@blueprints/components/functional/DataTable/utils';
import { Drawer, useDrawer } from '@blueprints/components/functional/Drawer/index';

// --- 1. Data & Helpers from Original Static File ---

type StatusType = 'Active' | 'Away' | 'Offline';

interface Employee {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  status: StatusType;
  lastActive: string;
  department: string;
  skills: string[];
}

const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@loop.dev', 
    initials: 'JD', 
    role: 'Senior Engineer', 
    status: 'Active', 
    lastActive: '2 mins ago', 
    department: 'Engineering', 
    skills: ['Node.js', 'React', 'TypeScript'] 
  },
  { 
    id: '2', 
    name: 'Alice Smith', 
    email: 'alice.smith@loop.dev', 
    initials: 'AS', 
    role: 'Product Designer', 
    status: 'Away', 
    lastActive: '4 hours ago', 
    department: 'Product', 
    skills: ['Figma', 'UI/UX', 'Prototyping'] 
  },
  { 
    id: '3', 
    name: 'Mike Kogan', 
    email: 'mike.k@loop.dev', 
    initials: 'MK', 
    role: 'DevOps Engineer', 
    status: 'Offline', 
    lastActive: '2 days ago', 
    department: 'Operations', 
    skills: ['AWS', 'Docker', 'Kubernetes'] 
  },
  { 
    id: '4', 
    name: 'Elena Rodriguez', 
    email: 'elena.r@loop.dev', 
    initials: 'ER', 
    role: 'Frontend Lead', 
    status: 'Active', 
    lastActive: 'Just now', 
    department: 'Frontend', 
    skills: ['CSS Architecture', 'Accessibility', 'Design Systems'] 
  },
];

// Helper functions for status styling (extracted from original static HTML logic)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    case 'Away': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case 'Offline': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-500';
    case 'Away': return 'bg-yellow-500';
    case 'Offline': return 'bg-slate-400';
    default: return 'bg-slate-400';
  }
};

// --- 2. Page Component ---

export const DataTables: React.FC = () => {
  const [data, setData] = useState<Employee[]>(MOCK_EMPLOYEES);
  
  // Drawer logic for Edit/Add
  const { isOpen, open, close } = useDrawer();
  const [editingItem, setEditingItem] = useState<Employee | null>(null);

  // --- Column Configuration (Matching Static HTML) ---
  const columns: ColumnDef<Employee>[] = [
    {
      key: 'name',
      header: 'User Details',
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-700">
            {item.initials}
          </div>
          {/* Name & Email */}
          <div className="flex flex-col">
            <span className="font-medium text-[#0d121b] dark:text-white text-sm">{item.name}</span>
            <span className="text-xs text-slate-400">{item.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (item) => (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}></span>
          {item.status}
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      cell: (item) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">{item.role}</span>
      )
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-xs text-slate-500">{item.lastActive}</span>
      )
    }
  ];

  // --- Handlers ---

  const handleAddRecord = () => {
    setEditingItem({
      id: '',
      name: '',
      email: '',
      initials: 'NU',
      role: 'Engineer',
      status: 'Active',
      lastActive: 'Just now',
      department: '',
      skills: []
    });
    open();
  };

  const handleEditRecord = (item: Employee) => {
    setEditingItem({ ...item });
    open();
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setData(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    if (editingItem.id) {
      // Update
      setData(prev => prev.map(emp => emp.id === editingItem.id ? editingItem : emp));
    } else {
      // Create
      const newId = Math.random().toString(36).substr(2, 9);
      const derivedInitials = editingItem.name
        ? editingItem.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';
      
      setData(prev => [{ ...editingItem, id: newId, initials: derivedInitials }, ...prev]);
    }
    close();
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 w-fit">
            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-sm">auto_awesome</span>
            <span className="text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wide">AI Optimized Structure</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Advanced Data Tables</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            The Data Table component is designed for density and flexibility. It supports complex interactions like sorting, filtering, selection, and inline editing while maintaining optimal performance.
          </p>
        </div>
      </div>

      {/* The Generic Table Component */}
      <div className="w-full h-full min-h-[500px] flex flex-col">
        <DataTable 
          data={data}
          columns={columns}
          className="flex-1 h-full"
          onAddRecord={handleAddRecord}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
          // Expanded Row Render: Matches exactly the "Expanded Detail" view logic
          renderExpandedRow={(item) => (
            <div className="pl-16 pr-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                {/* ID Column */}
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold text-slate-400">Employee ID</span>
                  <div className="font-mono text-slate-700 dark:text-slate-300">{`EMP-${item.id.padStart(5, '0')}`}</div>
                </div>
                {/* Department Column */}
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold text-slate-400">Department</span>
                  <div className="text-slate-700 dark:text-slate-300">{item.department}</div>
                </div>
                {/* Skills Column */}
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold text-slate-400">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Shared Drawer for Add/Edit Actions */}
      <Drawer 
        isOpen={isOpen} 
        onClose={close} 
        title={editingItem?.id ? `Edit ${editingItem.name}` : 'New Employee'}
        actions={
          <>
            <button 
              onClick={close} 
              className="px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
            >
              {editingItem?.id ? 'Save Changes' : 'Create Record'}
            </button>
          </>
        }
      >
        {editingItem && (
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Header / Avatar Preview */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xl font-bold border border-slate-200 dark:border-slate-700">
                {editingItem.name 
                    ? editingItem.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) 
                    : '??'}
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0d121b] dark:text-white">
                    {editingItem.name || 'New User'}
                </h4>
                <p className="text-sm text-slate-500">
                    {editingItem.email || 'No email provided'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <input 
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                value={editingItem.email}
                onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                placeholder="e.g. jane@loop.dev"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
              <select 
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                value={editingItem.role}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
              >
                <option value="Senior Engineer">Senior Engineer</option>
                <option value="Product Designer">Product Designer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Frontend Lead">Frontend Lead</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <div className="flex gap-3">
                {(['Active', 'Away', 'Offline'] as StatusType[]).map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={editingItem.status === status} 
                      onChange={() => setEditingItem({ ...editingItem, status })}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
              <input 
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
                value={editingItem.department} 
                onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                placeholder="e.g. Engineering"
              />
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
};
