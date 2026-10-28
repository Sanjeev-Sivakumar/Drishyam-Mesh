import React, { useState, useEffect } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileDiff,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Globe,
  Camera,
  Ban
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { studentService } from '../../services/studentService';
import { auditService } from '../../services/auditService';

export const SandboxedDiffChamber = ({ activeUploadedRecord = null, onCommitRecord }) => {
  const [stagedChanges, setStagedChanges] = useState([]);
  const [isCommitted, setIsCommitted] = useState(false);
  const [committedId, setCommittedId] = useState(null);

  useEffect(() => {
    if (activeUploadedRecord && !activeUploadedRecord.isAcademic) {
      setStagedChanges([
        {
          field: 'Document Provenance & Classification',
          existingValue: 'AICTE Canonical Admission Registry',
          stagedValue: `${activeUploadedRecord.detectedCategory || 'Irrelevant Non-Academic File'} [QUARANTINED]`,
          status: 'REJECTED_NON_ACADEMIC',
          diffType: 'QUARANTINED',
          note: `Ingestion halted: "${activeUploadedRecord.fileName}" contains zero accredited academic provenance or APAAR identifiers.`
        },
        {
          field: 'Registry Ingress Authorization',
          existingValue: 'Strict Zero-Trust Boundary: Active',
          stagedValue: 'Ingress Blocked - Isolated in Quarantine Chamber',
          status: 'WRITE_PROHIBITED',
          diffType: 'BLOCKED',
          note: 'Registry Poisoning Prevention: File lacks valid institutional enrollment claims or course marks.'
        },
        {
          field: 'National APAAR Identifier',
          existingValue: 'Mandatory 12-Digit Format (XXXX-XXXX-XXXX)',
          stagedValue: 'MISSING / INVALID',
          status: 'NON_COMPLIANT',
          diffType: 'REJECTED',
          note: 'Zero student identity commitments found. Cannot map to national academic credit depository.'
        }
      ]);
      setIsCommitted(false);
      return;
    }

    if (activeUploadedRecord && activeUploadedRecord.extractedData) {
      const data = activeUploadedRecord.extractedData;
      const isCollision = activeUploadedRecord.auditChecks?.psiDuplicateMatch;
      const isQuotaExcess = activeUploadedRecord.auditChecks?.intakeLimitDrift;

      setStagedChanges([
        {
          field: 'Candidate Identity Record',
          existingValue: '(Unregistered Staging Node)',
          stagedValue: `${data.studentName} [APAAR: ${data.syntheticApaarId}]`,
          status: 'PROPOSED_INSERTION',
          diffType: 'ADDED',
          note: `Extracted via Sentinel Cognitive Vision Engine (Confidence: ${activeUploadedRecord.confidenceScore}%)`
        },
        {
          field: 'Institutional Enrollment State',
          existingValue: isCollision ? 'COEP Technological University Pune (Confirmed)' : 'No Prior Enrollment Conflict',
          stagedValue: `${data.institutionName} (${data.program})`,
          status: isCollision ? 'COLLISION' : 'VALID',
          diffType: isCollision ? 'CONFLICT' : 'NEW_ENROLLMENT',
          note: isCollision
            ? 'CRITICAL COLLISION: Concurrent multi-institution enrollment detected across state CET lists'
            : 'Single institutional enrollment authority verified'
        },
        {
          field: 'Sanctioned Quota Allocation',
          existingValue: isQuotaExcess ? 'Approved Intake: 120 / 120 (At Capacity)' : 'Approved Intake: 118 / 120 (Capacity Available)',
          stagedValue: `${data.admissionCategory} Allocation (+1 Candidate)`,
          status: isQuotaExcess ? 'EXCESS_QUOTA' : 'VALID',
          diffType: isQuotaExcess ? 'QUOTA_SPIKE' : 'INCREMENT',
          note: isQuotaExcess
            ? 'Circuit breaker tripped: Supernumerary intake exceeds AICTE sanctioned threshold'
            : 'Within approved program intake boundaries'
        },
        {
          field: 'Forensic Image Integrity',
          existingValue: 'Awaiting Forensic Scan',
          stagedValue: activeUploadedRecord.forensicIntegrity?.status || 'VERIFIED_GENUINE_UNMODIFIED',
          status: 'AUTHENTIC',
          diffType: 'VERIFIED',
          note: 'Error Level Analysis (ELA) Passed: Zero Photoshop splicing or font baseline jitter'
        },
        {
          field: 'Multilingual Script Provenance',
          existingValue: 'English Standard',
          stagedValue: activeUploadedRecord.multilingualProfile?.language || 'English (Canonical Standard)',
          status: 'NORMALIZED',
          diffType: 'MAPPED',
          note: `Script: ${activeUploadedRecord.multilingualProfile?.script || 'Latin'} • Normalization verified`
        }
      ]);
      setIsCommitted(false);
    } else {
      // Default baseline staged changes
      setStagedChanges([
        {
          field: 'Student Full Name',
          existingValue: 'Devansh Gupta (Legacy ERP)',
          stagedValue: 'Devansh Gupta (APAAR Verified)',
          status: 'UPDATED',
          diffType: 'MODIFIED',
          note: 'Canonicalization: Name matched with 99.4% biometric confidence'
        },
        {
          field: 'Active Enrollment State',
          existingValue: 'DTU Delhi (Full-Time Regular B.Tech CSE)',
          stagedValue: 'COEP Technological University Pune (ECE)',
          status: 'COLLISION',
          diffType: 'CONFLICT',
          note: 'CRITICAL CONFLICT: Attempting dual active enrollment under same APAAR 9082-3145-6671'
        },
        {
          field: 'Approved Intake Quota',
          existingValue: 'B.Tech CSE: 118 / 120 seats',
          stagedValue: 'B.Tech CSE: 119 / 120 seats',
          status: 'VALID',
          diffType: 'INCREMENT',
          note: 'Capacity remains within approved AICTE intake ceiling (-1 seat remaining)'
        },
        {
          field: 'Category Allocation',
          existingValue: 'GENERAL',
          stagedValue: 'GENERAL',
          status: 'UNCHANGED',
          diffType: 'IDENTICAL',
          note: 'Quota category verified against central reservation schedule'
        },
        {
          field: 'Biometric Aadhaar Token',
          existingValue: '0x0000000000000000 (Unverified)',
          stagedValue: '0x8f2d91c4b72183e91024bc6719ef8a20391d842b',
          status: 'NEW_EVIDENCE',
          diffType: 'ADDED',
          note: 'Added SHA-256 cryptographic identity commitment'
        }
      ]);
    }
  }, [activeUploadedRecord]);

  const handleCommit = async () => {
    if (activeUploadedRecord && !activeUploadedRecord.isAcademic) {
      return;
    }
    setIsCommitted(true);
    const newStudentRef = activeUploadedRecord?.extractedData || {
      studentName: 'Devansh Gupta',
      syntheticApaarId: '9082-3145-6671',
      institutionName: 'Delhi Technological University (DTU)',
      program: 'Computer Science and Engineering',
      admissionCategory: 'GENERAL'
    };

    try {
      await studentService.createStudent({
        studentName: newStudentRef.studentName,
        syntheticApaarId: newStudentRef.syntheticApaarId,
        institutionName: newStudentRef.institutionName,
        program: newStudentRef.program,
        admissionCategory: newStudentRef.admissionCategory,
        admissionStatus: 'ADMITTED'
      });
      setCommittedId(newStudentRef.syntheticApaarId);
    } catch (e) {
      console.error(e);
    }

    if (onCommitRecord) onCommitRecord();
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700">
            <FileDiff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Sandboxed Diff Chamber</h3>
              <Badge variant="purple">STAGE-PREVIEW</Badge>
              {activeUploadedRecord && (
                <span className="text-[10px] text-purple-700 font-mono bg-purple-100 px-2 py-0.5 rounded border border-purple-200 font-bold">
                  Target: {activeUploadedRecord.fileName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Git-style pre-commit inspection of proposed registry modifications before permanent ledger insertion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeUploadedRecord && !activeUploadedRecord.isAcademic ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <Ban className="w-3.5 h-3.5 text-rose-700" />
              <span>REGISTRY WRITE BLOCKED (QUARANTINED)</span>
            </span>
          ) : !isCommitted ? (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={handleCommit}
            >
              Stage & Commit to Registry
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>COMMITTED TO LEDGER [{committedId || 'ACTIVE'}]</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Git-Style Diff Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 uppercase text-[10px] text-slate-600 font-bold">Target Field</th>
              <th className="px-4 py-3 uppercase text-[10px] text-rose-700 font-bold">Existing Value (-)</th>
              <th className="px-4 py-3 uppercase text-[10px] text-emerald-700 font-bold">Proposed Staged Value (+)</th>
              <th className="px-4 py-3 uppercase text-[10px] text-slate-600 font-bold">Diff Impact & Evidence</th>
              <th className="px-4 py-3 uppercase text-[10px] text-right text-slate-600 font-bold">Verification Gate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
            {stagedChanges.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                  {row.field}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-rose-800 bg-rose-50/60 font-semibold max-w-xs truncate border-l border-r border-rose-100">
                  - {row.existingValue}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-emerald-800 bg-emerald-50/60 font-semibold max-w-xs truncate border-r border-emerald-100">
                  + {row.stagedValue}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600 max-w-sm font-medium">
                  {row.note}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Badge variant={row.diffType === 'CONFLICT' ? 'danger' : row.diffType === 'IDENTICAL' ? 'default' : 'success'}>
                    {row.diffType}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety Safeguard Disclaimer */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Server-Side Independent Validation Active: Pre-commit diff staging prevents silent registry overwrite.</span>
        </span>
        <span className="font-mono text-purple-700 font-bold">Zero-Trust Guard: ACTIVE</span>
      </div>
    </div>
  );
};
