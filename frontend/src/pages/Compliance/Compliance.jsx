import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Info,
  ShieldAlert,
  Lock,
  FileSpreadsheet
} from 'lucide-react';
import { complianceService } from '../../services/complianceService';
import { institutionService } from '../../services/institutionService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { RegulatoryReportsModal } from '../../components/reports/RegulatoryReportsModal';

export const Compliance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRegistrar = user?.role === 'COLLEGE_REGISTRAR';

  const [complianceList, setComplianceList] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [selectedInstId, setSelectedInstId] = useState(isRegistrar ? String(user?.institutionId || 1) : '');
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [isLoading, setIsLoading] = useState(true);

  // Regulatory reports modal
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Flag inspection modal
  const [inspectedFlag, setInspectedFlag] = useState(null);

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    loadCompliance();
  }, [selectedInstId, selectedYear]);

  const loadInstitutions = async () => {
    try {
      const data = await institutionService.getAllInstitutions();
      setInstitutions(data);
      if (isRegistrar && user?.institutionId) {
        const myInst = data.find((i) => i.id === user.institutionId);
        if (myInst) setCurrentInstitution(myInst);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCompliance = async () => {
    setIsLoading(true);
    try {
      const data = await complianceService.getIntakeCompliance({
        institutionId: isRegistrar ? user?.institutionId : (selectedInstId || undefined),
        academicYear: selectedYear
      });
      setComplianceList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const exceededPrograms = complianceList.filter((item) => item.isExceeded);
  const totalApprovedIntake = complianceList.reduce((acc, curr) => acc + (curr.approvedIntake || 0), 0);
  const totalAdmittedStudents = complianceList.reduce((acc, curr) => acc + (curr.currentAdmitted || curr.admittedCount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Approved Intake & Quota Compliance</h2>
            {isRegistrar && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Lock className="w-3 h-3" /> Scoped: {user?.institutionName || 'Delhi Tech Univ'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Rules-driven real-time monitoring of AICTE-approved enrollment capacity and supernumerary quotas
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button onClick={() => setIsReportsModalOpen(true)} icon={FileSpreadsheet}>
            Generate AICTE Reports
          </Button>
        </div>
      </div>

      {/* Institution Information Card for College Registrar */}
      {isRegistrar && currentInstitution && (
        <Card className="bg-white border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                  Registered Node Profile
                </span>
                <span className="text-xs text-purple-700 font-mono font-bold">[{currentInstitution.code}]</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">{currentInstitution.name}</h3>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{currentInstitution.city}, {currentInstitution.state}</span>
                </div>
                {currentInstitution.contactEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentInstitution.contactEmail}</span>
                  </div>
                )}
                {currentInstitution.contactPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentInstitution.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Sanctioned Intake</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block font-mono">
                  {currentInstitution.configuredIntake || totalApprovedIntake} seats
                </span>
                <span className="text-[10px] text-slate-400">Configured Limit</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Admitted</span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block font-mono">
                  {totalAdmittedStudents} students
                </span>
                <span className="text-[10px] text-slate-400">AY {selectedYear}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Row with Academic Year Dropdown */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {!isRegistrar && user?.role === 'AICTE_ADMIN' && (
              <div className="min-w-[220px]">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Filter Institution:</label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-medium"
                >
                  <option value="">All Institutions</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 font-medium"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Info className="w-4 h-4 text-purple-600 shrink-0" />
            <span>AICTE Compliance Rule: Intake counts officially admitted eligible students; uncommitted records excluded.</span>
          </div>
        </div>
      </Card>

      {/* Excess Intake Alert Banner */}
      {exceededPrograms.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-900">Excess Intake Alert ({exceededPrograms.length} Programs Detected)</h4>
              <p className="mt-0.5 text-rose-800 leading-relaxed font-medium">
                The following programs have admitted more candidates than the AICTE approved limit for {selectedYear}.
                Flagged in Review Center for administrative audit and supernumerary seat justification.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/reviews?type=INTAKE_LIMIT_EXCEEDED&status=OPEN')}
          >
            Open Reviews
          </Button>
        </div>
      )}

      {/* Grid of Programs */}
      {isLoading ? (
        <LoadingSpinner message="Calculating intake compliance statistics..." />
      ) : complianceList.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 text-xs bg-white border-slate-200">
          <p className="font-bold text-sm text-slate-900">Quota Data Unavailable for this Academic Year</p>
          <p className="mt-1 font-medium">No program intake limits are configured for academic year {selectedYear}.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceList.map((item, index) => {
            const isExceeded = item.isExceeded;
            const percentage = Math.min(item.utilizationRate || 95, 100);
            const remaining = Math.max(0, item.approvedIntake - item.currentAdmitted);
            const excess = Math.max(0, item.currentAdmitted - item.approvedIntake);

            return (
              <Card
                key={index}
                className={`transition-all bg-white p-5 shadow-xs ${
                  isExceeded ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {item.institutionName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.programName}</h4>
                  </div>
                  {isExceeded ? (
                    <Badge variant="danger">Intake Alert</Badge>
                  ) : percentage >= 95 ? (
                    <Badge variant="warning">Near Limit</Badge>
                  ) : (
                    <Badge variant="success">Compliant</Badge>
                  )}
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-xl text-center text-xs border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Approved</span>
                    <span className="font-bold text-slate-800 font-mono">{item.approvedIntake}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Admitted</span>
                    <span className="font-bold text-slate-900 font-mono">{item.currentAdmitted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {isExceeded ? 'Excess' : 'Available'}
                    </span>
                    <span className={`font-bold font-mono ${isExceeded ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {isExceeded ? `+${excess}` : remaining}
                    </span>
                  </div>
                </div>

                {/* Utilization Progress Meter */}
                <div className="mt-4 space-y-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-600' : percentage > 90 ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
                    <span>Intake Utilization:</span>
                    <span className={`font-bold font-mono ${isExceeded ? 'text-rose-700' : 'text-purple-700'}`}>
                      {item.utilizationRate || percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center font-medium">
                  <span>AY: {item.academicYear}</span>
                  {isExceeded && (
                    <button
                      onClick={() => setInspectedFlag(item)}
                      className="inline-flex items-center gap-1 text-cyan-800 hover:text-cyan-950 font-bold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Flag
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Intake Flag Inspection Modal */}
      {inspectedFlag && (
        <Modal
          isOpen={!!inspectedFlag}
          onClose={() => setInspectedFlag(null)}
          title={`Intake Alert: ${inspectedFlag.programName}`}
          subtitle={`Capacity anomaly detected for academic year ${inspectedFlag.academicYear}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-200">Excess Seat Utilization Detected</p>
                <p className="mt-0.5 text-rose-300 leading-relaxed">
                  Admitted students ({inspectedFlag.currentAdmitted}) exceed the approved AICTE limit of ({inspectedFlag.approvedIntake}) by <strong>{inspectedFlag.currentAdmitted - inspectedFlag.approvedIntake}</strong> seats.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-[#151824] rounded-xl border border-[#1E202B]">
              <div>
                <span className="text-[11px] text-slate-400 block">Department / Program</span>
                <span className="font-bold text-white">{inspectedFlag.programName}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Academic Year</span>
                <span className="font-bold text-white">{inspectedFlag.academicYear}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Approved Intake</span>
                <span className="font-bold text-white font-mono">{inspectedFlag.approvedIntake} seats</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Total Admitted Students</span>
                <span className="font-bold text-white font-mono">{inspectedFlag.currentAdmitted} students</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Excess Seats</span>
                <span className="font-bold text-rose-400 font-mono">+{inspectedFlag.currentAdmitted - inspectedFlag.approvedIntake} seats</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Compliance Status</span>
                <Badge variant="danger">INTAKE ALERT</Badge>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1E202B]">
              <Button variant="secondary" onClick={() => setInspectedFlag(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setInspectedFlag(null);
                  navigate('/reviews?type=INTAKE_LIMIT_EXCEEDED&status=UNDER_REVIEW');
                }}
              >
                View in Review Center
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
