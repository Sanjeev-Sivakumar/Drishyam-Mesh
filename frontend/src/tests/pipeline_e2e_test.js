// Project Sentinel-Ledger • End-to-End Pipeline Verification Suite
// Tests Multilingual Parsing, Forensic Anti-Photoshop Detection, Academic Pattern Matching, Irrelevant Rejection, and Registry Commit

import { documentAnalysisService, TEST_DOCUMENTS } from '../services/documentAnalysisService.js';
import { studentService } from '../services/studentService.js';
import { auditService } from '../services/auditService.js';
import { complianceService } from '../services/complianceService.js';
import { reviewService } from '../services/reviewService.js';
import { credentialService } from '../services/credentialService.js';
import api from '../services/api.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       Evidence: ${details}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       Detail: ${details}`);
  }
}

async function runPipelineTests() {
  console.log('========================================================================');
  console.log('PROJECT SENTINEL-LEDGER • FULL PIPELINE INTEGRATION VERIFICATION');
  console.log('Powered by Sentinel Cognitive Vision Engine v4.2');
  console.log('========================================================================\n');

  // Test 1: Authentic English APAAR Document
  console.log('--- TEST GROUP 1: AUTHENTIC CENTRAL APAAR DOCUMENT ---');
  const apaarDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-apaar-valid');
  const resApaar = await documentAnalysisService.analyzeDocument(apaarDoc);
  assert(resApaar.isAcademic === true, 'Valid Academic Record Accepted');
  assert(resApaar.status === 'VERIFIED_ACADEMIC_RECORD', 'Status is VERIFIED_ACADEMIC_RECORD');
  assert(resApaar.extractedData.syntheticApaarId === '9082-3145-6671', 'Extracted synthetic APAAR ID (9082-3145-6671)', resApaar.extractedData.syntheticApaarId);
  assert(resApaar.forensicIntegrity.isPhotoshopped === false, 'Forensic Authenticity Verified (Zero Photoshop)', resApaar.forensicIntegrity.status);
  assert(resApaar.forensicIntegrity.elaCheck.includes('PASSED'), 'Error Level Analysis Passed');

  // Test 2: Multilingual Indian Language (Hindi Devanagari)
  console.log('\n--- TEST GROUP 2: MULTILINGUAL INDIAN LANGUAGE (HINDI / DEVANAGARI) ---');
  const hindiDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-hindi-allotment');
  const resHindi = await documentAnalysisService.analyzeDocument(hindiDoc);
  assert(resHindi.isAcademic === true, 'Hindi Academic Memo Accepted');
  assert(resHindi.multilingualProfile.detected === true, 'Detected Indian Language', resHindi.multilingualProfile.language);
  assert(resHindi.multilingualProfile.language.includes('Hindi'), 'Language Classified as Hindi (हिन्दी)');
  assert(resHindi.extractedData.studentName.includes('Devansh Gupta'), 'Extracted and Normalized Candidate Name', resHindi.extractedData.studentName);

  // Test 3: Multilingual Indian Language (Tamil)
  console.log('\n--- TEST GROUP 3: MULTILINGUAL INDIAN LANGUAGE (TAMIL) ---');
  const tamilDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-tamil-tnea');
  const resTamil = await documentAnalysisService.analyzeDocument(tamilDoc);
  assert(resTamil.isAcademic === true, 'Tamil TNEA Allotment Order Accepted');
  assert(resTamil.multilingualProfile.language.includes('Tamil'), 'Language Classified as Tamil (தமிழ்)', resTamil.multilingualProfile.language);
  assert(resTamil.extractedData.institutionCode === 'AICTE-TN-301', 'Institutional Accreditation Code Validated (AICTE-TN-301)');

  // Test 4: Multilingual Indian Language (Marathi)
  console.log('\n--- TEST GROUP 4: MULTILINGUAL INDIAN LANGUAGE (MARATHI) ---');
  const marathiDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-marathi-dte');
  const resMarathi = await documentAnalysisService.analyzeDocument(marathiDoc);
  assert(resMarathi.isAcademic === true, 'Marathi DTE Allotment Letter Accepted');
  assert(resMarathi.multilingualProfile.language.includes('Marathi'), 'Language Classified as Marathi (मराठी)', resMarathi.multilingualProfile.language);
  assert(resMarathi.extractedData.institutionCode === 'AICTE-MAH-202', 'COEP Institution Code Mapped (AICTE-MAH-202)');

  // Test 5: Digital Forgery / Photoshopped Document
  console.log('\n--- TEST GROUP 5: ANTI-PHOTOSHOP & TAMPER FORENSIC SPLICING DETECTION ---');
  const forgedDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-photoshopped-forgery');
  const resForged = await documentAnalysisService.analyzeDocument(forgedDoc);
  assert(resForged.isAcademic === false, 'Photoshopped Document Rejected from Academic Ingestion');
  assert(resForged.status === 'FLAGGED_TAMPERED', 'Flagged as FLAGGED_TAMPERED');
  assert(resForged.forensicIntegrity.isPhotoshopped === true, 'Photoshop Forgery Marker Detected');
  assert(resForged.forensicIntegrity.elaCheck.includes('FAILED'), 'Error Level Analysis (ELA) Triggered Failure', resForged.forensicIntegrity.elaCheck);
  assert(resForged.reasons.length >= 3, 'Forensic Evidence Breakdown Provided', `${resForged.reasons.length} vectors identified`);

  // Test 6: Irrelevant Non-Academic Document (Walmart Grocery Receipt)
  console.log('\n--- TEST GROUP 6: IRRELEVANT DOCUMENT (COMMERCIAL RETAIL INVOICE) ---');
  const groceryDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-irrelevant-invoice');
  const resGrocery = await documentAnalysisService.analyzeDocument(groceryDoc);
  assert(resGrocery.isAcademic === false, 'Commercial Grocery Invoice Rejected');
  assert(resGrocery.status === 'FLAGGED_IRRELEVANT', 'Classified as FLAGGED_IRRELEVANT');
  assert(resGrocery.detectedCategory.includes('Commercial Retail Supermarket Invoice'), 'Detected Category Matches Retail', resGrocery.detectedCategory);
  assert(resGrocery.quarantineAction.includes('Quarantine Chamber'), 'Isolated in Sentinel Quarantine Chamber');

  // Test 7: Irrelevant Non-Academic Document (BSES Electricity Bill)
  console.log('\n--- TEST GROUP 7: IRRELEVANT DOCUMENT (MUNICIPAL UTILITY BILL) ---');
  const electricityDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-irrelevant-electricity');
  const resElectricity = await documentAnalysisService.analyzeDocument(electricityDoc);
  assert(resElectricity.isAcademic === false, 'Electricity Bill Rejected');
  assert(resElectricity.status === 'FLAGGED_IRRELEVANT', 'Status FLAGGED_IRRELEVANT');
  assert(resElectricity.detectedCategory.includes('Utility'), 'Category Classified as Utility');

  // Test 8: Irrelevant Non-Academic Document (Healthcare Medical Pharmacy)
  console.log('\n--- TEST GROUP 8: IRRELEVANT DOCUMENT (HEALTHCARE PHARMACY PRESCRIPTION) ---');
  const pharmacyDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-irrelevant-pharmacy');
  const resPharmacy = await documentAnalysisService.analyzeDocument(pharmacyDoc);
  assert(resPharmacy.isAcademic === false, 'Medical Pharmacy Bill Rejected');
  assert(resPharmacy.status === 'FLAGGED_IRRELEVANT', 'Status FLAGGED_IRRELEVANT');
  assert(resPharmacy.detectedCategory.includes('Healthcare Medical Pharmacy Prescription'), 'Category Classified as Healthcare Prescription');

  // Test 9: Concurrent Dual Enrollment Collision (Neo4j & PSI)
  console.log('\n--- TEST GROUP 9: CONCURRENT ADMISSION COLLISION DETECTION ---');
  const collisionDoc = TEST_DOCUMENTS.find(d => d.id === 'doc-concurrent-duplicate');
  const resCollision = await documentAnalysisService.analyzeDocument(collisionDoc);
  assert(resCollision.auditChecks.psiDuplicateMatch === true, 'Private Set Intersection (PSI) Collision Flagged');
  assert(resCollision.auditChecks.neo4jRelationshipCollision === true, 'Neo4j Graph Relationship Collision Verified');
  assert(resCollision.auditChecks.riskTier === 'CRITICAL_COLLISION', 'Risk Tier Escalated to CRITICAL_COLLISION');

  // Authenticate against live backend
  console.log('\n--- LIVE BACKEND AUTHENTICATION (JWT) ---');
  const authRes = await api.post('/auth/login', { username: 'admin', password: 'Admin@123' });
  assert(authRes.data && authRes.data.token, 'Authenticated dynamically with Spring Boot backend JWT');
  api.defaults.headers.common['Authorization'] = `Bearer ${authRes.data.token}`;

  // Test 10: Sandboxed Diff Staging & Registry Commit Pipeline
  console.log('\n--- TEST GROUP 10: SANDBOXED DIFF STAGING & REGISTRY COMMIT ---');
  const committedStudent = await studentService.createStudent({
    studentName: 'Priya Sharma',
    syntheticApaarId: `9082-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    enrollmentNumber: `EN-2024-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    institutionId: 1,
    program: 'Computer Science and Engineering',
    academicYear: '2024-2025',
    admissionYear: 2024,
    admissionCategory: 'OBC',
    admissionStatus: 'ADMITTED'
  });
  assert(committedStudent && committedStudent.id, 'Record Successfully Inserted into Registry Ledger', `ID: ${committedStudent.id}`);

  // Test 11: Query Student Records Scoped by Institution
  console.log('\n--- TEST GROUP 11: REGISTRAR SCOPING & RBAC QUERY ---');
  const studentList = await studentService.getStudents({ institutionId: 1 });
  assert(studentList.content && studentList.content.length > 0, 'Scoped Records Retrieved for Delhi Institute', `${studentList.totalElements} records`);

  // Test 12: Cryptographic Credential Issuance & Verification
  console.log('\n--- TEST GROUP 12: DECENTRALIZED CREDENTIAL ISSUANCE & VERIFICATION ---');
  const issuedCred = await credentialService.issueCredential({
    studentId: committedStudent.id,
    qualification: 'Bachelor of Technology in Computer Science',
    completionYear: new Date().getFullYear(),
    cgpaOrGrade: '8.85 / 10.0'
  });
  assert(issuedCred && issuedCred.credentialId, 'Verifiable Credential Issued', issuedCred.credentialId);

  const verifySuccess = await credentialService.verifyCredential({ credentialId: issuedCred.credentialId });
  assert(verifySuccess.valid === true, 'Cryptographic Signature Validated (Zero-Trust)');

  const verifyTamper = await credentialService.verifyCredential({
    credentialId: issuedCred.credentialId,
    payloadJson: JSON.stringify({ qualification: 'Tampered Doctorate Claim' })
  });
  assert(verifyTamper.valid === false, 'Adversarial Tampered Credential Successfully Rejected');

  console.log('\n========================================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('========================================================================');

  if (passedTests === totalTests) {
    console.log('RESULT: 100% OF PIPELINE MODULES VERIFIED & OPERATING FLAWLESSLY!\n');
  } else {
    process.exit(1);
  }
}

runPipelineTests().catch(err => {
  console.error('Fatal Pipeline Test Failure:', err);
  process.exit(1);
});
