import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  ShieldAlert,
  Building2,
  Scale,
  Award,
  History,
  Settings,
  ShieldCheck,
  Zap,
  Share2,
  Database,
  Lock,
  FileDiff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';

export const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const [openReviewsCount, setOpenReviewsCount] = useState(2);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const res = await reviewService.getCases({ status: 'OPEN', size: 1 });
        if (res && res.totalElements !== undefined) {
          setOpenReviewsCount(res.totalElements);
        }
      } catch (e) {
        // Fallback count
      }
    };
    fetchPendingReviews();
  }, []);

  const navItems = [
    { name: 'National Overview', path: '/', icon: LayoutDashboard },
    {
      name: 'n8n Workflow Engine',
      path: '/workflows',
      icon: Zap,
      highlightBadge: 'AICTE AUTO'
    },
    {
      name: 'Neo4j Knowledge Mesh',
      path: '/knowledge-mesh',
      icon: Share2,
      highlightBadge: 'GRAPH'
    },
    {
      name: 'Document Ingestion & OCR',
      path: '/imports',
      icon: UploadCloud,
      roles: ['AICTE_ADMIN', 'COLLEGE_REGISTRAR']
    },
    {
      name: 'Student Registry',
      path: '/students',
      icon: Users,
      roles: ['AICTE_ADMIN', 'COLLEGE_REGISTRAR']
    },
    {
      name: 'Review Center',
      path: '/reviews',
      icon: ShieldAlert,
      roles: ['AICTE_ADMIN', 'COLLEGE_REGISTRAR'],
      badge: openReviewsCount > 0 ? openReviewsCount : null
    },
    {
      name: 'Intake Compliance',
      path: '/compliance',
      icon: Scale,
      roles: ['AICTE_ADMIN', 'COLLEGE_REGISTRAR']
    },
    {
      name: 'Institutions Directory',
      path: '/institutions',
      icon: Building2,
      roles: ['AICTE_ADMIN']
    },
    {
      name: 'Credential Verification',
      path: '/verification',
      icon: Award
    },
    {
      name: 'Tamper-Evident Audit',
      path: '/audit-logs',
      icon: History,
      roles: ['AICTE_ADMIN', 'COLLEGE_REGISTRAR']
    },
    {
      name: 'Settings & Key Vault',
      path: '/settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen text-slate-700 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 gap-2.5 bg-white">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
          <img src="/AICTE.png" alt="AICTE Official Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">Drishyam Mesh</span>
            <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
              AICTE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold leading-tight">AICTE Zero-Trust Grid</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Autonomous Mesh Modules
        </div>
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) {
            return null;
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-sm border border-purple-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {item.badge}
                </span>
              ) : item.highlightBadge ? (
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-purple-100 text-purple-700 border border-purple-200">
                  {item.highlightBadge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Security Context & Mesh Health */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Zero-Trust Context</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-purple-600">PSI-ACTIVE</span>
        </div>
        <p className="text-xs font-bold text-slate-900 truncate">
          {user?.role === 'AICTE_ADMIN' ? 'National AICTE Registry' : (user?.institutionName || 'Authorized Verifier')}
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Role: <strong className="text-purple-700 font-semibold">{user?.role}</strong></span>
          <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-mono">v4.2</span>
        </div>
      </div>
    </aside>
  );
};

