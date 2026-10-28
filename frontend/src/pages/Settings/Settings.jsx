import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Database, Key, Lock, Server, Cpu, CheckCircle2, User, Save, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFullName(data.fullName || '');
    } catch (e) {
      console.error('Error loading profile', e);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Display name cannot be empty', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({ fullName: fullName.trim() });
      setProfile(updated);
      setFullName(updated.fullName);
      showToast('Profile full name updated in decentralized registry', 'success');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          parsed.fullName = updated.fullName;
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch (ignored) {}
      }
    } catch (err) {
      showToast('Failed to update profile name', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl text-slate-900">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Node Configuration & Security Parameters</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage operator profile, inspect institutional tenant boundary, and review zero-trust cryptographic protocols
        </p>
      </div>

      {/* Account Profile Card */}
      <Card
        title="Institutional Node Operator Profile"
        subtitle="Display identity is configurable; institutional tenant bounds are cryptographically locked"
        className="bg-white border-slate-200 shadow-xs"
      >
        <form onSubmit={handleUpdateName} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Editable Field */}
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200">
              <label className="text-purple-800 block text-[11px] font-bold uppercase mb-1">
                Display Full Name <span className="text-purple-600 font-normal lowercase">(Editable)</span>
              </label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                />
                <Button type="submit" isLoading={isSaving} icon={Save} size="sm">
                  Save
                </Button>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                This operator identity is affixed to all staged Sandboxed Diff chamber signatures.
              </span>
            </div>

            {/* Read-Only Fields */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Username <span className="text-slate-400 font-normal">(Read-Only)</span>
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1.5 block">
                {profile?.username || user?.username}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Assigned RBAC Role <span className="text-slate-400 font-normal">(Fixed Authority)</span>
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-bold text-purple-700 font-mono">{profile?.role || user?.role}</span>
                <Badge variant="purple">ENFORCED</Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Institutional Node Tenant <span className="text-slate-400 font-normal">(Hardware Scoped)</span>
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1.5 block">
                {profile?.institutionName || user?.institutionName || 'Central AICTE Administration Mesh'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                Cryptographic Tenant Boundary Key Fingerprint
              </span>
              <span className="text-xs font-mono text-cyan-800 font-bold mt-1.5 block">
                ED25519:7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b
              </span>
            </div>
          </div>
        </form>
      </Card>

      {/* Cryptographic & Platform Security Specs */}
      <Card
        title="Zero-Trust Architecture Specifications"
        subtitle="Cryptographic protocols and verifiable engine parameters"
        className="bg-white border-slate-200 shadow-xs"
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Digital Signature Algorithm</p>
                <p className="text-slate-500 text-[11px] font-medium">Ed25519 Curve25519 with SHA-256 for verifiable academic credentials</p>
              </div>
            </div>
            <Badge variant="purple">Ed25519-SHA256</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Private Set Intersection (PSI)</p>
                <p className="text-slate-500 text-[11px] font-medium">Diffie-Hellman zero-knowledge multi-party cross-college collision detection</p>
              </div>
            </div>
            <Badge variant="success">ECDH-PSI</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Cognitive Vision Pipeline</p>
                <p className="text-slate-500 text-[11px] font-medium">Sentinel Cognitive Vision Engine with autonomous non-academic filter</p>
              </div>
            </div>
            <Badge variant="info">Active v4.2</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Autonomous Orchestration</p>
                <p className="text-slate-500 text-[11px] font-medium">n8n distributed event workflows with Neo4j entity graph projection</p>
              </div>
            </div>
            <Badge variant="neutral">MESH RUNNING</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
