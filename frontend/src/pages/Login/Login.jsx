import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, ShieldAlert, CheckCircle2, UserPlus, Key, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(username, password);
      showToast(`Authenticated as ${user.fullName} (${user.role})`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Authentication error. Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillAccount = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-md p-2 mb-1 border border-slate-200">
            <img src="/AICTE.png" alt="AICTE Official Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AICTE Sentinel-Ledger</h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
            National Zero-Trust Academic Admission Intelligence & Verifiable Credential Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-7 border border-slate-200 text-slate-900 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Authorized Role Authentication</h2>
            <p className="text-xs text-slate-500 mt-0.5">Role-Based Access Control (RBAC) enforced session gateway</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Username / System Role ID"
              icon={User}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />

            <Input
              label="Secret Passcode"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              size="lg"
            >
              Sign In to Mesh Gateway <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Pre-Configured Database Credentials */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Select Pre-Configured Database Account
              </span>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">LIVE DB VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillAccount('admin', 'Admin@123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'admin'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-xs">AICTE Central Admin</p>
                  <span className="text-[8px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-mono font-bold">ALL</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">admin / Admin@123</p>
              </button>

              <button
                type="button"
                onClick={() => fillAccount('registrar_delhi', 'Registrar@123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'registrar_delhi'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-xs">Delhi Registrar</p>
                  <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-mono font-bold">DELHI</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">registrar_delhi</p>
              </button>

              <button
                type="button"
                onClick={() => fillAccount('registrar_maha', 'Registrar@123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'registrar_maha'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-xs">Maha Registrar</p>
                  <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-mono font-bold">MAHA</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">registrar_maha</p>
              </button>

              <button
                type="button"
                onClick={() => fillAccount('verifier_corp', 'Verifier@123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'verifier_corp'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-xs">Employer Verifier</p>
                  <span className="text-[8px] bg-cyan-100 text-cyan-800 px-1 py-0.2 rounded font-mono font-bold">VERIFY</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">verifier_corp</p>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <p className="text-[10px] text-slate-500 text-center font-mono">
          Zero-Trust Ingestion Engine • SHA-256 Ledger Provenance • Privacy-Preserving PSI
        </p>
      </div>
    </div>
  );
};

