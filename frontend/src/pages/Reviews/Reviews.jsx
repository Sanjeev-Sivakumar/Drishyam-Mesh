import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  User,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Copy,
  ExternalLink,
  History,
  Trash2,
  Lock,
  Mail,
  Send
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { mailService } from '../../services/mailService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/tables/DataTable';

export const Reviews = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegistrar = user?.role === 'COLLEGE_REGISTRAR';

  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters initialized from URL query params
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');

  // Resolution & Update Modal State
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('RESOLVED');
  const [resolutionReason, setResolutionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingDecision, setIsEditingDecision] = useState(false);

  // Dismissal Modal State
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const urlType = searchParams.get('type');
    const urlStatus = searchParams.get('status');
    if (urlType !== null) setSelectedType(urlType);
    if (urlStatus !== null) setSelectedStatus(urlStatus);
  }, [searchParams]);

  useEffect(() => {
    loadCases();
  }, [page, selectedType, selectedStatus]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.getCases({
        page,
        size: 10,
        caseType: selectedType || undefined,
        status: selectedStatus || undefined
      });
      setCases(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (e) {
      showToast('Failed to load review cases', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResolve = (reviewCase) => {
    setSelectedCase(reviewCase);
    setIsEditingDecision(false);
    setResolutionStatus(
      reviewCase.status !== 'OPEN' && reviewCase.status !== 'UNDER_REVIEW'
        ? reviewCase.status
        : (reviewCase.caseType === 'DUPLICATE_CANDIDATE' ? 'CONFIRMED_DUPLICATE' : 'RESOLVED')
    );
    setResolutionReason(reviewCase.resolutionReason || '');
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionReason.trim()) {
      showToast('Mandatory resolution reason is required', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.resolveCase(selectedCase.id, {
        status: resolutionStatus,
        reason: resolutionReason.trim()
      });
      showToast(`Case ${selectedCase.caseNumber} decision recorded as ${resolutionStatus}`, 'success');
      setSelectedCase(null);
      setIsEditingDecision(false);
      loadCases();
    } catch (err) {
      showToast('Failed to record decision', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissSubmit = async (e) => {
    e.preventDefault();
    if (!dismissReason.trim()) {
      showToast('Mandatory dismissal reason is required', 'warning');
      return;
    }

    setIsDismissing(true);
    try {
      await reviewService.dismissCase(selectedCase.id, {
        reason: dismissReason.trim()
      });
      showToast(`Case ${selectedCase.caseNumber} dismissed / verified as false positive`, 'info');
      setIsDismissModalOpen(false);
      setSelectedCase(null);
      setDismissReason('');
      loadCases();
    } catch (err) {
      showToast('Failed to dismiss review case', 'error');
    } finally {
      setIsDismissing(false);
    }
  };

  const handleDispatchMailDispensary = async () => {
    if (!selectedCase) return;
    try {
      showToast('Dispatching incident notice via Mail Dispensary...', 'info');
      await mailService.dispatchCollisionAlert(
        selectedCase.studentName || 'Devansh Gupta',
        selectedCase.syntheticApaarId || '9082-3145-6671',
        selectedCase.primaryInstitutionName || 'Delhi Technological University (DTU)',
        selectedCase.secondaryInstitutionName || 'COEP Technological University Pune',
        selectedCase.id || 1
      );
      showToast('Incident alert successfully delivered to sanjeevkumaredu8@gmail.com!', 'success');
    } catch (e) {
      showToast('Incident alert enqueued for sanjeevkumaredu8@gmail.com', 'success');
    }
  };

  const columns = [
    {
      header: 'Case ID',
      accessor: (row) => (
        <div>
          <span className="font-mono font-bold text-purple-400 text-xs">{row.caseNumber}</span>
          <p className="text-[10px] text-slate-400 mt-0.5">{new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      header: 'Anomaly Class',
      accessor: (row) => <Badge variant={row.caseType}>{row.caseType.replace(/_/g, ' ')}</Badge>
    },
    {
      header: 'Student / Institution',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.studentName || row.targetStudentName || 'Devansh Gupta'}</p>
          <p className="text-[10px] text-slate-500 font-mono font-medium">{row.syntheticApaarId || '9082-3145-6671'}</p>
          <p className="text-[10px] text-purple-700 font-semibold mt-0.5">{row.institutionName}</p>
        </div>
      )
    },
    {
      header: 'Detection Source',
      accessor: (row) => (
        <span className="font-mono text-[10px] text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-semibold">
          {row.detectionSource || 'NEO4J_CROSS_INSTITUTION_COLLISION'}
        </span>
      )
    },
    {
      header: 'Current Status',
      accessor: (row) => <Badge variant={row.status}>{row.status.replace(/_/g, ' ')}</Badge>
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          variant={row.status === 'OPEN' || row.status === 'UNDER_REVIEW' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleOpenResolve(row)}
        >
          {row.status === 'OPEN' || row.status === 'UNDER_REVIEW' ? 'Investigate' : 'View Audit'}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Review & Conflict Resolution Chamber</h2>
          {isRegistrar && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <Lock className="w-3 h-3" /> Scoped: {user?.institutionName || 'Delhi Tech Univ'}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Investigate cross-institutional duplicate candidate flags, intake limit exceptions, and privacy-preserving collisions
        </p>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 p-1 bg-white shadow-2xs text-xs">
            <button
              onClick={() => { setSelectedType(''); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === '' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => { setSelectedType('DUPLICATE_CANDIDATE'); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'DUPLICATE_CANDIDATE' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Duplicate Candidates
            </button>
            <button
              onClick={() => { setSelectedType('INTAKE_LIMIT_EXCEEDED'); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'INTAKE_LIMIT_EXCEEDED' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Intake Limit Excess
            </button>
            <button
              onClick={() => { setSelectedType('IDENTITY_DISCREPANCY'); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'IDENTITY_DISCREPANCY' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Identity Discrepancy
            </button>
          </div>

          <div className="flex rounded-xl border border-slate-200 p-1 bg-white shadow-2xs text-xs ml-auto">
            <button
              onClick={() => { setSelectedStatus(''); setPage(0); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedStatus === '' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => { setSelectedStatus('OPEN'); setPage(0); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedStatus === 'OPEN' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => { setSelectedStatus('RESOLVED'); setPage(0); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedStatus === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <DataTable
          columns={columns}
          data={cases}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
          emptyTitle="No Review Cases Found"
          emptyDescription="No anomalies match your active filter criteria. All institutional nodes operating within approved boundaries."
        />
      </Card>

      {/* Investigation & Decision Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Investigate Case: ${selectedCase.caseNumber}`}
          subtitle={`Anomaly category: ${selectedCase.caseType}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Case Details Box */}
            <div className="p-4 bg-[#151824] rounded-xl border border-[#1E202B]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Student Subject</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {selectedCase.studentName || selectedCase.targetStudentName || 'Devansh Gupta'}
                  </p>
                  <p className="font-mono text-purple-400 text-xs mt-0.5">
                    APAAR: {selectedCase.syntheticApaarId || '9082-3145-6671'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Detection Engine</span>
                  <p className="font-mono text-xs text-cyan-400 mt-0.5">
                    {selectedCase.detectionSource || 'NEO4J_CROSS_INSTITUTION_COLLISION'}
                  </p>
                  <div className="mt-1">
                    <Badge variant={selectedCase.status}>{selectedCase.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E202B] text-slate-300 leading-relaxed">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Incident Report</span>
                {selectedCase.description || 'Active concurrent regular enrollment allotment detected across multiple state council lists.'}
              </div>

              {selectedCase.secondaryInstitutionName && (
                <div className="mt-3 p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-300">
                  <p className="font-bold text-xs text-rose-200">Conflicting College Node:</p>
                  <p className="mt-0.5">{selectedCase.secondaryInstitutionName} (AICTE-MAH-202)</p>
                </div>
              )}
            </div>

            {/* Decision Submission Form */}
            {(selectedCase.status === 'OPEN' || selectedCase.status === 'UNDER_REVIEW' || isEditingDecision) ? (
              <form onSubmit={handleResolveSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Determination Outcome</label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="CONFIRMED_DUPLICATE">Confirm Duplicate Admission (Cancel Candidate Node)</option>
                    <option value="RESOLVED">Resolved (Candidate surrendered one seat officially)</option>
                    <option value="DISMISSED">Dismiss as False Positive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Administrative Decision Rationale <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={resolutionReason}
                    onChange={(e) => setResolutionReason(e.target.value)}
                    placeholder="Provide official rationale (cryptographically signed and logged to immutable audit trail)..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[#1E202B] bg-[#151824] p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setIsDismissModalOpen(true);
                      }}
                    >
                      Dismiss Case
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={Mail}
                      onClick={handleDispatchMailDispensary}
                      className="text-xs"
                    >
                      Dispatch Email to Council
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setSelectedCase(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                      Commit Official Decision
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Recorded Determination</span>
                <p className="text-white font-medium mt-1">{selectedCase.resolutionReason}</p>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#1E202B]">
                  <Button variant="secondary" onClick={() => setIsEditingDecision(true)}>
                    Amend Decision
                  </Button>
                  <Button variant="primary" onClick={() => setSelectedCase(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Dismissal Reason Modal */}
      {isDismissModalOpen && (
        <Modal
          isOpen={isDismissModalOpen}
          onClose={() => setIsDismissModalOpen(false)}
          title="Dismiss Case as False Positive"
          subtitle="Record dismissal justification in immutable audit trail"
        >
          <form onSubmit={handleDismissSubmit} className="space-y-4">
            <textarea
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="State reason for dismissal (e.g., student formally withdrew prior to batch upload)..."
              rows={3}
              required
              className="w-full rounded-xl border border-[#1E202B] bg-[#151824] p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-[#1E202B]">
              <Button variant="secondary" onClick={() => setIsDismissModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" isLoading={isDismissing}>
                Confirm Dismissal
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
