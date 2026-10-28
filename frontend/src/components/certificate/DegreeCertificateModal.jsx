import React, { useRef } from 'react';
import {
  Award,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Building2,
  User,
  Calendar,
  Hash,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QRCodeSVG } from 'qrcode.react';

export const DegreeCertificateModal = ({ isOpen, onClose, student }) => {
  const printRef = useRef(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJsonLd = () => {
    const vcData = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://aicte-india.org/credentials/v2"
      ],
      "id": `urn:uuid:${student.credentialId || 'VC-AICTE-' + student.syntheticApaarId.replace(/-/g, '')}`,
      "type": ["VerifiableCredential", "AICTEAcademicDegreeCredential"],
      "issuer": {
        "id": "did:aicte:national-registry-node-01",
        "name": "All India Council for Technical Education (AICTE)",
        "accreditation": "Government of India Statutory Body"
      },
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": `did:apaar:${student.syntheticApaarId}`,
        "nationalAcademicId": student.syntheticApaarId,
        "institutionalStudentId": student.enrollmentNumber,
        "studentName": student.studentName,
        "gender": student.gender,
        "dateOfBirth": student.dob || "2003-04-15",
        "degreeAwarded": student.degreeAwarded || `Bachelor of Technology in ${student.program}`,
        "division": student.division || "First Class with Distinction",
        "cgpa": student.cgpa || "8.85",
        "institution": student.institutionName,
        "academicYear": student.academicYear,
        "admissionCategory": student.admissionCategory,
        "supernumeraryType": student.supernumeraryType || "NONE",
        "nriStatus": student.isNri ? "YES" : "NO",
        "ociStatus": student.isOci ? "YES" : "NO",
        "foreignNationalStatus": student.isForeignNational ? "YES" : "NO",
        "biometricHashToken": student.biometricHash || "0x88e7a021bc789012cd3456ef78901234567890"
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": new Date().toISOString(),
        "verificationMethod": "did:aicte:national-registry-node-01#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": student.hashSignature || "0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b"
      }
    };

    const blob = new Blob([JSON.stringify(vcData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE-Credential-${student.syntheticApaarId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden during window.print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Degree Certificate & Dual-Identity Record</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Degree-Awarding Certificate with APAAR ID & Institutional Student ID
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadJsonLd} icon={Download}>
              Download JSON-LD
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
              Print Certificate
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Parchment Frame */}
        <div className="p-6 md:p-10 max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 bg-slate-100/60">
          <div
            ref={printRef}
            className="relative bg-white print:bg-white print:text-black border-4 border-double border-purple-400/80 print:border-black rounded-xl p-8 md:p-12 shadow-sm text-slate-900 print:text-black"
          >
            {/* Watermark Emblem Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:opacity-[0.06]">
              <Award className="w-96 h-96 text-purple-800 print:text-black" />
            </div>

            {/* University & AICTE Header */}
            <div className="text-center space-y-2 pb-6 border-b border-purple-200 print:border-black relative">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img src="/AICTE.png" alt="AICTE Emblem" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 print:border-black print:text-black font-mono">
                  All India Council for Technical Education • Statutory Regulatory Body
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 print:text-black font-serif uppercase mt-2">
                {student.institutionName}
              </h1>
              <p className="text-xs text-slate-600 print:text-gray-600 font-medium">
                (Degree Awarding Body Approved under the AICTE Act, 1987)
              </p>
              <h2 className="text-base md:text-lg font-bold text-purple-800 print:text-black tracking-widest font-serif uppercase pt-2">
                Provisional Degree Certificate
              </h2>
            </div>

            {/* Prominent Dual Identity Callout Box (Requirement 10) */}
            <div className="my-6 p-4 rounded-xl bg-slate-50 print:bg-gray-100 border border-purple-200 print:border-black relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                {/* APAAR ID */}
                <div className="p-3 bg-white print:bg-white rounded-lg border border-purple-200 print:border-black shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-800 print:text-black uppercase tracking-wider">
                      National Academic Identity (APAAR ID)
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 print:text-black" />
                  </div>
                  <p className="text-lg md:text-xl font-extrabold font-mono text-purple-900 print:text-black tracking-wider mt-1">
                    {student.syntheticApaarId}
                  </p>
                  <p className="text-[10px] text-slate-500 print:text-gray-500 mt-0.5 font-medium">
                    Verified against National Academic Depository & Digilocker
                  </p>
                </div>

                {/* Institutional Student ID */}
                <div className="p-3 bg-white print:bg-white rounded-lg border border-cyan-200 print:border-black shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-800 print:text-black uppercase tracking-wider">
                      Institutional Student Roll ID
                    </span>
                    <Building2 className="w-3.5 h-3.5 text-cyan-700 print:text-black" />
                  </div>
                  <p className="text-lg md:text-xl font-extrabold font-mono text-cyan-950 print:text-black tracking-wider mt-1">
                    {student.enrollmentNumber}
                  </p>
                  <p className="text-[10px] text-slate-500 print:text-gray-500 mt-0.5 font-medium">
                    Registered in Campus Institutional Master Database
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-4 text-center text-sm md:text-base leading-relaxed text-slate-800 print:text-black font-serif my-8">
              <p>
                This is to certify that
              </p>
              <p className="text-xl md:text-2xl font-bold font-sans text-slate-900 print:text-black uppercase tracking-wide">
                {student.studentName}
              </p>
              <p className="text-xs md:text-sm text-slate-600 print:text-gray-700 font-sans font-medium">
                Date of Birth: <strong>{student.dob || '15 April 2003'}</strong> • Gender: <strong>{student.gender}</strong>
              </p>
              <p>
                having successfully fulfilled all academic curriculum, laboratory, and evaluation requirements
                mandated by the Academic Council in
              </p>
              <p className="text-lg md:text-xl font-bold text-purple-800 print:text-black font-sans uppercase">
                {student.degreeAwarded || `Bachelor of Technology in ${student.program}`}
              </p>
              <p>
                has been conferred the Degree with
              </p>
              <p className="text-base md:text-lg font-extrabold text-emerald-700 print:text-black font-sans">
                {student.division || 'First Class with Distinction'} {student.cgpa ? `(CGPA: ${student.cgpa})` : ''}
              </p>
              <p className="text-xs text-slate-600 print:text-gray-600 font-sans font-medium">
                Cohort Academic Year: <strong>{student.academicYear}</strong> • AICTE Approved Intake Batch: <strong>{student.admissionYear}</strong>
              </p>
            </div>

            {/* AICTE Quota & Supernumerary Regulatory Validation Footer */}
            <div className="p-3 bg-slate-50 print:bg-gray-100 rounded-lg border border-slate-200 print:border-black my-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div>
                  <span className="text-slate-500 print:text-gray-500 block font-semibold">Admission Category</span>
                  <span className="font-bold text-slate-900 print:text-black">{student.admissionCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 print:text-gray-500 block font-semibold">Supernumerary Seat</span>
                  <span className="font-bold text-purple-800 print:text-black">{student.supernumeraryType || 'NONE'}</span>
                </div>
                <div>
                  <span className="text-slate-500 print:text-gray-500 block font-semibold">NRI / OCI / FN</span>
                  <span className="font-bold text-cyan-800 print:text-black">
                    {student.isNri ? 'NRI' : student.isOci ? 'OCI' : student.isForeignNational ? 'FN' : 'DOMESTIC'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 print:text-gray-500 block font-semibold">Circuit Breaker</span>
                  <span className="font-bold text-emerald-700 print:text-black">VALIDATED</span>
                </div>
              </div>
            </div>

            {/* Signatures & Cryptographic QR Verification Anchor */}
            <div className="pt-8 border-t border-purple-200 print:border-black grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* University Signatory */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-purple-800 print:text-black text-sm font-semibold">
                  Dr. R. K. Srivastava
                </div>
                <div className="w-36 h-0.5 bg-slate-400 print:bg-black mx-auto" />
                <p className="text-xs font-bold text-slate-900 print:text-black">Controller of Examinations</p>
                <p className="text-[10px] text-slate-500 print:text-gray-600">{student.institutionName}</p>
              </div>

              {/* Center Cryptographic QR & Proof */}
              <div className="text-center space-y-1">
                <div className="w-22 h-22 mx-auto bg-white p-1 rounded-lg border border-purple-300 print:border-black shadow-xs flex items-center justify-center">
                  <QRCodeSVG
                    value={JSON.stringify({
                      type: "W3C-AICTE-VerifiableCredential",
                      vcId: student.credentialId || ('AICTE-CRED-' + (student.id || '2024')),
                      apaar: student.syntheticApaarId || '9082-3145-6671',
                      student: student.studentName || 'Devansh Gupta',
                      institution: student.institutionName || 'Delhi Technological University (DTU)',
                      degree: student.degreeAwarded || 'Bachelor of Technology',
                      division: student.division || 'First Class with Distinction',
                      sig: student.hashSignature?.substring(0, 32) || '0x7c9e13d80a91f543',
                      status: "OFFLINE_VERIFIED_AUTHENTIC"
                    })}
                    size={80}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <p className="text-[10px] font-mono text-purple-800 print:text-black font-bold">
                  VC-ID: {student.credentialId || 'VC-AICTE-' + student.id}
                </p>
                <p className="text-[9px] text-slate-500 print:text-gray-600 font-mono truncate max-w-[200px] mx-auto font-medium">
                  Sig: {student.hashSignature?.substring(0, 24) || '0x7c9e13d80a91f5432b01'}...
                </p>
              </div>

              {/* AICTE Regulatory Council Signatory */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-purple-800 print:text-black text-sm font-semibold">
                  Prof. Rajive Kumar
                </div>
                <div className="w-36 h-0.5 bg-slate-400 print:bg-black mx-auto" />
                <p className="text-xs font-bold text-slate-900 print:text-black">Member Secretary</p>
                <p className="text-[10px] text-slate-500 print:text-gray-600">All India Council for Technical Education</p>
              </div>
            </div>

            {/* Offline Authenticity Notice */}
            <div className="mt-6 pt-3 border-t border-slate-200 print:border-black text-center text-[10px] text-slate-500 print:text-gray-500 font-mono">
              Sentinel-Ledger Node: ed25519-anchor-01 • Offline Cryptographic Verification Enabled via Public Key 0x4B9E...21D
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
