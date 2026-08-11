import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Calendar,
  Users,
  Mail,
  Shield,
  CheckCircle,
  Edit3,
  Save,
  X,
  Camera,
  HeartPulse,
  Activity,
  AlertCircle,
  Stethoscope,
  FileText,
  Pill
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

// ─── Field components defined OUTSIDE UserProfile so they don't remount on each keystroke ───

const InputField = ({ label, icon: Icon, field, type = 'text', placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.1] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-slate-900 transition-all"
      />
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm">
        {value ? (
          <span className="text-white">{value}</span>
        ) : (
          <span className="text-slate-600 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

const SelectField = ({ label, icon: Icon, field, options, placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    {isEditing ? (
      <select
        value={value}
        onChange={e => onChange(field, e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all appearance-none cursor-pointer"
      >
        <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>
        ))}
      </select>
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm">
        {value ? (
          <span className="text-white">{value}</span>
        ) : (
          <span className="text-slate-600 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

const TextareaField = ({ label, icon: Icon, field, placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    {isEditing ? (
      <textarea
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.1] text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
      />
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm min-h-[42px]">
        {value ? (
          <span className="text-white">{value}</span>
        ) : (
          <span className="text-slate-600 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

// ────────────────────────────────────────────────────────

export const UserProfile = () => {
  const { currentUser, updateUserProfile, predictions, reports } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    blood_group: '',
    address: '',
    emergency_contact: '',
    emergency_contact_name: '',
    allergies: '',
    chronic_conditions: ''
  });

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        phone: currentUser.phone || currentUser.contact_no || '',
        blood_group: currentUser.blood_group || '',
        address: currentUser.address || '',
        emergency_contact: currentUser.emergency_contact || '',
        emergency_contact_name: currentUser.emergency_contact_name || '',
        allergies: currentUser.allergies || '',
        chronic_conditions: currentUser.chronic_conditions || ''
      });
    }
  }, [currentUser?.user_id]); // only re-sync when the actual user changes, NOT on every form change

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUserProfile({ ...form, contact_no: form.phone });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: currentUser.name || '',
      age: currentUser.age || '',
      gender: currentUser.gender || '',
      phone: currentUser.phone || currentUser.contact_no || '',
      blood_group: currentUser.blood_group || '',
      address: currentUser.address || '',
      emergency_contact: currentUser.emergency_contact || '',
      emergency_contact_name: currentUser.emergency_contact_name || '',
      allergies: currentUser.allergies || '',
      chronic_conditions: currentUser.chronic_conditions || ''
    });
    setIsEditing(false);
  };

  const profileCompletion = () => {
    const fields = ['name', 'age', 'gender', 'phone', 'blood_group', 'address'];
    const filled = fields.filter(f => form[f] && String(form[f]).trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const role = currentUser?.role || 'Patient';
  const userReports = reports.filter(r => r.user_id === currentUser?.user_id || r.patient_name === currentUser?.name);
  const userPredictions = predictions.filter(p => p.user_id === currentUser?.user_id || p.user_name === currentUser?.name);
  const completion = profileCompletion();

  const roleColors = {
    Admin: { grad: 'from-rose-500 to-pink-500', accent: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    Doctor: { grad: 'from-violet-500 to-purple-500', accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    Patient: { grad: 'from-indigo-500 to-violet-500', accent: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
  };
  const c = roleColors[role] || roleColors.Patient;

  // Shared props passed down to avoid closures over stale state
  const fieldProps = { isEditing, onChange: handleChange };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Profile</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your personal health information</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold animate-pulse">
            <CheckCircle className="w-4 h-4" />
            Profile saved successfully!
          </div>
        )}
      </div>

      {/* Profile Hero Card */}
      <div className="glass-panel rounded-3xl border border-white/[0.07] overflow-hidden">
        <div className={`h-24 bg-gradient-to-r ${c.grad} opacity-20`} />

        <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${c.grad} text-white flex items-center justify-center text-3xl font-extrabold shadow-2xl border-4 border-[#0a0a1a] relative group cursor-pointer`}>
              {form.name?.charAt(0)?.toUpperCase() || 'U'}
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-extrabold text-white">{form.name || currentUser?.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                {currentUser?.email}
              </p>
              <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.bg} ${c.accent} border ${c.border}`}>
                <Shield className="w-3 h-3" /> {role} Account
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/60 border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r ${c.grad} text-white text-xs font-bold shadow-lg transition-all hover:opacity-90 cursor-pointer`}
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl ${c.bg} border ${c.border} ${c.accent} text-xs font-bold transition-all hover:opacity-90 cursor-pointer`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="px-6 pb-5">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Profile Completion
              </span>
              <span className={`text-sm font-extrabold ${completion >= 80 ? 'text-emerald-400' : completion >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {completion}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${completion >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : completion >= 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'}`}
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <p className="text-[10px] text-slate-500">
                {completion < 40 ? '⚠️ Complete your profile so doctors can better understand your health.' : '✅ Looking good! Fill in the remaining fields for a complete profile.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Diagnoses', value: userReports.length, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { label: 'Predictions', value: userPredictions.length, icon: Stethoscope, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Prescriptions', value: userReports.filter(r => r.prescriptions?.length > 0).length, icon: Pill, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' }
        ].map(stat => (
          <div key={stat.label} className={`glass-panel rounded-2xl p-4 border ${stat.border} flex flex-col items-center gap-2 text-center`}>
            <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Personal Info Card */}
        <div className="glass-panel rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
              <User className={`w-4 h-4 ${c.accent}`} />
            </div>
            <h3 className="text-sm font-bold text-white">Personal Information</h3>
          </div>

          <InputField label="Full Name" icon={User} field="name" placeholder="Your full name" value={form.name} {...fieldProps} />
          <InputField label="Age" icon={Calendar} field="age" type="number" placeholder="Your age" value={form.age} {...fieldProps} />
          <SelectField label="Gender" icon={Users} field="gender" options={GENDERS} placeholder="Select gender" value={form.gender} {...fieldProps} />
          <InputField label="Phone Number" icon={Phone} field="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} {...fieldProps} />
        </div>

        {/* Medical Info Card */}
        <div className="glass-panel rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
              <HeartPulse className={`w-4 h-4 ${c.accent}`} />
            </div>
            <h3 className="text-sm font-bold text-white">Medical Information</h3>
          </div>

          <SelectField label="Blood Group" icon={HeartPulse} field="blood_group" options={BLOOD_GROUPS} placeholder="Select blood group" value={form.blood_group} {...fieldProps} />
          <TextareaField label="Known Allergies" icon={AlertCircle} field="allergies" placeholder="e.g. Penicillin, Peanuts..." value={form.allergies} {...fieldProps} />
          <TextareaField label="Chronic Conditions" icon={Activity} field="chronic_conditions" placeholder="e.g. Diabetes Type 2, Hypertension..." value={form.chronic_conditions} {...fieldProps} />
        </div>

        {/* Address Card */}
        <div className="glass-panel rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
              <Shield className={`w-4 h-4 ${c.accent}`} />
            </div>
            <h3 className="text-sm font-bold text-white">Address & Location</h3>
          </div>
          <TextareaField label="Address" icon={Shield} field="address" placeholder="Your home or clinic address" value={form.address} {...fieldProps} />
        </div>

        {/* Emergency Contact Card */}
        <div className="glass-panel rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Emergency Contact</h3>
          </div>
          <InputField label="Contact Name" icon={User} field="emergency_contact_name" placeholder="Guardian / Relative name" value={form.emergency_contact_name} {...fieldProps} />
          <InputField label="Contact Phone" icon={Phone} field="emergency_contact" type="tel" placeholder="Emergency phone number" value={form.emergency_contact} {...fieldProps} />
        </div>
      </div>

      {/* Account Info (Read-Only) */}
      <div className="glass-panel rounded-2xl border border-white/[0.07] p-5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
          <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Shield className={`w-4 h-4 ${c.accent}`} />
          </div>
          <h3 className="text-sm font-bold text-white">Account Details</h3>
          <span className="ml-auto text-[10px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">Read Only</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Email Address', value: currentUser?.email, icon: Mail },
            { label: 'Account Role', value: currentUser?.role, icon: Shield },
            { label: 'Auth Provider', value: currentUser?.auth_provider || 'Google', icon: CheckCircle },
            { label: 'User ID', value: `#${currentUser?.user_id}`, icon: User },
          ].map(item => (
            <div key={item.label} className="space-y-1">
              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                <item.icon className="w-3 h-3" /> {item.label}
              </label>
              <p className="text-xs font-medium text-slate-300 truncate">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
