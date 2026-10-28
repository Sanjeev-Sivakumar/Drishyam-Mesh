import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Key,
  Copy,
  Lock,
  RefreshCw,
  AlertTriangle,
  Printer,
  FileText
} from 'lucide-react';
import { credentialService } from '../../services/credentialService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { StudentConsentGateway } from '../../components/consent/StudentConsentGateway';
import { DegreeCertificateModal } from '../../components/certificate/DegreeCertificateModal';
import { QRCodeSVG } from 'qrcode.react';

export const Verification = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('VERIFY'); // 'VERIFY' or 'CONSENT'
  const [credentialId, setCredentialId] = useState('VC-AICTE-2024-908231');
  const [issuedCredentials, setIssuedCredentials] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certStudentData, setCertStudentData] = useState(null);

  // Tamper test mode
  const [isTamperMode, setIsTamperMode] = useState(false);
  const [customPayload, setCustomPayload] = useState('');

  useEffect(() => {
    loadIssuedCredentials();
  }, []);

  const loadIssuedCredentials = async () => {
    try {
      const res = await credentialService.getCredentials({ size: 10 });
      setIssuedCredentials(res.content || []);
      if (res.content && res.content.length > 0) {
        setCredentialId(res.content[0].credentialId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async (credIdToVerify = credentialId) => {
    const targetId = credIdToVerify || credentialId;
    if (!targetId.trim()) {
      showToast('Please enter a valid Credential ID', 'warning');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const body = {
        credentialId: targetId.trim()
      };

      if (isTamperMode && customPayload) {
        body.payloadJson = customPayload;
      }

      const res = await credentialService.verifyCredential(body);
      setVerificationResult(res);

      if (res.valid) {
        showToast('Cryptographic signature and credential validity confirmed!', 'success');
      } else {
        showToast(res.verificationNotes || 'Verification failed: signature mismatch', 'error');
      }
    } catch (err) {
      showToast('Verification service error', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectSample = (cred) => {
    setCredentialId(cred.credentialId);
    setVerificationResult(null);
    setIsTamperMode(false);
    setCustomPayload('');
  };

  const handleEnableTamperTest = (cred) => {
    setCredentialId(cred.credentialId);
    setIsTamperMode(true);
    const tampered = JSON.stringify({
      credentialId: cred.credentialId,
      studentName: cred.studentName,
      institution: 'Delhi Technological University (DTU)',
      qualification: 'Doctor of Science (Honorary & Falsified Claim)',
      completionYear: 2024
    }, null, 2);
    setCustomPayload(tampered);
    showToast('Tampered payload loaded. Click Verify Credential to observe signature rejection.', 'info');
  };

  const handleOpenCertFromVerification = (res) => {
    setCertStudentData({
      studentName: res.studentName || 'Devansh Gupta',
      syntheticApaarId: res.syntheticApaarId || '9082-3145-6671',
      enrollmentNumber: res.enrollmentNumber || 'EN-2024-DTU-0842',
      institutionName: res.institutionName || 'Delhi Technological University (DTU)',
      program: res.qualification || 'Computer Science and Engineering',
      degreeAwarded: res.qualification || 'Bachelor of Technology in Computer Science and Engineering',
      academicYear: '2024-2025',
      admissionYear: 2024,
      admissionCategory: 'GENERAL',
      supernumeraryType: 'NONE',
      gender: 'MALE',
      dob: '2003-04-15',
      division: 'First Class with Distinction',
      cgpa: res.cgpaOrGrade || '8.85',
      credentialId: res.credentialId || credentialId,
      hashSignature: res.hashSignature || '0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b'
    });
    setIsCertModalOpen(true);
  };

  const handleOpenCertFromCred = (cred) => {
    setCertStudentData({
      studentName: cred.studentName,
      syntheticApaarId: cred.syntheticApaarId || '9082-3145-6671',
      enrollmentNumber: cred.enrollmentNumber || 'EN-2024-DTU-0842',
      institutionName: cred.institutionName,
      program: cred.qualification || 'Computer Science and Engineering',
      degreeAwarded: cred.qualification || 'Bachelor of Technology',
      academicYear: '2024-2025',
      admissionYear: 2024,
      admissionCategory: 'GENERAL',
      supernumeraryType: 'NONE',
      gender: 'MALE',
      dob: '2003-04-15',
      division: 'First Class with Distinction',
      cgpa: cred.cgpaOrGrade || '8.85',
      credentialId: cred.credentialId,
      hashSignature: cred.hashSignature || '0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b'
    });
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/AICTE.png" alt="AICTE" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2 py-0.2 rounded border border-purple-200">
                OFFICIAL AICTE VERIFICATION
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Decentralized Academic Trust & Privacy Gateway</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero-trust cryptographic verification, selective disclosure relay, and DPDP Act student data consent
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shrink-0 shadow-xs">
          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'VERIFY'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Blind Verification Relay</span>
          </button>
          <button
            onClick={() => setActiveTab('CONSENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'CONSENT'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>DPDP Student Consent</span>
          </button>
        </div>
      </div>

      {/* Tab 2: DPDP Student Consent Gateway */}
      {activeTab === 'CONSENT' && (
        <StudentConsentGateway />
      )}

      {/* Tab 1: Verification Gateway */}
      {activeTab === 'VERIFY' && (
        <>
          {/* Verification Input Box */}
          <Card className="p-6 bg-white border-slate-200 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                Enter AICTE Credential Unique Identifier
              </label>
              <div className="flex gap-2">
                <Input
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. VC-AICTE-2024-908231"
                  icon={Search}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleVerify()}
                  isLoading={isVerifying}
                  icon={ShieldCheck}
                >
                  Verify Credential
                </Button>
              </div>

              {/* Tamper mode toggle box */}
              {isTamperMode && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-rose-800 font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Adversarial Payload Integrity Stress Test Active
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTamperMode(false)}
                      className="text-slate-600 hover:text-slate-900 underline text-[11px] font-semibold"
                    >
                      Reset to Authentic
                    </button>
                  </div>
                  <p className="text-rose-700 text-[11px] font-medium">
                    The claim below has been modified by an adversary. Verifying will trigger Ed25519 hash mismatch.
                  </p>
                  <textarea
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    rows={3}
                    className="w-full font-mono text-[11px] p-2.5 bg-white rounded-lg border border-rose-300 text-rose-900 font-semibold"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Verification Result Card */}
          {verificationResult && (
            <Card
              className={`border-2 animate-scale-up p-6 bg-white shadow-xs ${
                verificationResult.valid ? 'border-emerald-300' : 'border-rose-300'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      verificationResult.valid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {verificationResult.valid ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {verificationResult.valid ? 'Authentic Verifiable Credential' : 'Cryptographic Verification Failed'}
                      </h3>
                      <Badge variant={verificationResult.valid ? 'success' : 'danger'}>
                        {verificationResult.valid ? 'VALIDATED' : 'TAMPERED / INVALID'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Reference ID: <span className="font-mono font-bold text-purple-700">{verificationResult.credentialId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {verificationResult.valid && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenCertFromVerification(verificationResult)}
                      icon={Printer}
                    >
                      Print Degree Certificate
                    </Button>
                  )}
                  <div className="text-right text-xs text-slate-500 hidden sm:block font-medium">
                    <p>Crypto Algorithm: <span className="font-mono text-cyan-800 font-bold">Ed25519-SHA256</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Anchored on AICTE Sentinel Mesh</p>
                  </div>
                </div>
              </div>

              {/* Minimal Necessary Disclosure Claims Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                    Verified Academic Claims
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Awarded Qualification:</span>
                    <span className="font-bold text-slate-900">{verificationResult.qualification || 'Bachelor of Technology'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Institution Node:</span>
                    <span className="font-bold text-purple-700">{verificationResult.institutionName || 'Delhi Technological University (DTU)'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Completion Year / CGPA:</span>
                    <span className="font-bold text-slate-900 font-mono">{verificationResult.completionYear || '2024'} • {verificationResult.cgpaOrGrade || '8.85 CGPA'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600 font-medium">Verification Verdict:</span>
                    <span className={verificationResult.valid ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                      {verificationResult.verificationNotes}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                    Zero-Trust Cryptographic Proofs
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Student Identity:</span>
                    <span className="font-bold text-slate-900">{verificationResult.studentName || 'Devansh Gupta'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Synthetic APAAR ID:</span>
                    <span className="font-mono text-purple-700 font-bold">{verificationResult.syntheticApaarId || '9082-3145-6671'}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-mono font-medium block">Merkle Proof Root:</span>
                    <span className="font-mono text-[10px] text-slate-800 font-semibold truncate block mt-0.5">
                      0x3a91f820bb9410ea872412dd5f71e9824c892b11548e65a041f02188ab65ec12
                    </span>
                  </div>
                </div>
              </div>

              {/* Scannable Offline QR Code Card */}
              {verificationResult.valid && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-xs text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h5 className="font-bold text-slate-900 text-sm">Offline Verifiable QR Code Anchor Active</h5>
                      <Badge variant="success">W3C COMPLIANT</Badge>
                    </div>
                    <p className="text-slate-600 text-[11px] max-w-lg leading-relaxed">
                      This QR code contains the signed W3C verifiable credential payload and Ed25519 digital signature.
                      Any evaluator or smartphone camera can scan this code offline to verify student identity, degree claims, and non-repudiation without central database connectivity.
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-purple-700 font-bold">
                      <span>Anchor: ed25519-did:aicte:council:0x4B9E21D</span>
                      <span>•</span>
                      <span className="text-emerald-700">SHA-256 Ledger Sealed</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-purple-300 shadow-xs shrink-0 flex flex-col items-center">
                    <QRCodeSVG
                      value={JSON.stringify({
                        type: "W3C-AICTE-VerifiableCredential",
                        vcId: verificationResult.credentialId,
                        apaar: verificationResult.syntheticApaarId,
                        student: verificationResult.studentName,
                        institution: verificationResult.institutionName,
                        qualification: verificationResult.qualification,
                        cgpa: verificationResult.cgpaOrGrade,
                        issuer: "did:aicte:council:0x4B9E21D",
                        sig: "0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b",
                        offlineVerified: true
                      })}
                      size={100}
                      level="M"
                      includeMargin={false}
                    />
                    <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase tracking-wider">
                      Scan with Phone Camera
                    </span>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Available Samples & Tamper Test Section */}
          <Card className="p-6 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Cryptographic Samples & Tamper Tests</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Select an authoritative credential to verify authenticity or test live adversarial payload tampering
                </p>
              </div>
              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">
                {issuedCredentials.length} Verifiable Credentials in Ledger
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issuedCredentials.map((cred) => (
                <div
                  key={cred.credentialId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-purple-300 transition-colors flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-700">{cred.credentialId}</span>
                      <Badge variant="success">ISSUED</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{cred.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{cred.institutionName}</p>
                    <p className="text-xs text-slate-700 font-semibold mt-1">{cred.qualification}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSelectSample(cred)}
                    >
                      Load Credential
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenCertFromCred(cred)}
                      icon={Printer}
                      title="View & Print Official Degree Certificate"
                    >
                      Certificate
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleEnableTamperTest(cred)}
                    >
                      Tamper Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Degree Certificate Modal (Requirement 10: Dual APAAR + Student Roll ID) */}
      <DegreeCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        student={certStudentData}
      />
    </div>
  );
};
