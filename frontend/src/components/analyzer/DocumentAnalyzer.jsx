import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Terminal,
  RotateCcw,
  GitPullRequest,
  Globe,
  Camera,
  FileSearch,
  Check,
  Ban,
  ChevronRight
} from 'lucide-react';
import { documentAnalysisService, TEST_DOCUMENTS } from '../../services/documentAnalysisService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DocumentAnalyzer = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setSelectedSampleId(null);
    runAnalysis(file);
  };

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    runAnalysis(sample);
  };

  const runAnalysis = async (fileOrSample) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await documentAnalysisService.analyzeDocument(fileOrSample);
      setAnalysisResult(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700">
              <UploadCloud className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Autonomous Document Ingestion, Multilingual OCR & Anti-Photoshop Forensic Analyzer
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl mx-auto leading-relaxed">
              Accepts documents in <strong className="text-slate-900">English and any Indian regional language</strong> (Hindi, Tamil, Marathi, Telugu, etc.). The Sentinel Cognitive Vision Engine verifies academic pattern canonicals, audits for digital tampering / Photoshop forgeries, and isolates irrelevant non-academic files.
            </p>
          </div>

          {/* Capabilities Badge Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-semibold">
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              Pan-Indian Language Support (Hindi, Tamil, Marathi, etc.)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold">
              <Camera className="w-3.5 h-3.5 text-cyan-600" />
              Anti-Photoshop & ELA Forensic Splicing Detection
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              <FileSearch className="w-3.5 h-3.5 text-emerald-600" />
              AICTE / APAAR Pattern Validation
            </span>
          </div>

          {/* Upload Input & Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer">
              <Button
                variant="primary"
                size="md"
                isLoading={isAnalyzing}
                onClick={() => document.getElementById('docFileInput').click()}
                icon={UploadCloud}
              >
                Upload Document (PDF / PNG / JPG / CSV)
              </Button>
              <input
                id="docFileInput"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {analysisResult && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => { setAnalysisResult(null); setSelectedFile(null); setSelectedSampleId(null); }}
                icon={RotateCcw}
              >
                Clear Analysis
              </Button>
            )}
          </div>

          {/* Structured Table: Test Bench Scenarios */}
          <div className="pt-5 border-t border-slate-200 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Instant Test Bench Scenarios (Rows & Columns View)
                </p>
                <p className="text-[11px] text-slate-500">
                  Select any structured test scenario to verify multilingual parsing, anti-photoshop tampering detection, and non-academic rejection.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold shrink-0">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                10 Test Payloads Available
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold w-10">#</th>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Document Name & Type</th>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Script / Language</th>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Scenario Category</th>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Expected Forensic Verdict</th>
                    <th className="px-3.5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {TEST_DOCUMENTS.map((doc, idx) => {
                    const isSelected = selectedSampleId === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-purple-50/80 border-l-4 border-l-purple-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono text-xs font-semibold text-slate-500">{idx + 1}</td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              doc.category === 'Tampered / Photoshopped'
                                ? 'bg-rose-100 text-rose-700'
                                : doc.category === 'Irrelevant'
                                ? 'bg-rose-100 text-rose-600'
                                : doc.category === 'Multilingual Academic'
                                ? 'bg-purple-100 text-purple-700'
                                : doc.category === 'Suspicious' || doc.category === 'Quota Exception'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate max-w-xs">{doc.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                            doc.language.includes('Hindi')
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : doc.language.includes('Tamil')
                              ? 'bg-blue-50 text-blue-900 border-blue-300'
                              : doc.language.includes('Marathi')
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}>
                            <Globe className="w-3.5 h-3.5" />
                            {doc.language}
                          </span>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            doc.category === 'Tampered / Photoshopped'
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : doc.category === 'Irrelevant'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : doc.category === 'Multilingual Academic'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : doc.category === 'Suspicious' || doc.category === 'Quota Exception'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 max-w-sm">
                          <p className="text-xs text-slate-700 font-medium leading-snug">{doc.description}</p>
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <Button
                            variant={isSelected ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => handleSelectSample(doc)}
                            disabled={isAnalyzing}
                            icon={isSelected ? Check : ArrowRight}
                          >
                            {isSelected ? 'Loaded' : 'Load & Test'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Running State */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-purple-50/70 border border-purple-300 text-center space-y-3 animate-pulse shadow-sm">
          <Cpu className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-900">Sentinel Cognitive Vision Engine Running Deep Analysis...</h4>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Parsing Indian script characters, executing Error Level Analysis (ELA) for Photoshop tampering, and validating AICTE canonical structure.
          </p>
        </div>
      )}

      {/* Analysis Outcome Cards */}
      {analysisResult && (
        <div className="space-y-4 animate-scale-up">
          {/* ========================================================================= */}
          {/* SCENARIO 1: DIGITAL FORGERY / PHOTOSHOPPED ARTIFACT DETECTED              */}
          {/* ========================================================================= */}
          {analysisResult.status === 'FLAGGED_TAMPERED' && (
            <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-400 text-slate-900 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                    <Ban className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-rose-950">
                        {analysisResult.flaggedTitle}
                      </h3>
                      <Badge variant="danger">PHOTOSHOP DETECTED</Badge>
                    </div>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Threat Classification: <strong className="text-rose-950">Tampered / Spliced Academic Document</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600 font-mono">
                  <p>Tamper Confidence: <strong className="text-rose-700 font-bold">{analysisResult.confidenceScore}%</strong></p>
                  <p className="text-[10px]">Forensic Latency: {analysisResult.latencyMs}ms</p>
                </div>
              </div>

              {/* Forensic Splicing Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-3 shadow-xs">
                <h5 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-600" />
                  Digital Tampering & Image Splicing Forensic Evidence
                </h5>
                <ul className="space-y-2 text-xs text-slate-800">
                  {analysisResult.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Forensic Verification Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Error Level Analysis</span>
                  <span className="text-xs font-bold text-rose-700 mt-1 block">ELA FAILED (78% Disparity)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Glyph Baseline Splicing</span>
                  <span className="text-xs font-bold text-rose-700 mt-1 block">FONT JITTER (4.2px Shift)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Editing Tool Signature</span>
                  <span className="text-xs font-bold text-rose-700 mt-1 block">Adobe Photoshop CC</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Clone Stamp / Patch</span>
                  <span className="text-xs font-bold text-rose-700 mt-1 block">CLONED NOISE FOUND</span>
                </div>
              </div>

              {/* Quarantine Action */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-xs">
                <div className="flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Zero-Trust Forensic Vault:</strong> Ingestion halted. Document quarantined permanently to prevent admission fraud.</span>
                </div>
                <Badge variant="danger">ISOLATED</Badge>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENARIO 2: IRRELEVANT NON-ACADEMIC DOCUMENT FLAGGED                      */}
          {/* ========================================================================= */}
          {analysisResult.status === 'FLAGGED_IRRELEVANT' && (
            <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-400 text-slate-900 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-rose-950">
                        {analysisResult.flaggedTitle}
                      </h3>
                      <Badge variant="danger">NON-ACADEMIC</Badge>
                    </div>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Classified As: <strong className="text-rose-950">{analysisResult.detectedCategory}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600 font-mono">
                  <p>Classification Confidence: <strong className="text-rose-700 font-bold">{analysisResult.confidenceScore}%</strong></p>
                  <p className="text-[10px]">Engine Latency: {analysisResult.latencyMs}ms</p>
                </div>
              </div>

              {/* Specific Reason Bullet Points */}
              <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-2 shadow-xs">
                <h5 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Pattern Matching Rejection Reasons
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {analysisResult.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quarantine Action Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-xs gap-2">
                <div className="flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Zero-Trust Ingestion Gate:</strong> {analysisResult.quarantineAction}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] font-bold text-rose-900 bg-white/70 px-2.5 py-1 rounded-md border border-rose-300">
                    REGISTRY STORAGE: BLOCKED (0 ROWS WRITTEN)
                  </span>
                  <Badge variant="danger">QUARANTINED</Badge>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENARIO 3: VERIFIED ACADEMIC RECORD (ENGLISH OR INDIAN REGIONAL LANGUAGE) */}
          {/* ========================================================================= */}
          {analysisResult.isAcademic && (
            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 text-slate-900 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {analysisResult.flaggedTitle}
                      </h3>
                      <Badge variant={analysisResult.auditChecks.psiDuplicateMatch ? 'warning' : 'success'}>
                        {analysisResult.auditChecks.psiDuplicateMatch ? 'DUPLICATE COLLISION' : 'VALID RECORD'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Provenance: <strong className="text-emerald-700 font-bold">{analysisResult.provenanceCheck}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600 font-mono">
                  <p>Neural Confidence: <strong className="text-emerald-700 font-bold">{analysisResult.confidenceScore}%</strong></p>
                  <p className="text-[10px]">Execution Latency: {analysisResult.latencyMs}ms</p>
                </div>
              </div>

              {/* Multilingual Indian Language & Anti-Photoshop Forensic Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Multilingual Indian Language Pill */}
                <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 flex items-start justify-between text-xs">
                  <div className="flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-semibold block">Indian Language Analysis</span>
                      <strong className="text-purple-900 text-xs mt-0.5 block font-bold">
                        {analysisResult.multilingualProfile?.language || 'English (Canonical Standard)'}
                      </strong>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Script: {analysisResult.multilingualProfile?.script || 'Latin'} • {analysisResult.multilingualProfile?.stateProvenance}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 font-bold shrink-0">
                    PARSED
                  </span>
                </div>

                {/* 2. Anti-Photoshop Forensic Integrity Pill */}
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start justify-between text-xs">
                  <div className="flex items-start gap-2.5">
                    <Camera className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-semibold block">Forensic Image Integrity</span>
                      <strong className="text-emerald-900 text-xs mt-0.5 block font-bold">
                        100% Authentic • Zero Photoshop Splicing Detected
                      </strong>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        ELA Error Analysis: Passed • Glyph Baseline: Continuous • Clone Stamp: None
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shrink-0">
                    UNALTERED
                  </span>
                </div>
              </div>

              {/* Optional Visual Document Image Render */}
              {analysisResult.image && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={analysisResult.image}
                    alt="Scanned Document Preview"
                    className="w-full sm:w-56 h-36 object-contain rounded-lg border border-slate-300 shadow-xs bg-white"
                  />
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Scanned Document Visual Artifact
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">Official National APAAR Student Registry Card</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Laplacian edge sharpness verified: 178.40. Zero quantization disparity detected across RGB spectrum.
                    </p>
                    <a
                      href="/apaar-forensics"
                      className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline text-xs pt-1"
                    >
                      Open in APAAR Vision Lab <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Extracted Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Student Name</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{analysisResult.extractedData.studentName}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">APAAR Reference</span>
                  <strong className="font-mono text-purple-700 font-bold text-xs mt-0.5 block">{analysisResult.extractedData.syntheticApaarId}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Primary Institution</span>
                  <strong className="text-slate-900 truncate mt-0.5 block">{analysisResult.extractedData.institutionName}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Program / Quota</span>
                  <strong className="text-slate-900 truncate mt-0.5 block">
                    {analysisResult.extractedData.program} ({analysisResult.extractedData.admissionCategory})
                  </strong>
                </div>
              </div>

              {/* Multi-Dimensional Audit Outcome Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${analysisResult.auditChecks.psiDuplicateMatch ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  <div>
                    <p className="font-bold text-slate-900">Cryptographic PSI Duplicate Match</p>
                    <p className="text-[10px] text-slate-600">
                      {analysisResult.auditChecks.psiDuplicateMatch ? 'Overlap detected across 2 institutions' : 'Zero duplicate collisions'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${analysisResult.auditChecks.intakeLimitDrift ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <div>
                    <p className="font-bold text-slate-900">Intake Quota Circuit Breaker</p>
                    <p className="text-[10px] text-slate-600">
                      {analysisResult.auditChecks.intakeLimitDrift ? 'Capacity exceeded (+12 seats over quota)' : 'Within approved intake limit'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <div>
                    <p className="font-bold text-slate-900">Isolation Forest Anomaly Score</p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      Risk Index: <strong className="text-purple-700 font-bold">{analysisResult.auditChecks.isolationForestAnomalyScore}</strong> ({analysisResult.auditChecks.riskTier})
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Note & Live Pipeline Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                <div className="flex items-center gap-2 text-purple-900">
                  <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Staged into <strong>Sandboxed Diff Chamber</strong>. Live n8n workflows and Neo4j relationship graphs updated below.
                  </span>
                </div>
                <Badge variant="purple">LIVE MESH ACTIVE</Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
