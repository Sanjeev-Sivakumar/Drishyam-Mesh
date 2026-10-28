import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Key,
  Calendar,
  Share2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';

const INITIAL_REQUESTS = [
  {
    id: 'REQ-DPDP-2024-8841',
    verifierName: 'Tata Consultancy Services (TCS Corporate HR)',
    purpose: 'Pre-Employment Background Verification & Degree Authenticity',
    legalBasis: 'DPDP Act 2023 Sec 6(1) & AICTE Verification Reg. 14',
    requestDate: '2024-10-28 14:30',
    expiryHours: 72,
    status: 'PENDING_CONSENT',
    studentApaar: '9082-3145-6671',
    studentName: 'Devansh Gupta',
    claims: {
      degreeAndInstitution: true,
      completionYear: true,
      cgpaAndMarks: false,
      dateOfBirth: false,
      biometricHashToken: false
    }
  },
  {
    id: 'REQ-DPDP-2024-8819',
    verifierName: 'Infosys Limited (Global Talent Onboarding)',
    purpose: 'Campus Placement Technical Hiring Validation',
    legalBasis: 'Student Explicit Consent via Sentinel Gateway',
    requestDate: '2024-10-27 10:15',
    expiryHours: 48,
    status: 'CONSENT_GRANTED',
    studentApaar: '9082-3145-6671',
    studentName: 'Devansh Gupta',
    claims: {
      degreeAndInstitution: true,
      completionYear: true,
      cgpaAndMarks: true,
      dateOfBirth: false,
      biometricHashToken: false
    },
    authorizedToken: 'zk-proof-claim-0x891ab012...'
  },
  {
    id: 'REQ-DPDP-2024-8702',
    verifierName: 'Consular Services (Embassy Academic Attestation)',
    purpose: 'Higher Education Visa Credential Evaluation',
    legalBasis: 'Statutory Regulatory Transfer',
    requestDate: '2024-10-25 18:00',
    expiryHours: 120,
    status: 'CONSENT_REVOKED',
    studentApaar: '9082-3145-6671',
    studentName: 'Devansh Gupta',
    claims: {
      degreeAndInstitution: true,
      completionYear: true,
      cgpaAndMarks: false,
      dateOfBirth: false,
      biometricHashToken: false
    }
  }
];

export const StudentConsentGateway = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(INITIAL_REQUESTS[0]);

  const handleToggleClaim = (claimKey) => {
    if (selectedRequest.status !== 'PENDING_CONSENT') {
      showToast('Cannot modify claims of an already finalized consent request', 'warning');
      return;
    }
    const updated = {
      ...selectedRequest,
      claims: {
        ...selectedRequest.claims,
        [claimKey]: !selectedRequest.claims[claimKey]
      }
    };
    setSelectedRequest(updated);
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
  };

  const handleGrantConsent = (reqId) => {
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'CONSENT_GRANTED',
          authorizedToken: 'zk-blind-proof-' + Math.random().toString(16).substring(2, 10) + '...'
        };
      }
      return r;
    });
    setRequests(updated);
    setSelectedRequest(updated.find(r => r.id === reqId));
    showToast('Time-limited selective disclosure token issued to verifier under DPDP Act rules', 'success');
  };

  const handleRevokeConsent = (reqId) => {
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'CONSENT_REVOKED',
          authorizedToken: null
        };
      }
      return r;
    });
    setRequests(updated);
    setSelectedRequest(updated.find(r => r.id === reqId));
    showToast('Consent revoked. Verification endpoint immediately invalidated', 'error');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3 shadow-xs">
        <Lock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">DPDP Act 2023 Student Data Sovereignty & Blind Relay</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Employers and background verifiers only receive <strong className="text-slate-900">cryptographically signed selective claims</strong> that you explicitly approve.
            Raw student identifiers, Aadhaar numbers, and unselected personal attributes remain strictly private.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Verification Requests List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Incoming Verifier Inquiries ({requests.length})
          </h3>
          {requests.map(req => {
            const isSelected = selectedRequest?.id === req.id;
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/70 border-purple-400 shadow-xs ring-1 ring-purple-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{req.id}</span>
                  <Badge
                    variant={
                      req.status === 'CONSENT_GRANTED'
                        ? 'success'
                        : req.status === 'PENDING_CONSENT'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {req.status === 'CONSENT_GRANTED'
                      ? 'AUTHORIZED'
                      : req.status === 'PENDING_CONSENT'
                      ? 'PENDING'
                      : 'REVOKED'}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{req.verifierName}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{req.purpose}</p>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Requested: {req.requestDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Request Details & Selective Disclosure Claims Selector */}
        {selectedRequest && (
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white border-slate-200 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">{selectedRequest.verifierName}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedRequest.purpose}</p>
                </div>
                <Badge
                  variant={
                    selectedRequest.status === 'CONSENT_GRANTED'
                      ? 'success'
                      : selectedRequest.status === 'PENDING_CONSENT'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedRequest.status}
                </Badge>
              </div>

              {/* Request Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Legal Basis</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.legalBasis}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Student APAAR ID</span>
                  <span className="font-mono font-bold text-purple-700">{selectedRequest.studentApaar}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Token TTL Window</span>
                  <span className="font-semibold text-cyan-700">{selectedRequest.expiryHours} Hours</span>
                </div>
              </div>

              {/* Selective Disclosure Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Selective Disclosure Claim Configuration
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Zero-Knowledge Attribute Filtering
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Claim 1 */}
                  <div
                    onClick={() => handleToggleClaim('degreeAndInstitution')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRequest.claims.degreeAndInstitution ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Awarded Degree & Institution</p>
                        <p className="text-[10px] text-slate-500">Discloses: B.Tech CSE at Delhi Technological University</p>
                      </div>
                    </div>
                    <Badge variant={selectedRequest.claims.degreeAndInstitution ? 'success' : 'neutral'}>
                      {selectedRequest.claims.degreeAndInstitution ? 'DISCLOSED' : 'MASKED'}
                    </Badge>
                  </div>

                  {/* Claim 2 */}
                  <div
                    onClick={() => handleToggleClaim('completionYear')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRequest.claims.completionYear ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Academic Cohort & Completion Year</p>
                        <p className="text-[10px] text-slate-500">Discloses: Academic Year 2024-2025</p>
                      </div>
                    </div>
                    <Badge variant={selectedRequest.claims.completionYear ? 'success' : 'neutral'}>
                      {selectedRequest.claims.completionYear ? 'DISCLOSED' : 'MASKED'}
                    </Badge>
                  </div>

                  {/* Claim 3 */}
                  <div
                    onClick={() => handleToggleClaim('cgpaAndMarks')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRequest.claims.cgpaAndMarks ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Cumulative GPA & Transcripts</p>
                        <p className="text-[10px] text-slate-500">Discloses: CGPA 9.14 (Can be masked with ZK proof: &gt; 8.0)</p>
                      </div>
                    </div>
                    <Badge variant={selectedRequest.claims.cgpaAndMarks ? 'success' : 'neutral'}>
                      {selectedRequest.claims.cgpaAndMarks ? 'DISCLOSED' : 'MASKED'}
                    </Badge>
                  </div>

                  {/* Claim 4 */}
                  <div
                    onClick={() => handleToggleClaim('dateOfBirth')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRequest.claims.dateOfBirth ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Date of Birth & Residential Address</p>
                        <p className="text-[10px] text-slate-500">Protected PII — Recommended to keep masked</p>
                      </div>
                    </div>
                    <Badge variant={selectedRequest.claims.dateOfBirth ? 'success' : 'neutral'}>
                      {selectedRequest.claims.dateOfBirth ? 'DISCLOSED' : 'MASKED'}
                    </Badge>
                  </div>

                  {/* Claim 5 */}
                  <div
                    onClick={() => handleToggleClaim('biometricHashToken')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRequest.claims.biometricHashToken ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Biometric Token Hash Proof</p>
                        <p className="text-[10px] text-slate-500">Raw biometric data is never disclosed; proof token only</p>
                      </div>
                    </div>
                    <Badge variant={selectedRequest.claims.biometricHashToken ? 'success' : 'neutral'}>
                      {selectedRequest.claims.biometricHashToken ? 'DISCLOSED' : 'MASKED'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                {selectedRequest.status === 'CONSENT_GRANTED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevokeConsent(selectedRequest.id)}
                    icon={XCircle}
                  >
                    Revoke Consent Immediately
                  </Button>
                )}

                {selectedRequest.status === 'PENDING_CONSENT' && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRevokeConsent(selectedRequest.id)}
                    >
                      Decline Request
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleGrantConsent(selectedRequest.id)}
                      icon={ShieldCheck}
                    >
                      Authorize Selective Token
                    </Button>
                  </>
                )}

                {selectedRequest.status === 'CONSENT_REVOKED' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGrantConsent(selectedRequest.id)}
                    icon={ShieldCheck}
                  >
                    Re-Authorize Access
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
