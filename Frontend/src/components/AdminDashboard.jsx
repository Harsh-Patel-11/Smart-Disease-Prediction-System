import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
  AlertTriangle,
  UserCheck,
  Smartphone,
  Globe,
  Radio,
  Search,
  Filter,
  History
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
    clearAuditLogs,
    currentUser
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

  // Audit Logs Search & Filter States
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState('ALL');

  // Form States for Creating
  const [newUser, setNewUser] = useState({ name: '', email: '', contact_no: '', role: 'Patient', age: '', gender: 'Male', blood_group: 'A+' });
  const [newDisease, setNewDisease] = useState({ disease_name: '', category: 'General', severity_level: 'Moderate', description: '', precautions: '', recommended_specialist: 'General Physician' });
  const [newSymptom, setNewSymptom] = useState({ symptom_name: '', category: 'General', body_part: 'Whole Body', description: '' });
  const [newMed, setNewMed] = useState({ medicine_name: '', type: 'Tablet', description: '', default_dosage: '1 Tablet twice daily', default_duration: '5 Days' });

  // Notification Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Helper: Find latest real-time login session for a user
  const getLatestLogin = (user) => {
    if (!user) return null;
    return loginHistory.find(l =>
      l.user_id === user.user_id ||
      l.email?.toLowerCase() === user.email?.toLowerCase()
    );
  };

  // Helper: Check if user is currently online in real time
  const isUserOnline = (user) => {
    if (!user) return false;
    if (currentUser && (currentUser.user_id === user.user_id || currentUser.email?.toLowerCase() === user.email?.toLowerCase())) {
      return true;
    }
    const latest = getLatestLogin(user);
    if (!latest) return false;
    const loginTime = new Date(latest.login_time).getTime();
    const now = new Date().getTime();
    return (now - loginTime) < (15 * 60 * 1000);
  };

  // Filtered Audit Logs
  const filteredAuditLogs = loginHistory.filter(log => {
    const matchesSearch =
      (log.user_name || '').toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      (log.email || '').toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      (log.ip_address || '').toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      (log.device_info || '').toLowerCase().includes(auditSearchTerm.toLowerCase());
    
    const matchesRole = auditRoleFilter === 'ALL' || log.role === auditRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Handlers for Add
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addUser(newUser);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', contact_no: '', role: 'Patient', age: '', gender: 'Male', blood_group: 'A+' });
    showToast('User account created successfully!');
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
    showToast(`Updated full profile for ${editingUser.name}!`);
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

  const modalInputClasses = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium";

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-rose-100 bg-white shadow-md shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Full System Administrative Permissions (Root Access)
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              System Administration Suite
            </h1>
            <p className="text-xs text-slate-500 max-w-xl font-medium leading-relaxed">
              Real-time user session monitoring, past login history tracking, full user profile editing, and disease-symptom mapping matrix.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-slate-900">{users.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">Total Users</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {users.filter(u => isUserOnline(u)).length}
              </p>
              <p className="text-[10px] text-slate-500 font-bold">Live Online</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-indigo-600">{diseases.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">Diseases</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
              <p className="text-xl font-extrabold text-rose-600">{loginHistory.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">Past & Live Logins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 overflow-x-auto">
        {[
          { id: 'users', label: `Users & Profiles (${users.length})`, icon: Users },
          { id: 'diseases', label: `Diseases (${diseases.length})`, icon: Database },
          { id: 'symptoms', label: `Symptoms (${symptoms.length})`, icon: Activity },
          { id: 'medicines', label: `Medicines (${medicines.length})`, icon: Pill },
          { id: 'audit', label: `Login Audit History (${loginHistory.length})`, icon: History }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeAdminSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveAdminSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <PageTransition tabKey={activeAdminSubTab}>

        {/* TAB 1: USER MANAGEMENT & FULL PROFILE EDITING */}
        {activeAdminSubTab === 'users' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> User Accounts & Profile Control
                </h3>
                <p className="text-xs text-slate-500 font-medium">View real-time login statuses and edit full user profile details</p>
              </div>
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add User Account
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Live Status</th>
                    <th className="p-3">User & Email</th>
                    <th className="p-3">Profile Info</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Role (RBAC)</th>
                    <th className="p-3">Latest Login Session</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map(u => {
                    const online = isUserOnline(u);
                    const latest = getLatestLogin(u);
                    return (
                      <tr key={u.user_id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Live Real-Time Status */}
                        <td className="p-3">
                          {online ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online Now
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Offline
                            </span>
                          )}
                        </td>

                        {/* User & Email */}
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900 text-xs">{u.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                          <span className="text-[9px] font-mono text-indigo-600 font-bold">ID: #{u.user_id}</span>
                        </td>

                        {/* Profile Info */}
                        <td className="p-3 text-slate-700 space-y-0.5 font-medium">
                          <p className="text-[11px]">
                            {u.age ? `${u.age} yrs` : 'Age N/A'}, {u.gender || 'N/A'}
                          </p>
                          {u.blood_group && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                              Blood: {u.blood_group}
                            </span>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="p-3 text-slate-600 font-mono text-[11px] font-medium">
                          {u.contact_no || u.phone || '—'}
                        </td>

                        {/* Role Selector */}
                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={e => {
                              updateUser({ ...u, role: e.target.value });
                              showToast(`Updated ${u.name}'s role to ${e.target.value}`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-white cursor-pointer shadow-xs ${
                              u.role === 'Admin' ? 'text-rose-700 border-rose-200' :
                              u.role === 'Doctor' ? 'text-violet-700 border-violet-200' :
                              'text-indigo-700 border-indigo-200'
                            }`}
                          >
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>

                        {/* Real-time Login Session */}
                        <td className="p-3 text-slate-500 font-mono text-[10px]">
                          {latest ? (
                            <div>
                              <p className="text-slate-900 font-bold">{new Date(latest.login_time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-slate-500">{latest.device_info || 'Firebase Web Auth'} ({latest.ip_address})</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No session recorded</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUser(u)}
                              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Edit Full Profile"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Profile
                            </button>
                            <button
                              onClick={() => {
                                deleteUser(u.user_id);
                                showToast(`Deleted user #${u.user_id}`);
                              }}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER DISEASE LIBRARY */}
        {activeAdminSubTab === 'diseases' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Master Disease Library</h3>
                <p className="text-xs text-slate-500 font-medium">Add, edit descriptions, or remove disease entries</p>
              </div>
              <button
                onClick={() => setShowAddDisease(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Disease Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diseases.map(d => (
                <div key={d.disease_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative group hover:border-indigo-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{d.disease_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{d.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.severity_level === 'Emergency' || d.severity_level === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                          {d.severity_level || 'Moderate'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingDisease(d)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 cursor-pointer" title="Edit Disease">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { deleteDisease(d.disease_id); showToast(`Deleted disease: ${d.disease_name}`); }} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer" title="Delete Disease">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{d.description}</p>
                  {d.recommended_specialist && (
                    <p className="text-[11px] text-indigo-700 font-bold pt-1 border-t border-slate-200/80">
                      Specialist: {d.recommended_specialist}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SYMPTOMS MATRIX */}
        {activeAdminSubTab === 'symptoms' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Symptom Weight Matrix</h3>
                <p className="text-xs text-slate-500 font-medium">Add, edit body parts, categories, or delete symptoms</p>
              </div>
              <button
                onClick={() => setShowAddSymptom(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Symptom Entry
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Symptom Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Body Part</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {symptoms.map(s => (
                    <tr key={s.symptom_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-indigo-600 font-bold">#{s.symptom_id}</td>
                      <td className="p-3 font-bold text-slate-900">{s.symptom_name}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-indigo-700 font-bold border border-slate-200">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{s.body_part}</td>
                      <td className="p-3 text-slate-500 max-w-xs truncate font-medium">{s.description}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setEditingSymptom(s)} className="p-1 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer" title="Edit Symptom">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => { deleteSymptom(s.symptom_id); showToast(`Deleted symptom #${s.symptom_id}`); }} className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer" title="Delete Symptom">
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

        {/* TAB 4: MEDICINES INVENTORY */}
        {activeAdminSubTab === 'medicines' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Medicines Inventory</h3>
                <p className="text-xs text-slate-500 font-medium">Add new medicines, edit dosages/durations, or remove stock</p>
              </div>
              <button
                onClick={() => setShowAddMedicine(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Medicine
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicines.map(m => (
                <div key={m.medicine_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative group hover:border-violet-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{m.medicine_name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-bold border border-violet-200">{m.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingMedicine(m)} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 cursor-pointer" title="Edit Medicine">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => { deleteMedicine(m.medicine_id); showToast(`Deleted medicine: ${m.medicine_name}`); }} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer" title="Delete Medicine">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{m.description}</p>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200/80">
                    <span className="text-indigo-700 font-bold">Dosage: {m.default_dosage}</span>
                    <span className="text-slate-500 font-semibold">Duration: {m.default_duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REAL-TIME & PAST LOGIN AUDIT HISTORY */}
        {activeAdminSubTab === 'audit' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-5 shadow-sm">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" /> Complete Past & Live Login Audit Trail
                </h3>
                <p className="text-xs text-slate-500 font-medium">Chronological history of all login sessions, authentication protocols, and IP addresses</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {loginHistory.length > 0 && (
                  <button
                    onClick={() => {
                      clearAuditLogs();
                      showToast('Audit history cleared.');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Clear Audit Logs
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={auditSearchTerm}
                  onChange={e => setAuditSearchTerm(e.target.value)}
                  placeholder="Search by user name, email, IP address, or device..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 transition-all font-medium"
                />
                {auditSearchTerm && (
                  <button onClick={() => setAuditSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Role Filter Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto shrink-0">
                <span className="text-slate-500 text-xs font-bold flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {['ALL', 'Patient', 'Doctor', 'Admin'].map(r => (
                  <button
                    key={r}
                    onClick={() => setAuditRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      auditRoleFilter === r ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

            </div>

            {/* Table of Historical Logins */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Session ID</th>
                    <th className="p-3">User & Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Exact Date & Time</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Auth Provider / Device Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No login records matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => (
                      <tr key={log.login_id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-indigo-600 font-extrabold">#{log.login_id}</td>
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{log.user_name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{log.email}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            log.role === 'Admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            log.role === 'Doctor' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {log.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-mono font-medium">
                          {new Date(log.login_time).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </td>
                        <td className="p-3 text-slate-700 font-mono font-semibold">{log.ip_address || '127.0.0.1'}</td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">
                          <span className="text-slate-900 font-bold block">{log.device_info || 'Firebase Auth Protocol'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </PageTransition>

      {/* MODALS: ADD FORMS */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Add New User Account</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                <input type="tel" value={newUser.contact_no} onChange={e => setNewUser({ ...newUser, contact_no: e.target.value })} placeholder="+91 98765 43210" className={modalInputClasses} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age</label>
                  <input type="number" value={newUser.age} onChange={e => setNewUser({ ...newUser, age: e.target.value })} placeholder="25" className={modalInputClasses} />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })} className={modalInputClasses}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select value={newUser.blood_group} onChange={e => setNewUser({ ...newUser, blood_group: e.target.value })} className={modalInputClasses}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Role (RBAC)</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className={modalInputClasses}>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700 shadow-sm">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Add Disease Entry</h3>
              <button onClick={() => setShowAddDisease(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddDiseaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Disease Name</label>
                <input type="text" value={newDisease.disease_name} onChange={e => setNewDisease({ ...newDisease, disease_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <input type="text" value={newDisease.category} onChange={e => setNewDisease({ ...newDisease, category: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                <select value={newDisease.severity_level} onChange={e => setNewDisease({ ...newDisease, severity_level: e.target.value })} className={modalInputClasses}>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={newDisease.description} onChange={e => setNewDisease({ ...newDisease, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Recommended Specialist</label>
                <input type="text" value={newDisease.recommended_specialist} onChange={e => setNewDisease({ ...newDisease, recommended_specialist: e.target.value })} className={modalInputClasses} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDisease(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700 shadow-sm">Save Disease</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Add Symptom Entry</h3>
              <button onClick={() => setShowAddSymptom(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSymptomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Symptom Name</label>
                <input type="text" value={newSymptom.symptom_name} onChange={e => setNewSymptom({ ...newSymptom, symptom_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <input type="text" value={newSymptom.category} onChange={e => setNewSymptom({ ...newSymptom, category: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Body Part</label>
                <input type="text" value={newSymptom.body_part} onChange={e => setNewSymptom({ ...newSymptom, body_part: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={newSymptom.description} onChange={e => setNewSymptom({ ...newSymptom, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddSymptom(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700 shadow-sm">Save Symptom</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Add Medicine Entry</h3>
              <button onClick={() => setShowAddMedicine(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Medicine Name</label>
                <input type="text" value={newMed.medicine_name} onChange={e => setNewMed({ ...newMed, medicine_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Type</label>
                <input type="text" value={newMed.type} onChange={e => setNewMed({ ...newMed, type: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={newMed.description} onChange={e => setNewMed({ ...newMed, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Dosage</label>
                <input type="text" value={newMed.default_dosage} onChange={e => setNewMed({ ...newMed, default_dosage: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Duration</label>
                <input type="text" value={newMed.default_duration} onChange={e => setNewMed({ ...newMed, default_duration: e.target.value })} className={modalInputClasses} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddMedicine(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700 shadow-sm">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL EDIT USER PROFILE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-5 shadow-2xl my-auto animate-modal-content max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200/80 pb-4 shrink-0">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-indigo-600" /> Edit Full User Profile #{editingUser.user_id}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Modify profile parameters, contact information, and RBAC permissions</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Full Name</label>
                  <input type="text" value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className={modalInputClasses} required />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Email Address</label>
                  <input type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className={modalInputClasses} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Contact Phone Number</label>
                  <input type="tel" value={editingUser.contact_no || editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, contact_no: e.target.value, phone: e.target.value })} placeholder="+91 98765 43210" className={modalInputClasses} />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Role (RBAC Permission)</label>
                  <select value={editingUser.role || 'Patient'} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className={modalInputClasses}>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-bold">Age</label>
                  <input type="number" value={editingUser.age || ''} onChange={e => setEditingUser({ ...editingUser, age: e.target.value })} placeholder="25" className={modalInputClasses} />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-bold">Gender</label>
                  <select value={editingUser.gender || 'Male'} onChange={e => setEditingUser({ ...editingUser, gender: e.target.value })} className={modalInputClasses}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1 font-bold">Blood Group</label>
                  <select value={editingUser.blood_group || 'A+'} onChange={e => setEditingUser({ ...editingUser, blood_group: e.target.value })} className={modalInputClasses}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Residential Address</label>
                <input type="text" value={editingUser.address || ''} onChange={e => setEditingUser({ ...editingUser, address: e.target.value })} placeholder="123 Health Street, City" className={modalInputClasses} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Emergency Contact Phone</label>
                  <input type="tel" value={editingUser.emergency_contact || ''} onChange={e => setEditingUser({ ...editingUser, emergency_contact: e.target.value })} placeholder="+91 99999 88888" className={modalInputClasses} />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Chronic Conditions / Allergies</label>
                  <input type="text" value={editingUser.chronic_conditions || editingUser.allergies || ''} onChange={e => setEditingUser({ ...editingUser, chronic_conditions: e.target.value, allergies: e.target.value })} placeholder="Penicillin allergy, Asthma" className={modalInputClasses} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/80 shrink-0">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20">
                  <Save className="w-4 h-4" /> Save User Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISEASE MODAL */}
      {editingDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Disease Details</h3>
              <button onClick={() => setEditingDisease(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateDiseaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Disease Name</label>
                <input type="text" value={editingDisease.disease_name || ''} onChange={e => setEditingDisease({ ...editingDisease, disease_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <input type="text" value={editingDisease.category || ''} onChange={e => setEditingDisease({ ...editingDisease, category: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                <select value={editingDisease.severity_level || 'Moderate'} onChange={e => setEditingDisease({ ...editingDisease, severity_level: e.target.value })} className={modalInputClasses}>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={editingDisease.description || ''} onChange={e => setEditingDisease({ ...editingDisease, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Recommended Specialist</label>
                <input type="text" value={editingDisease.recommended_specialist || ''} onChange={e => setEditingDisease({ ...editingDisease, recommended_specialist: e.target.value })} className={modalInputClasses} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingDisease(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SYMPTOM MODAL */}
      {editingSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Symptom Details</h3>
              <button onClick={() => setEditingSymptom(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateSymptomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Symptom Name</label>
                <input type="text" value={editingSymptom.symptom_name || ''} onChange={e => setEditingSymptom({ ...editingSymptom, symptom_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <input type="text" value={editingSymptom.category || ''} onChange={e => setEditingSymptom({ ...editingSymptom, category: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Body Part</label>
                <input type="text" value={editingSymptom.body_part || ''} onChange={e => setEditingSymptom({ ...editingSymptom, body_part: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={editingSymptom.description || ''} onChange={e => setEditingSymptom({ ...editingSymptom, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingSymptom(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEDICINE MODAL */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200/90 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Medicine Details</h3>
              <button onClick={() => setEditingMedicine(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Medicine Name</label>
                <input type="text" value={editingMedicine.medicine_name || ''} onChange={e => setEditingMedicine({ ...editingMedicine, medicine_name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Type</label>
                <input type="text" value={editingMedicine.type || ''} onChange={e => setEditingMedicine({ ...editingMedicine, type: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea value={editingMedicine.description || ''} onChange={e => setEditingMedicine({ ...editingMedicine, description: e.target.value })} className={modalInputClasses + " resize-none"} rows={2} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Dosage</label>
                <input type="text" value={editingMedicine.default_dosage || ''} onChange={e => setEditingMedicine({ ...editingMedicine, default_dosage: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Duration</label>
                <input type="text" value={editingMedicine.default_duration || ''} onChange={e => setEditingMedicine({ ...editingMedicine, default_duration: e.target.value })} className={modalInputClasses} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingMedicine(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
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
