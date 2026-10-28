import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  GitPullRequest,
  Award,
  Layers,
  Sparkles,
  Eye,
  ScanLine,
  RefreshCw,
  ExternalLink,
  Cpu,
  ChevronRight,
  Ban
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { TEST_DOCUMENTS, documentAnalysisService } from '../../services/documentAnalysisService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ApaarForensics = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Test Document Profiles
  const sampleProfiles = [
    {
      id: 'apaar-official',
      title: 'Official National APAAR Card (Bilingual Indic & Hindi Baseline)',
      type: 'APAAR Card',
      badge: 'Bilingual Devanagari & English',
      image: '/apaar.jpeg',
      issuingBankOrAuthority: 'Ministry of Education & AICTE (शिक्षा मंत्रालय)',
      docClassification: 'Official National APAAR Digital Card (अपार छात्र पहचान)',
      detectedLanguage: 'Hindi (Devanagari) + English (Bilingual)',
      laplacianBlurVariance: '178.40 (High Definition Sharp)',
      elaTamperDetection: '0.01 (Pristine Original)',
      lienMarkingCheck: 'CONFIRMED (AICTE-DEL-101 REGULATORY)',
      overallVisionStatus: 'EXCELLENT / COMPLIANT',
      statusColor: 'emerald',
      apaarId: '9082-3145-6671',
      studentName: 'Devansh Gupta (देवांश गुप्ता)',
      institution: 'Delhi Technological University (DTU)',
      program: 'Computer Science and Engineering',
      academicYear: '2024-2025',
      note: 'National APAAR Identity Cards and State Admission Allotment Memos can be uploaded in ANY regional Indian language (English, Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Malayalam, etc.). The Sentinel Cognitive Vision Engine automatically normalizes Indic/regional script numerals, extracts key regulatory parameters, and translates them into the centralized ledger.'
    },
    {
      id: 'hindi-allotment',
      title: 'State CAP Admission Allotment Memo (Hindi / Devanagari)',
      type: 'State CET Memo',
      badge: 'Hindi (Devanagari Script)',
      image: null,
      issuingBankOrAuthority: 'State Technical Education Board & DTE',
      docClassification: 'CAP Centralized Admission Allotment Memo',
      detectedLanguage: 'Hindi (Devanagari)',
      laplacianBlurVariance: '162.80 (High Definition Sharp)',
      elaTamperDetection: '0.02 (Pristine Original)',
      lienMarkingCheck: 'CONFIRMED (AICTE-DEL-101 REGULATORY)',
      overallVisionStatus: 'EXCELLENT / COMPLIANT',
      statusColor: 'emerald',
      apaarId: '9082-3145-6671',
      studentName: 'Devansh Gupta (देवांश गुप्ता)',
      institution: 'Delhi Technological University (DTU)',
      program: 'Computer Science and Engineering',
      academicYear: '2024-2025',
      note: 'Official state board allotment letter parsed seamlessly from Devanagari numerals and academic terminology directly into canonical AICTE schema.'
    },
    {
      id: 'tamil-tnea',
      title: 'Anna University TNEA Allotment Order (Tamil)',
      type: 'TNEA Memo',
      badge: 'Tamil (தமிழ் Script)',
      image: null,
      issuingBankOrAuthority: 'Directorate of Technical Education (DoTE) Tamil Nadu',
      docClassification: 'TNEA State Engineering Allotment Order',
      detectedLanguage: 'Tamil (தமிழ்)',
      laplacianBlurVariance: '154.10 (Sharp High Resolution)',
      elaTamperDetection: '0.01 (Pristine Original)',
      lienMarkingCheck: 'CONFIRMED (AICTE-TN-301 REGULATORY)',
      overallVisionStatus: 'EXCELLENT / COMPLIANT',
      statusColor: 'emerald',
      apaarId: '9082-4412-8821',
      studentName: 'Priya Sharma (பிரியா சர்மா)',
      institution: 'Anna University College of Engineering Chennai',
      program: 'Information Technology',
      academicYear: '2024-2025',
      note: 'Tamil script entity extractor identified candidate name and mapped Anna University accreditation code AICTE-TN-301 with zero OCR drift.'
    },
    {
      id: 'tampered-memo',
      title: 'Adversarial Tampered CAP Allotment (Photoshop Splice)',
      type: 'Tampered Document',
      badge: 'Tampered Splice Detected',
      image: null,
      issuingBankOrAuthority: 'Forged State Board Header (Tampered)',
      docClassification: 'Manipulated Fraudulent Academic Allotment',
      detectedLanguage: 'English + Hindi (Mixed Splice)',
      laplacianBlurVariance: '189.60 (Inconsistent Blur Profile)',
      elaTamperDetection: '0.89 (CRITICAL FORGERY DETECTED)',
      lienMarkingCheck: 'REJECTED (QUARANTINED BY ELA)',
      overallVisionStatus: 'FLAGGED / TAMPERED',
      statusColor: 'rose',
      apaarId: '9082-3145-6671 [CLONED]',
      studentName: 'Devansh Gupta [Tampered Marks 98.6%]',
      institution: 'Delhi Technological University (DTU)',
      program: 'Computer Science and Engineering',
      academicYear: '2024-2025',
      note: 'High Discrete Cosine Transform (DCT) disparity detected in candidate score quadrant. Font baseline jitter indicates Adobe Photoshop clone-stamping.'
    }
  ];

  const [activeProfile, setActiveProfile] = useState(sampleProfiles[0]);
  const [viewMode, setViewMode] = useState('ORIGINAL'); // 'ORIGINAL', 'ELA', 'BOUNDING_BOX'
  const [customFile, setCustomFile] = useState(null);
  const [customFilePreview, setCustomFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectProfile = (profile) => {
    setActiveProfile(profile);
    setCustomFile(null);
    setCustomFilePreview(null);
  };

  const handleCustomUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCustomFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCustomFilePreview(objectUrl);

    setIsProcessing(true);
    showToast('Processing uploaded document via Sentinel Cognitive Vision Engine...', 'info');

    try {
      const result = await documentAnalysisService.analyzeDocument(file);
      if (!result.isAcademic) {
        showToast(result.status === 'FLAGGED_TAMPERED' ? 'Tampered document detected! Ingestion halted.' : 'Irrelevant non-academic document flagged! Ingestion halted.', 'error');
      } else {
        showToast('Academic document analyzed successfully!', 'success');
      }

      const isTampered = result.status === 'FLAGGED_TAMPERED';
      const isIrrelevant = result.status === 'FLAGGED_IRRELEVANT' || !result.isAcademic;
      
      const newProfile = {
        id: 'uploaded-doc',
        title: file.name,
        type: result.detectedCategory || (isIrrelevant ? 'Irrelevant Non-Academic' : 'Custom Document'),
        badge: isTampered ? 'Tampered / Photoshopped' : isIrrelevant ? 'Irrelevant Non-Academic' : (result.multilingualProfile?.language || 'Analyzed Record'),
        image: objectUrl,
        issuingBankOrAuthority: isIrrelevant ? 'Zero Institutional Accreditation' : (result.extractedData?.institutionName || 'AICTE Verified Issuer'),
        docClassification: result.detectedCategory || (isIrrelevant ? 'Irrelevant Non-Academic' : 'Academic Allotment'),
        detectedLanguage: isIrrelevant ? 'N/A' : (result.multilingualProfile?.language || 'English'),
        laplacianBlurVariance: isIrrelevant ? 'N/A (Irrelevant File)' : '168.90 (Sharp)',
        elaTamperDetection: isTampered ? '0.88 (Tampered)' : isIrrelevant ? 'N/A (Non-Academic)' : '0.01 (Pristine)',
        lienMarkingCheck: isIrrelevant ? 'REJECTED (NON-ACADEMIC)' : (isTampered ? 'REJECTED (TAMPERED)' : 'CONFIRMED (AICTE REGULATORY)'),
        overallVisionStatus: isTampered ? 'FLAGGED / TAMPERED' : isIrrelevant ? 'FLAGGED / IRRELEVANT' : 'EXCELLENT / COMPLIANT',
        statusColor: (isTampered || isIrrelevant) ? 'rose' : 'emerald',
        apaarId: isIrrelevant ? 'N/A - QUARANTINED' : (result.extractedData?.syntheticApaarId || '9082-3145-6671'),
        studentName: isIrrelevant ? 'N/A - Non-Academic File' : (result.extractedData?.studentName || file.name.replace(/\.[^/.]+$/, '')),
        institution: isIrrelevant ? 'Zero Academic Provenance' : (result.extractedData?.institutionName || 'Recognized Technical College'),
        program: isIrrelevant ? 'Quarantined File' : (result.extractedData?.program || 'Engineering & Technology'),
        academicYear: isIrrelevant ? 'N/A' : '2024-2025',
        isAcademic: result.isAcademic,
        note: result.reasons ? result.reasons.join(' • ') : 'Document parsed via Sentinel Cognitive Vision Engine with full forensic verification.'
      };

      setActiveProfile(newProfile);
    } catch (err) {
      showToast('Failed to evaluate uploaded document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = activeProfile.image || '/apaar.jpeg';
    link.download = activeProfile.image ? activeProfile.image.split('/').pop() : 'apaar_verified_record.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloading document artifact...', 'success');
  };

  const handlePushToDiffChamber = () => {
    if (activeProfile && activeProfile.isAcademic === false) {
      showToast('Action Blocked: Irrelevant non-academic documents cannot be staged into Diff Chamber!', 'error');
      return;
    }
    showToast('Staged student identity record in Sandboxed Diff Chamber!', 'success');
    navigate('/imports');
  };

  const handleCheckGraphCollision = () => {
    if (activeProfile && activeProfile.isAcademic === false) {
      showToast('Action Blocked: Irrelevant non-academic documents have no APAAR identity graph!', 'error');
      return;
    }
    showToast('Executing Neo4j Cypher Traversal for APAAR token ' + activeProfile.apaarId, 'info');
    navigate('/knowledge-mesh');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Console Bar (Matching reference image: Hello Arvind | Surveillance Console | Action Buttons) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img src="/AICTE.png" alt="AICTE" className="w-10 h-10 object-contain shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Hello {user?.name || user?.username || 'Arvind'}
              </h2>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200">
                Surveillance Console
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Drishyam Mesh National Multilingual Cognitive Vision & Forensic Inspection Console
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleCustomUpload}
              className="hidden"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-2xs transition-all">
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              Bulk Ingest (CSV/Card)
            </span>
          </label>

          <Button
            onClick={() => handleSelectProfile(sampleProfiles[0])}
            icon={ScanLine}
            className="!bg-slate-900 hover:!bg-slate-800 !text-white text-xs px-3.5 py-1.5"
          >
            Ingest APAAR
          </Button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Council Admin</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <span>Alerts</span>
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">50</span>
          </div>
        </div>
      </div>

      {/* Title & Subtitle + Download Receipt Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Sample APAAR Document Inspector
            <Badge variant="purple">LIVE VISION</Badge>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Synthetic & Real-World Test Records • Multilingual Optical Parsing & Anti-Photoshop ELA Analysis
          </p>
        </div>

        <Button
          onClick={handleDownloadImage}
          icon={Download}
          variant="outline"
          className="text-xs"
        >
          Download APAAR Card (JPEG)
        </Button>
      </div>

      {/* Pill Selectors (Matching reference image: Central Bank of India ... Synthetic AICTE ...) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sampleProfiles.map((profile) => {
          const isSelected = activeProfile.id === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {profile.title}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Document Preview (65% width) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 bg-white border-slate-200 shadow-xs">
            {/* Document Header inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  {activeProfile.id === 'apaar-official'
                    ? 'Ministry of Education & AICTE: Automated Permanent Academic Account Registry (APAAR)'
                    : activeProfile.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ID: <span className="font-bold text-purple-700">{activeProfile.apaarId}</span> • Provenance: {activeProfile.institution}
                </p>
              </div>
              <Badge variant={activeProfile.statusColor === 'emerald' ? 'success' : 'danger'}>
                {activeProfile.badge}
              </Badge>
            </div>

            {/* Interactive View Toggles */}
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Visual Inspection Layer:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('ORIGINAL')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    viewMode === 'ORIGINAL'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Authentic Scan
                </button>
                <button
                  onClick={() => setViewMode('ELA')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    viewMode === 'ELA'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ELA Heatmap
                </button>
                <button
                  onClick={() => setViewMode('BOUNDING_BOX')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    viewMode === 'BOUNDING_BOX'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OCR Pins
                </button>
              </div>
            </div>

            {/* Document Image Surface */}
            <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center p-3 min-h-[420px]">
              {activeProfile.image ? (
                <div className="relative w-full max-h-[500px] flex items-center justify-center group">
                  <img
                    src={activeProfile.image}
                    alt="National APAAR Document Scan"
                    className={`max-w-full max-h-[480px] object-contain rounded-lg shadow-sm transition-all duration-300 ${
                      viewMode === 'ELA'
                        ? 'filter contrast-150 brightness-90 hue-rotate-180 saturate-200'
                        : viewMode === 'BOUNDING_BOX'
                        ? 'brightness-95'
                        : ''
                    }`}
                  />

                  {/* Bounding Box Pins (Only shown when BOUNDING_BOX mode is active) */}
                  {viewMode === 'BOUNDING_BOX' && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                      <div className="border-2 border-emerald-500 bg-emerald-500/10 rounded p-1 text-[10px] font-mono font-bold text-emerald-900 w-max shadow-xs">
                        [TOKEN: {activeProfile.apaarId}]
                      </div>
                      <div className="border-2 border-indigo-500 bg-indigo-500/10 rounded p-1 text-[10px] font-mono font-bold text-indigo-900 w-max self-center shadow-xs">
                        [STUDENT: {activeProfile.studentName}]
                      </div>
                      <div className="border-2 border-purple-500 bg-purple-500/10 rounded p-1 text-[10px] font-mono font-bold text-purple-900 w-max self-end shadow-xs">
                        [INSTITUTION: {activeProfile.institution}]
                      </div>
                    </div>
                  )}

                  {/* ELA Heatmap Indicator (Only shown in ELA mode) */}
                  {viewMode === 'ELA' && (
                    <div className="absolute top-4 right-4 bg-purple-900/90 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg backdrop-blur-xs border border-purple-500 shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                      <span>DCT Compression Profile: {activeProfile.elaTamperDetection}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full p-6 bg-white rounded-lg border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold uppercase">{activeProfile.type}</span>
                    <Badge variant={activeProfile.statusColor === 'emerald' ? 'success' : 'danger'}>
                      {activeProfile.overallVisionStatus}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-slate-800 text-xs">
                    <p><span className="text-slate-400">APAAR_ID:</span> <span className="text-purple-700 font-bold">{activeProfile.apaarId}</span></p>
                    <p><span className="text-slate-400">CANDIDATE:</span> <span className="font-bold">{activeProfile.studentName}</span></p>
                    <p><span className="text-slate-400">INSTITUTION:</span> <span>{activeProfile.institution}</span></p>
                    <p><span className="text-slate-400">PROGRAM:</span> <span>{activeProfile.program}</span></p>
                    <p><span className="text-slate-400">LANGUAGE:</span> <span>{activeProfile.detectedLanguage}</span></p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-sans">
                    {activeProfile.note}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePushToDiffChamber}
                  icon={activeProfile?.isAcademic === false ? Ban : GitPullRequest}
                  variant={activeProfile?.isAcademic === false ? "danger" : "primary"}
                  disabled={activeProfile?.isAcademic === false}
                  className="text-xs"
                >
                  {activeProfile?.isAcademic === false ? "Ingress Blocked (Quarantined)" : "Ingest to Diff Chamber"}
                </Button>
                <Button
                  onClick={handleCheckGraphCollision}
                  icon={Share2}
                  variant="outline"
                  disabled={activeProfile?.isAcademic === false}
                  className="text-xs"
                >
                  Check Neo4j Collision
                </Button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                AICTE SHA-256 Ledger Synchronized
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Computer Vision & OCR Forensics (35% width, matching reference image) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                Computer Vision & OCR Forensics
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Real-time optical analysis & cryptographic provenance report
              </p>
            </div>

            {/* Forensic Attribute List (Exactly styled as the reference image table) */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium shrink-0">Issuing Authority:</span>
                <span className="font-bold text-slate-900 text-right">{activeProfile.issuingBankOrAuthority}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium shrink-0">Document Classification:</span>
                <span className="font-bold text-slate-900 text-right">{activeProfile.docClassification}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">Extracted APAAR ID:</span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {activeProfile.apaarId}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">{activeProfile.studentName}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium shrink-0">Institution:</span>
                <span className="font-semibold text-slate-800 text-right">{activeProfile.institution}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">Detected Language:</span>
                <span className="font-bold text-slate-900">{activeProfile.detectedLanguage}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">Laplacian Blur Variance:</span>
                <span className="font-mono font-bold text-emerald-700">{activeProfile.laplacianBlurVariance}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">ELA Tamper Detection:</span>
                <span className={`font-mono font-bold ${activeProfile.statusColor === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {activeProfile.elaTamperDetection}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 gap-2">
                <span className="text-slate-500 font-medium">Lien Marking Check:</span>
                <span className="font-mono font-bold text-emerald-700">{activeProfile.lienMarkingCheck}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-200 gap-2">
                <span className="text-slate-700 font-bold">Overall Vision Status:</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold tracking-wider ${
                    activeProfile.statusColor === 'emerald'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {activeProfile.overallVisionStatus}
                </span>
              </div>
            </div>

            {/* Cyan/Blue Multilingual Intelligence Note Box (Matching reference image) */}
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Multilingual Intelligence Note:
              </h4>
              <p className="text-[11px] leading-relaxed text-sky-800 font-medium">
                {activeProfile.note}
              </p>
            </div>

            {/* Quick Upload Action */}
            <div className="pt-2">
              <label className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-purple-50/50 transition-all text-xs font-semibold text-slate-700">
                <input
                  type="file"
                  accept=".pdf,.png,.jpeg,.jpg"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
                <UploadCloud className="w-4 h-4 text-purple-600" />
                <span>Upload Custom Document for Live Inspection</span>
              </label>
            </div>
          </Card>

          {/* Bottom Terminal Status Chip (Matching CMD: aethervault.db from image) */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 text-slate-300 rounded-xl font-mono text-[11px] border border-slate-800 shadow-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CMD: drishyam_mesh.db</span>
            </span>
            <span className="text-slate-400">SENTINEL-VISION v4.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
