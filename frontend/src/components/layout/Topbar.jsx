import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bell,
  Search,
  Shield,
  ChevronDown,
  Lock,
  UserCheck,
  Settings,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = () => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'National Admission Governance & Mesh Intelligence';
    if (path.startsWith('/workflows')) return 'n8n Autonomous Workflow Orchestration Engine';
    if (path.startsWith('/knowledge-mesh')) return 'Neo4j Multi-Institution Relationship Graph Mesh';
    if (path.startsWith('/students')) return 'Authoritative Student Registry & APAAR Records';
    if (path.startsWith('/imports')) return 'Document Ingestion, OCR & Sandboxed Diff Chamber';
    if (path.startsWith('/reviews')) return 'Review & Conflict Resolution Center';
    if (path.startsWith('/institutions')) return 'AICTE Approved Institutions Directory';
    if (path.startsWith('/compliance')) return 'Approved Program Intake & Quota Compliance';
    if (path.startsWith('/verification')) return 'Cryptographic Credential Verification & Offline QR';
    if (path.startsWith('/audit-logs')) return 'Self-Healing Append-Only Cryptographic Audit Ledger';
    if (path.startsWith('/settings')) return 'Zero-Trust Security Config & Key Vault';
    return 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitch = async (username, password) => {
    try {
      await switchRole(username, password);
    } catch (e) {
      console.error('Failed to switch live role', e);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      {/* Title & Breadcrumbs */}
      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <img src="/AICTE.png" alt="AICTE" className="w-8 h-8 object-contain shrink-0" />
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
            <span className="font-bold text-slate-700">DRISHYAM MESH • AICTE REGISTRY</span>
            <span>/</span>
            <span className="text-purple-700 font-bold uppercase">
              {location.pathname.substring(1) || 'OVERVIEW'}
            </span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight mt-0.5 truncate max-w-md">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Live RBAC Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Role:</span>
        <button
          onClick={() => handleQuickSwitch('admin', 'Admin@123')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            user?.role === 'AICTE_ADMIN'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Full access to national mesh, all colleges, and audit"
        >
          AICTE Admin
        </button>
        <button
          onClick={() => handleQuickSwitch('registrar_delhi', 'Registrar@123')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            user?.username === 'registrar_delhi'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Restricted to Delhi Institute of Advanced Technology"
        >
          Delhi Registrar
        </button>
        <button
          onClick={() => handleQuickSwitch('registrar_maha', 'Registrar@123')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            user?.username === 'registrar_maha'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Restricted to Maharashtra Institute of Technology"
        >
          Maha Registrar
        </button>
        <button
          onClick={() => handleQuickSwitch('verifier_corp', 'Verifier@123')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            user?.role === 'VERIFIER'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Restricted to Credential Verification"
        >
          Verifier
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Search Input Box */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-44 lg:w-56 h-8.5 rounded-xl bg-slate-50 border border-slate-200 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 transition-colors"
          />
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px]">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-[11px] leading-tight truncate max-w-[110px]">
                  {user?.fullName?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[9px] font-mono bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold border border-purple-200">
                  {user?.role === 'AICTE_ADMIN' ? 'ROOT' : 'AUTH'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 text-xs animate-scale-up"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/60">
                <p className="font-bold text-slate-900">{user?.fullName}</p>
                <p className="text-slate-500 truncate text-[11px] mt-0.5">{user?.email}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Security Role:</span>
                  <Badge variant="purple" size="sm">{user?.role}</Badge>
                </div>
              </div>

              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left cursor-pointer transition-colors"
              >
                <Shield className="w-3.5 h-3.5 mr-2.5 text-purple-600" />
                Zero-Trust Key Management
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left font-semibold cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 mr-2.5 text-rose-600" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

