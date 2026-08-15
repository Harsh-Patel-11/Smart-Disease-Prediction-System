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
  Pill,
  Cake
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

/**
 * Calculate age in years from a date-of-birth string (YYYY-MM-DD).
 * Returns empty string if dob is falsy or invalid.
 */
const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? String(age) : '';
};

const InputField = ({ label, icon: Icon, field, type = 'text', placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium"
      />
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm">
        {value ? (
          <span className="text-slate-900 font-bold">{value}</span>
        ) : (
          <span className="text-slate-400 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

const SelectField = ({ label, icon: Icon, field, options, placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      {label}
    </label>
    {isEditing ? (
      <select
        value={value}
        onChange={e => onChange(field, e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer font-medium"
      >
        <option value="" className="text-slate-400">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o} className="text-slate-900">{o}</option>
        ))}
      </select>
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm">
        {value ? (
          <span className="text-slate-900 font-bold">{value}</span>
        ) : (
          <span className="text-slate-400 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

const TextareaField = ({ label, icon: Icon, field, placeholder, value, onChange, isEditing }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      {label}
    </label>
    {isEditing ? (
      <textarea
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all resize-none font-medium"
      />
    ) : (
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm min-h-[42px]">
        {value ? (
          <span className="text-slate-900 font-bold">{value}</span>
        ) : (
          <span className="text-slate-400 italic">Not provided</span>
        )}
      </div>
    )}
  </div>
);

export const UserProfile = () => {
  const { currentUser, updateUserProfile, predictions, reports } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date_of_birth: '',
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
      const dob = currentUser.date_of_birth || '';
      const computedAge = calculateAge(dob);
      setForm({
        name: currentUser.name || '',
        date_of_birth: dob,
        age: computedAge || currentUser.age || '',
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
  }, [currentUser]);

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate age whenever date_of_birth changes
      if (field === 'date_of_birth') {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };

  const handleSave = () => {
    updateUserProfile({ ...form, contact_no: form.phone });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    const dob = currentUser.date_of_birth || '';
    const computedAge = calculateAge(dob);
    setForm({
      name: currentUser.name || '',
      date_of_birth: dob,
      age: computedAge || currentUser.age || '',
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
    const fields = ['name', 'date_of_birth', 'gender', 'phone', 'blood_group', 'address'];
    const filled = fields.filter(f => form[f] && String(form[f]).trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const role = currentUser?.role || 'Patient';

  const userEmail = currentUser?.email?.toLowerCase();
  const userPhone = (currentUser?.contact_no || currentUser?.phone || '').replace(/[^0-9]/g, '');
  const userName = currentUser?.name?.toLowerCase();

  const userReports = reports.filter(r =>
    (userEmail && r.patient_email?.toLowerCase() === userEmail) ||
    (userPhone && r.patient_phone?.replace(/[^0-9]/g, '') === userPhone) ||
    r.user_id === currentUser?.user_id ||
    (userName && r.patient_name?.toLowerCase() === userName)
  );

  const userPredictions = predictions.filter(p =>
    (userEmail && p.patient_email?.toLowerCase() === userEmail) ||
    (userPhone && p.patient_phone?.replace(/[^0-9]/g, '') === userPhone) ||
    p.user_id === currentUser?.user_id ||
    (userName && p.user_name?.toLowerCase() === userName)
  );
  const completion = profileCompletion();

  const roleColors = {
    Admin: { grad: 'from-rose-500 to-pink-500', accent: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    Doctor: { grad: 'from-violet-600 to-purple-600', accent: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    Patient: { grad: 'from-indigo-600 to-violet-600', accent: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' }
  };
  const c = roleColors[role] || roleColors.Patient;
  const fieldProps = { isEditing, onChange: handleChange };

  /** Format a YYYY-MM-DD date into a human-readable string */
  const formatDob = (dob) => {
    if (!dob) return '';
    const d = new Date(dob);
    if (isNaN(d.getTime())) return dob;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your personal health profile and contact details</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-pulse">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Profile saved successfully!
          </div>
        )}
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md shadow-slate-200/50">
        <div className={`h-24 bg-gradient-to-r ${c.grad} opacity-30`} />

        <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${c.grad} text-white flex items-center justify-center text-3xl font-extrabold shadow-lg border-4 border-white relative group cursor-pointer`}>
              {form.name?.charAt(0)?.toUpperCase() || 'U'}
              <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'User'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${c.bg} ${c.accent} ${c.border}`}>
                  {role}
                </span>
                <span className="text-xs text-slate-500 font-medium">{currentUser?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Completion Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-700">Profile Completeness</span>
          <span className="text-indigo-600">{completion}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {/* Profile Form Details */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" /> Personal Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField label="Full Name" icon={User} field="name" placeholder="Harsh Patel" value={form.name} {...fieldProps} />

          {/* Date of Birth — 3-dropdown (Day / Month / Year) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Cake className="w-3.5 h-3.5 text-slate-400" />
              Date of Birth
            </label>
            {isEditing ? (() => {
              const [yyyy, mm, dd] = (form.date_of_birth || '--').split('-');
              const curYear = new Date().getFullYear();
              const months = [
                { val: '01', label: 'January' },   { val: '02', label: 'February' },
                { val: '03', label: 'March' },      { val: '04', label: 'April' },
                { val: '05', label: 'May' },         { val: '06', label: 'June' },
                { val: '07', label: 'July' },        { val: '08', label: 'August' },
                { val: '09', label: 'September' },   { val: '10', label: 'October' },
                { val: '11', label: 'November' },    { val: '12', label: 'December' }
              ];
              const years = Array.from({ length: 120 }, (_, i) => String(curYear - i));

              // Calculate valid days based on selected year & month
              const selectedYear = yyyy && yyyy !== '' ? parseInt(yyyy) : null;
              const selectedMonth = mm && mm !== '' ? parseInt(mm) : null;
              let maxDays = 31;
              if (selectedYear && selectedMonth) {
                maxDays = new Date(selectedYear, selectedMonth, 0).getDate();
              }
              const days = Array.from({ length: maxDays }, (_, i) => String(i + 1).padStart(2, '0'));

              const hasYear = !!selectedYear;
              const hasMonth = hasYear && !!selectedMonth;

              const updateDob = (part, val) => {
                const parts = { y: yyyy || '', m: mm || '', d: dd || '' };
                parts[part] = val;
                // Reset downstream when upstream changes
                if (part === 'y') { parts.m = ''; parts.d = ''; }
                if (part === 'm') { parts.d = ''; }
                if (parts.y && parts.m && parts.d) {
                  handleChange('date_of_birth', `${parts.y}-${parts.m}-${parts.d}`);
                } else if (parts.y && !parts.m) {
                  // Store partial so we can track the selected year
                  handleChange('date_of_birth', `${parts.y}--`);
                } else if (parts.y && parts.m && !parts.d) {
                  handleChange('date_of_birth', `${parts.y}-${parts.m}-`);
                } else {
                  handleChange('date_of_birth', '');
                }
              };

              const baseClasses = "flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm transition-all appearance-none font-medium";
              const activeClasses = `${baseClasses} bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 cursor-pointer`;
              const disabledClasses = `${baseClasses} bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-60`;

              return (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {/* Year (always enabled) */}
                    <select value={yyyy || ''} onChange={e => updateDob('y', e.target.value)} className={activeClasses}>
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {/* Month (enabled only after year) */}
                    <select
                      value={hasYear ? (mm || '') : ''}
                      onChange={e => updateDob('m', e.target.value)}
                      disabled={!hasYear}
                      className={hasYear ? activeClasses : disabledClasses}
                    >
                      <option value="">{hasYear ? 'Month' : 'Select year first'}</option>
                      {hasYear && months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                    </select>
                    {/* Day (enabled only after month) */}
                    <select
                      value={hasMonth ? (dd || '') : ''}
                      onChange={e => updateDob('d', e.target.value)}
                      disabled={!hasMonth}
                      className={hasMonth ? activeClasses : disabledClasses}
                    >
                      <option value="">{hasMonth ? 'Day' : 'Select month first'}</option>
                      {hasMonth && days.map(d => <option key={d} value={d}>{parseInt(d)}</option>)}
                    </select>
                  </div>
                  {/* Step indicator */}
                  {!form.age && hasYear && (
                    <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {!hasMonth ? 'Now select month →' : 'Now select day →'}
                    </p>
                  )}
                  {/* Live age preview */}
                  {form.age && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-700">{form.age} years old</span>
                      <span className="text-[10px] text-indigo-400 font-medium">· auto-calculated</span>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                {form.date_of_birth ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Cake className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-900 font-bold">{formatDob(form.date_of_birth)}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-100 border border-indigo-200/60">
                      <Calendar className="w-3 h-3 text-indigo-600" />
                      <span className="text-xs font-extrabold text-indigo-700">{form.age} yrs</span>
                    </div>
                  </>
                ) : (
                  <span className="text-slate-400 italic text-sm">Not provided</span>
                )}
              </div>
            )}
          </div>

          <SelectField label="Gender" icon={Users} field="gender" options={GENDERS} placeholder="Select Gender" value={form.gender} {...fieldProps} />
          <InputField label="Contact Phone" icon={Phone} field="phone" placeholder="+91 98765 43210" value={form.phone} {...fieldProps} />
          <SelectField label="Blood Group" icon={HeartPulse} field="blood_group" options={BLOOD_GROUPS} placeholder="Select Blood Group" value={form.blood_group} {...fieldProps} />
          <InputField label="Emergency Contact Name" icon={Phone} field="emergency_contact_name" placeholder="Contact Name" value={form.emergency_contact_name} {...fieldProps} />
          <InputField label="Emergency Contact Phone" icon={Phone} field="emergency_contact" placeholder="+91 99999 99999" value={form.emergency_contact} {...fieldProps} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80">
          <TextareaField label="Residential Address" icon={Mail} field="address" placeholder="123 Health Ave..." value={form.address} {...fieldProps} />
          <TextareaField label="Known Allergies" icon={AlertCircle} field="allergies" placeholder="Penicillin, Dust..." value={form.allergies} {...fieldProps} />
        </div>
      </div>

    </div>
  );
};

