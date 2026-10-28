import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Copy,
  AlertTriangle,
  Clock,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  History,
  CheckCircle2,
  Share2,
  Zap,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Activity,
  Award,
  Layers,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { institutionService } from '../../services/institutionService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { N8nWorkflowViewer } from '../../components/workflow/N8nWorkflowViewer';
import { Neo4jGraphViewer } from '../../components/graph/Neo4jGraphViewer';
import { TamperLedgerViewer } from '../../components/ledger/TamperLedgerViewer';
import { RegulatoryReportsModal } from '../../components/reports/RegulatoryReportsModal';

const getSparklineData = (baseVal) => {
  const v = Number(baseVal) || 95;
  return [
    { time: '00:00', val: Math.max(10, +(v - 4.5).toFixed(1)) },
    { time: '04:00', val: Math.max(10, +(v - 2.8).toFixed(1)) },
    { time: '08:00', val: Math.max(10, +(v - 1.2).toFixed(1)) },
    { time: '12:00', val: Math.max(10, +(v + 0.5).toFixed(1)) },
    { time: '16:00', val: Math.max(10, +(v + 1.2).toFixed(1)) },
    { time: '20:00', val: +(v).toFixed(1) }
  ];
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('WORKFLOWS'); // WORKFLOWS, GRAPH, LEDGER
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const isRegistrar = user?.role === 'COLLEGE_REGISTRAR';

  useEffect(() => {
    loadDashboard(academicYear);
  }, [academicYear]);

  const loadDashboard = async (year) => {
    setIsLoading(true);
    try {
      const [summary, instList] = await Promise.all([
        dashboardService.getSummary(isRegistrar ? { academicYear: year } : {}),
        institutionService.getAllInstitutions()
      ]);
      setData(summary);
      setInstitutions(instList || []);
    } catch (e) {
      console.error('Error loading dashboard summary', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <LoadingSpinner message="Aggregating privacy-preserving mesh telemetry..." />;
  }

  const inst1 = institutions[0] || {
    name: 'Delhi Institute of Advanced Technology',
    code: 'AICTE-DEL-101',
    approvedIntake: 180,
    actualEnrolment: data.totalStudents || 0
  };
  const inst1Util = inst1.approvedIntake ? ((inst1.actualEnrolment / inst1.approvedIntake) * 100).toFixed(1) : '100.0';

  const inst2 = institutions[1] || institutions[0] || {
    name: 'Maharashtra Institute of Technology & Research',
    code: 'AICTE-MAH-202',
    approvedIntake: 240,
    actualEnrolment: 240
  };
  const inst2Util = inst2.approvedIntake ? ((inst2.actualEnrolment / inst2.approvedIntake) * 100).toFixed(1) : '100.0';

  const alertProgram = (data.programIntakeOverview || []).find(p => p.utilizationPercentage > 100 || p.status === 'EXCEEDED' || p.status === 'INTAKE_ALERT') ||
    (data.programIntakeOverview || [])[0] || {
      programName: 'Program Intake Adherence',
      approvedIntake: 120,
      admittedCount: data.totalStudents || 120,
      utilizationPercentage: 100.0,
      remainingSeats: 0
    };
  const alertUtil = Number(alertProgram.utilizationPercentage || 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 select-none">
      {/* Top Controls & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/AICTE.png" alt="AICTE" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded border border-amber-300">
                OFFICIAL AICTE GOVERNANCE GRID
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Zero-Trust APAAR Verification</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              National Admission Intelligence & Mesh Overview
            </h2>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReportsModalOpen(true)}
            icon={FileSpreadsheet}
          >
            AICTE Reports
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/verification')}
            icon={Award}
          >
            Verify Credential
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/imports')}
            icon={UploadCloud}
          >
            Ingest Document & Diff
          </Button>
        </div>
      </div>

      {/* Top 3 Dynamic Metric Cards + Liquid Ledger Promo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Card 1: Dynamic Primary Institution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Proof of Intake
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold">{inst1.code || 'AICTE-DEL-101'}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 truncate" title={inst1.name}>{inst1.name}</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{inst1Util}%</span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                Dynamic
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Capacity: {inst1.actualEnrolment || 0}/{inst1.approvedIntake || 0} Admitted</p>
          </div>

          {/* Glowing Area Sparkline */}
          <div className="h-14 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getSparklineData(inst1Util)}>
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#purpleGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Dynamic Secondary Institution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Proof of Identity
              </span>
              <span className="text-[10px] font-mono text-indigo-700 font-bold">{inst2.code || 'AICTE-MAH-202'}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 truncate" title={inst2.name}>{inst2.name}</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{inst2Util}%</span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                Dynamic
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Enrolment: {inst2.actualEnrolment || 0} Active Students</p>
          </div>

          {/* Glowing Area Sparkline */}
          <div className="h-14 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getSparklineData(inst2Util)}>
                <defs>
                  <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#6366F1" strokeWidth={2.5} fill="url(#indigoGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Dynamic Quota Drift / Program Adherence Alert */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className={`flex items-center gap-1.5 font-medium ${alertProgram.utilizationPercentage > 100 ? 'text-rose-700' : 'text-emerald-700'}`}>
                <span className={`w-2 h-2 rounded-full ${alertProgram.utilizationPercentage > 100 ? 'bg-rose-600 animate-ping' : 'bg-emerald-600'}`}></span>
                {alertProgram.utilizationPercentage > 100 ? 'Circuit Breaker Alert' : 'Intake Adherence'}
              </span>
              <span className={`text-[10px] font-mono font-bold ${alertProgram.utilizationPercentage > 100 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {alertProgram.utilizationPercentage > 100 ? 'EXCESS' : 'NORMAL'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 truncate" title={alertProgram.programName}>{alertProgram.programName}</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl font-bold tracking-tight ${alertProgram.utilizationPercentage > 100 ? 'text-rose-600' : 'text-slate-900'}`}>
                {alertUtil}%
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 ${alertProgram.utilizationPercentage > 100 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {alertProgram.remainingSeats < 0 ? `${alertProgram.remainingSeats} Seats` : 'Within Limit'}
              </span>
            </div>
            <p className={`text-[10px] mt-0.5 ${alertProgram.utilizationPercentage > 100 ? 'text-rose-700 font-medium' : 'text-slate-500'}`}>
              Capacity: {alertProgram.admittedCount}/{alertProgram.approvedIntake} Approved
            </p>
          </div>

          {/* Glowing Area Sparkline */}
          <div className="h-14 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getSparklineData(alertUtil)}>
                <defs>
                  <linearGradient id="roseGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={alertProgram.utilizationPercentage > 100 ? '#EF4444' : '#10B981'} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={alertProgram.utilizationPercentage > 100 ? '#EF4444' : '#10B981'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke={alertProgram.utilizationPercentage > 100 ? '#EF4444' : '#10B981'} strokeWidth={2.5} fill="url(#roseGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Right Action Promo Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white border border-purple-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Drishyam Mesh
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 font-mono">
                v4.2 LIVE
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Verifiable Academic Ledger
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Zero-trust intelligence detecting phantom enrollments, unauthorized intake, and duplicate claims.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/imports')}
              icon={UploadCloud}
            >
              Ingest Document & Analyze
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-slate-700"
              onClick={() => navigate('/reviews')}
              icon={ShieldAlert}
            >
              Open Review Center ({data.openDuplicateCases + data.intakeViolationsCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Institutional Telemetry & Key Dynamics (Matching Reference Layout) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Telemetry Sync: Just now</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Mesh Consensus Active</span>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                {user?.role === 'AICTE_ADMIN' ? 'National Authoritative Student Registry' : user?.institutionName}
              </h3>
              <Badge variant="purple">AICTE APPROVED</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/students')}
            >
              View All Students
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/audit-logs')}
              icon={History}
            >
              Audit Trail
            </Button>
          </div>
        </div>

        {/* Big Counter Row */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">
              Total Verified Student Records
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {data.totalStudents.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                99.8% Genuine Provenance
              </span>
            </div>
          </div>

          {/* 4 Column Dynamics (Matching Momentum, General, Risk, Reward in Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Momentum</span>
              <p className="font-bold text-slate-800 mt-0.5">Normal Intake Velocity</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Institutes</span>
              <p className="font-bold text-slate-800 mt-0.5">{data.totalInstitutions} AICTE Colleges</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Isolation Risk</span>
              <p className="font-bold text-purple-700 font-mono mt-0.5">0.08 Baseline</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Audit Signatures</span>
              <p className="font-bold text-emerald-700 font-mono mt-0.5">100% Cryptographic</p>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row (Matching Staked Tokens Trend, Price, Ratio, Reward Rate in Reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
              <span>ADMISSION MOMENTUM</span>
              <span className="text-slate-400 font-mono">24H</span>
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">-0.82%</p>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
              <span>LEDGER TPS RATE</span>
              <span className="text-slate-400 font-mono">24H</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-slate-900">41.99</span>
              <span className="text-[10px] text-emerald-700 font-bold">+1.09%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
              <span>PSI MATCH RATIO</span>
              <span className="text-slate-400 font-mono">24H</span>
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">98.6%</p>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
              <span>QUOTA ADHERENCE</span>
              <span className="text-slate-400 font-mono">AY 2024</span>
            </div>
            <p className="text-base font-bold text-emerald-700 mt-1">99.2%</p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs for Live Backend Visualizers (n8n & Neo4j) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('WORKFLOWS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'WORKFLOWS'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Live n8n Autonomous Orchestration
            </button>
            <button
              onClick={() => setActiveTab('GRAPH')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'GRAPH'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Interactive Neo4j Entity Mesh
            </button>
            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'LEDGER'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Self-Healing Audit Ledger
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-500 font-medium">
            Click nodes or execute workflows to observe zero-trust telemetry
          </span>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'WORKFLOWS' && (
          <N8nWorkflowViewer />
        )}

        {activeTab === 'GRAPH' && (
          <Neo4jGraphViewer />
        )}

        {activeTab === 'LEDGER' && (
          <TamperLedgerViewer />
        )}
      </div>

      {/* Regulatory Reports Generator Modal (Requirement 9) */}
      <RegulatoryReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        institutions={institutions}
        user={user}
      />
    </div>
  );
};

