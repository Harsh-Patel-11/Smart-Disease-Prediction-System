import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SrsArchitectureViewer } from './SrsArchitectureViewer';
import { PageTransition } from './PageTransition';
import {
  Users,
  ShieldCheck,
  Activity,
  Database,
  Pill,
  Clock,
  Plus,
  Trash2,
  Edit,
  X,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    users,
    diseases,
    symptoms,
    medicines,
    loginHistory,
    activeTab,
    addUser,
    updateUser,
    deleteUser,
    addDisease,
    updateDisease,
    deleteDisease,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    clearAuditLogs
  } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState('users');

  useEffect(() => {
    if (activeTab.startsWith('admin_')) {
      setActiveAdminSubTab(activeTab.replace('admin_', ''));
    }
  }, [activeTab]);

  // Modal Visibility States
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  // Edit Target States
  const [editingUser, setEditingUser] = useState(null);
  const [editingDisease, setEditingDisease] = useState(null);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Form States for Creating
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'Password123!', contact_no: '', role: 'Patient' });
  const [newDisease, setNewDisease] = useState({ disease_name: '', category: 'General', severity_level: 'Moderate', description: '', precautions: '', recommended_specialist: 'General Physician' });
  const [newSymptom, setNewSymptom] = useState({ symptom_name: '', category: 'General', body_part: 'Whole Body', description: '' });
  const [newMed, setNewMed] = useState({ medicine_name: '', type: 'Tablet', description: '', default_dosage: '1 Tablet twice daily', default_duration: '5 Days' });

  // Notification Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Handlers for Add
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addUser(newUser);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', password: 'Password123!', contact_no: '', role: 'Patient' });
    showToast('User created successfully!');
  };

  const handleAddDiseaseSubmit = (e) => {
    e.preventDefault();
    addDisease(newDisease);
    setShowAddDisease(false);
    setNewDisease({ disease_name: '', category: 'General', severity_level: 'Moderate', description: '', precautions: '', recommended_specialist: 'General Physician' });
    showToast('Disease entry added!');
  };

  const handleAddSymptomSubmit = (e) => {
    e.preventDefault();
    addSymptom(newSymptom);
    setShowAddSymptom(false);
    setNewSymptom({ symptom_name: '', category: 'General', body_part: 'Whole Body', description: '' });
    showToast('Symptom entry added!');
  };

  const handleAddMedSubmit = (e) => {
    e.preventDefault();
    addMedicine(newMed);
    setShowAddMedicine(false);
    setNewMed({ medicine_name: '', type: 'Tablet', description: '', default_dosage: '1 Tablet twice daily', default_duration: '5 Days' });
    showToast('Medicine entry added!');
  };

  // Handlers for Edit
  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    updateUser(editingUser);
    setEditingUser(null);
    showToast('User profile updated!');
  };

  const handleUpdateDiseaseSubmit = (e) => {
    e.preventDefault();
    updateDisease(editingDisease);
    setEditingDisease(null);
    showToast('Disease details updated!');
  };

  const handleUpdateSymptomSubmit = (e) => {
    e.preventDefault();
    updateSymptom(editingSymptom);
    setEditingSymptom(null);
    showToast('Symptom entry updated!');
  };

  const handleUpdateMedSubmit = (e) => {
    e.preventDefault();
    updateMedicine(editingMedicine);
    setEditingMedicine(null);
    showToast('Medicine entry updated!');
  };

  if (activeTab === 'srs') {
    return <PageTransition tabKey="srs"><SrsArchitectureViewer /></PageTransition>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/90 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-[#0a0a1a] via-[#0f0f28] to-rose-950/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Full System Administrative Permissions (Root Access)
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              System Administration Suite
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Full control to create, modify, or delete user accounts, diseases, symptoms, medicine inventory, and system audit logs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-white">{users.length}</p>
              <p className="text-[10px] text-slate-400">Users</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-indigo-400">{diseases.length}</p>
              <p className="text-[10px] text-slate-400">Diseases</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-violet-400">{symptoms.length}</p>
              <p className="text-[10px] text-slate-400">Symptoms</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-rose-400">{loginHistory.length}</p>
              <p className="text-[10px] text-slate-400">Audit Logs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4 overflow-x-auto">
        {[
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'diseases', label: `Diseases (${diseases.length})`, icon: Database },
          { id: 'symptoms', label: `Symptoms (${symptoms.length})`, icon: Activity },
          { id: 'medicines', label: `Medicines (${medicines.length})`, icon: Pill },
          { id: 'audit', label: `Audit Logs (${loginHistory.length})`, icon: Clock }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeAdminSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveAdminSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-white bg-slate-900/80 border border-white/[0.06]'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <PageTransition tabKey={activeAdminSubTab}>

        {/* ══════════════════════════════════════════
           TAB 1: USER MANAGEMENT (Full CRUD)
           ══════════════════════════════════════════ */}
        {activeAdminSubTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Registered User Accounts</h3>
                <p className="text-xs text-slate-400">Modify user roles, names, contact numbers, or delete accounts</p>
              </div>
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add User Record
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Role (RBAC)</th>
                    <th className="p-3">Auth Provider</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map(u => (
                    <tr key={u.user_id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-indigo-400 font-bold">#{u.user_id}</td>
                      <td className="p-3 font-semibold text-white">{u.name}</td>
                      <td className="p-3 text-slate-300">{u.email}</td>
                      <td className="p-3 text-slate-400">{u.contact_no || u.phone || '—'}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={e => {
                            updateUser({ ...u, role: e.target.value });
                            showToast(`Updated ${u.name}'s role to ${e.target.value}`);
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border bg-slate-900 cursor-pointer ${
                            u.role === 'Admin' ? 'text-rose-400 border-rose-500/40' :
                            u.role === 'Doctor' ? 'text-violet-400 border-violet-500/40' :
                            'text-indigo-400 border-indigo-500/40'
                          }`}
                        >
                          <option value="Patient" className="bg-slate-900 text-indigo-400">Patient</option>
                          <option value="Doctor" className="bg-slate-900 text-violet-400">Doctor</option>
                          <option value="Admin" className="bg-slate-900 text-rose-400">Admin</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{u.auth_provider || 'password'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 cursor-pointer"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteUser(u.user_id);
                              showToast(`Deleted user #${u.user_id}`);
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
           TAB 2: MASTER DISEASE LIBRARY (Full CRUD)
           ══════════════════════════════════════════ */}
        {activeAdminSubTab === 'diseases' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Master Disease Library</h3>
                <p className="text-xs text-slate-400">Add, edit descriptions, or remove disease entries</p>
              </div>
              <button
                onClick={() => setShowAddDisease(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Disease Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diseases.map(d => (
                <div key={d.disease_id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 relative group hover:border-indigo-500/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{d.disease_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">{d.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.severity_level === 'Emergency' || d.severity_level === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {d.severity_level || 'Moderate'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingDisease(d)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                        title="Edit Disease"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteDisease(d.disease_id);
                          showToast(`Deleted disease: ${d.disease_name}`);
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Disease"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>
                  {d.recommended_specialist && (
                    <p className="text-[11px] text-indigo-300 font-semibold pt-1 border-t border-white/[0.06]">
                      Specialist: {d.recommended_specialist}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
           TAB 3: SYMPTOMS MATRIX (Full CRUD)
           ══════════════════════════════════════════ */}
        {activeAdminSubTab === 'symptoms' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Symptom Weight Matrix</h3>
                <p className="text-xs text-slate-400">Add, edit body parts, categories, or delete symptoms</p>
              </div>
              <button
                onClick={() => setShowAddSymptom(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Symptom Entry
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Symptom Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Body Part</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {symptoms.map(s => (
                    <tr key={s.symptom_id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-indigo-400 font-bold">#{s.symptom_id}</td>
                      <td className="p-3 font-semibold text-white">{s.symptom_name}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{s.body_part}</td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">{s.description}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingSymptom(s)}
                            className="p-1 text-indigo-400 hover:bg-indigo-500/10 rounded cursor-pointer"
                            title="Edit Symptom"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteSymptom(s.symptom_id);
                              showToast(`Deleted symptom #${s.symptom_id}`);
                            }}
                            className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                            title="Delete Symptom"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
           TAB 4: MEDICINES INVENTORY (Full CRUD)
           ══════════════════════════════════════════ */}
        {activeAdminSubTab === 'medicines' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Medicines Inventory</h3>
                <p className="text-xs text-slate-400">Add new medicines, edit dosages/durations, or remove stock</p>
              </div>
              <button
                onClick={() => setShowAddMedicine(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Medicine
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicines.map(m => (
                <div key={m.medicine_id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 relative group hover:border-violet-500/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{m.medicine_name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-violet-300">{m.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingMedicine(m)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                        title="Edit Medicine"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteMedicine(m.medicine_id);
                          showToast(`Deleted medicine: ${m.medicine_name}`);
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                  <div className="flex justify-between text-xs pt-1 border-t border-white/[0.06]">
                    <span className="text-indigo-300 font-medium">Dosage: {m.default_dosage}</span>
                    <span className="text-slate-400">Duration: {m.default_duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
           TAB 5: AUDIT LOGS (Full CRUD)
           ══════════════════════════════════════════ */}
        {activeAdminSubTab === 'audit' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-400" /> Database Real-Time Audit Logs
                </h3>
                <p className="text-xs text-slate-400">Inspect or clear user session audit records</p>
              </div>
              {loginHistory.length > 0 && (
                <button
                  onClick={() => {
                    clearAuditLogs();
                    showToast('Audit logs cleared.');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Clear Audit Logs
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 font-semibold border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3">Login ID</th>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">IP / Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loginHistory.map(log => (
                    <tr key={log.login_id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-indigo-400">#{log.login_id}</td>
                      <td className="p-3 font-semibold text-white">{log.user_name}</td>
                      <td className="p-3 text-slate-300">{log.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.role === 'Admin' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 font-mono">{new Date(log.login_time).toLocaleString()}</td>
                      <td className="p-3 text-slate-400 font-mono">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </PageTransition>

      {/* ══════════════════════════════════════════
         MODALS: ADD FORMS
         ══════════════════════════════════════════ */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add New User Account</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Contact Number</label>
                <input type="tel" value={newUser.contact_no} onChange={e => setNewUser({ ...newUser, contact_no: e.target.value })} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Role (RBAC)</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 text-slate-950 font-bold cursor-pointer">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Disease Entry</h3>
              <button onClick={() => setShowAddDisease(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddDiseaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Disease Name</label>
                <input type="text" value={newDisease.disease_name} onChange={e => setNewDisease({ ...newDisease, disease_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <input type="text" value={newDisease.category} onChange={e => setNewDisease({ ...newDisease, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Severity Level</label>
                <select value={newDisease.severity_level} onChange={e => setNewDisease({ ...newDisease, severity_level: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={newDisease.description} onChange={e => setNewDisease({ ...newDisease, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Recommended Specialist</label>
                <input type="text" value={newDisease.recommended_specialist} onChange={e => setNewDisease({ ...newDisease, recommended_specialist: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDisease(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 text-slate-950 font-bold cursor-pointer">Save Disease</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Symptom Entry</h3>
              <button onClick={() => setShowAddSymptom(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSymptomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Symptom Name</label>
                <input type="text" value={newSymptom.symptom_name} onChange={e => setNewSymptom({ ...newSymptom, symptom_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <input type="text" value={newSymptom.category} onChange={e => setNewSymptom({ ...newSymptom, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Body Part</label>
                <input type="text" value={newSymptom.body_part} onChange={e => setNewSymptom({ ...newSymptom, body_part: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={newSymptom.description} onChange={e => setNewSymptom({ ...newSymptom, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddSymptom(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 text-slate-950 font-bold cursor-pointer">Save Symptom</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Medicine Entry</h3>
              <button onClick={() => setShowAddMedicine(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Medicine Name</label>
                <input type="text" value={newMed.medicine_name} onChange={e => setNewMed({ ...newMed, medicine_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Type</label>
                <input type="text" value={newMed.type} onChange={e => setNewMed({ ...newMed, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={newMed.description} onChange={e => setNewMed({ ...newMed, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Default Dosage</label>
                <input type="text" value={newMed.default_dosage} onChange={e => setNewMed({ ...newMed, default_dosage: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Default Duration</label>
                <input type="text" value={newMed.default_duration} onChange={e => setNewMed({ ...newMed, default_duration: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddMedicine(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-500 text-slate-950 font-bold cursor-pointer">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
         MODALS: EDIT FORMS
         ══════════════════════════════════════════ */}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit User Record #{editingUser.user_id}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input type="text" value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <input type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Contact Phone</label>
                <input type="tel" value={editingUser.contact_no || editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, contact_no: e.target.value, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Role (RBAC)</label>
                <select value={editingUser.role || 'Patient'} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Disease Modal */}
      {editingDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Disease Details</h3>
              <button onClick={() => setEditingDisease(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateDiseaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Disease Name</label>
                <input type="text" value={editingDisease.disease_name || ''} onChange={e => setEditingDisease({ ...editingDisease, disease_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <input type="text" value={editingDisease.category || ''} onChange={e => setEditingDisease({ ...editingDisease, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Severity Level</label>
                <select value={editingDisease.severity_level || 'Moderate'} onChange={e => setEditingDisease({ ...editingDisease, severity_level: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={editingDisease.description || ''} onChange={e => setEditingDisease({ ...editingDisease, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Recommended Specialist</label>
                <input type="text" value={editingDisease.recommended_specialist || ''} onChange={e => setEditingDisease({ ...editingDisease, recommended_specialist: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingDisease(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Symptom Modal */}
      {editingSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Symptom Details</h3>
              <button onClick={() => setEditingSymptom(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateSymptomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Symptom Name</label>
                <input type="text" value={editingSymptom.symptom_name || ''} onChange={e => setEditingSymptom({ ...editingSymptom, symptom_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <input type="text" value={editingSymptom.category || ''} onChange={e => setEditingSymptom({ ...editingSymptom, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Body Part</label>
                <input type="text" value={editingSymptom.body_part || ''} onChange={e => setEditingSymptom({ ...editingSymptom, body_part: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={editingSymptom.description || ''} onChange={e => setEditingSymptom({ ...editingSymptom, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingSymptom(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a1a]/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/[0.08] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Medicine Details</h3>
              <button onClick={() => setEditingMedicine(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Medicine Name</label>
                <input type="text" value={editingMedicine.medicine_name || ''} onChange={e => setEditingMedicine({ ...editingMedicine, medicine_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Type</label>
                <input type="text" value={editingMedicine.type || ''} onChange={e => setEditingMedicine({ ...editingMedicine, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea value={editingMedicine.description || ''} onChange={e => setEditingMedicine({ ...editingMedicine, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none" rows={2} required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Default Dosage</label>
                <input type="text" value={editingMedicine.default_dosage || ''} onChange={e => setEditingMedicine({ ...editingMedicine, default_dosage: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Default Duration</label>
                <input type="text" value={editingMedicine.default_duration || ''} onChange={e => setEditingMedicine({ ...editingMedicine, default_duration: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingMedicine(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
