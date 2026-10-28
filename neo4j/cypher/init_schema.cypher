// ============================================================================
// Project Sentinel-Ledger • Drishyam Mesh
// Neo4j Graph Database Schema & Knowledge Mesh Initialization Script
// Cypher Engine v5.12+ (Compatible with Neo4j Community & Enterprise)
// ============================================================================

// 1. Create Unique Constraints & High-Performance Indexes
CREATE CONSTRAINT unique_student_apaar IF NOT EXISTS
FOR (s:Student) REQUIRE s.syntheticApaarId IS UNIQUE;

CREATE CONSTRAINT unique_institution_code IF NOT EXISTS
FOR (i:Institution) REQUIRE i.code IS UNIQUE;

CREATE CONSTRAINT unique_aadhaar_token IF NOT EXISTS
FOR (t:AadhaarToken) REQUIRE t.tokenHash IS UNIQUE;

CREATE INDEX student_name_index IF NOT EXISTS
FOR (s:Student) ON (s.name);

CREATE INDEX program_code_index IF NOT EXISTS
FOR (p:Program) ON (p.name);

// 2. Clear Existing Demo Graph Data (Idempotent Initialization)
MATCH (n) DETACH DELETE n;

// 3. Create Institutional Mesh Nodes
CREATE (dtu:Institution {
  id: 'inst-1',
  name: 'Delhi Technological University (DTU)',
  code: 'AICTE-DEL-101',
  state: 'Delhi',
  city: 'New Delhi',
  configuredIntake: 120,
  approvalStatus: 'APPROVED'
})
CREATE (coep:Institution {
  id: 'inst-2',
  name: 'COEP Technological University Pune',
  code: 'AICTE-MAH-202',
  state: 'Maharashtra',
  city: 'Pune',
  configuredIntake: 180,
  approvalStatus: 'APPROVED'
})
CREATE (iitb:Institution {
  id: 'inst-3',
  name: 'Indian Institute of Technology Bombay',
  code: 'AICTE-MAH-105',
  state: 'Maharashtra',
  city: 'Mumbai',
  configuredIntake: 150,
  approvalStatus: 'APPROVED'
})
CREATE (anna:Institution {
  id: 'inst-4',
  name: 'Anna University College of Engineering',
  code: 'AICTE-TN-301',
  state: 'Tamil Nadu',
  city: 'Chennai',
  configuredIntake: 200,
  approvalStatus: 'APPROVED'
});

// 4. Create Curricular Academic Program Nodes
CREATE (p_cse:Program { id: 'prog-cse', name: 'Computer Science and Engineering', degree: 'B.Tech', durationYears: 4 })
CREATE (p_entc:Program { id: 'prog-entc', name: 'Electronics and Telecommunication Engineering', degree: 'B.Tech', durationYears: 4 })
CREATE (p_mech:Program { id: 'prog-mech', name: 'Mechanical Engineering', degree: 'B.Tech', durationYears: 4 });

// Connect Programs to Offering Institutions
MATCH (dtu:Institution {code: 'AICTE-DEL-101'}), (coep:Institution {code: 'AICTE-MAH-202'}), (anna:Institution {code: 'AICTE-TN-301'}),
      (p_cse:Program {id: 'prog-cse'}), (p_entc:Program {id: 'prog-entc'}), (p_mech:Program {id: 'prog-mech'})
CREATE (dtu)-[:OFFERS {sanctionedIntake: 120, admittedCount: 118}]->(p_cse)
CREATE (dtu)-[:OFFERS {sanctionedIntake: 120, admittedCount: 124}]->(p_mech)
CREATE (coep)-[:OFFERS {sanctionedIntake: 180, admittedCount: 172}]->(p_entc)
CREATE (anna)-[:OFFERS {sanctionedIntake: 200, admittedCount: 198}]->(p_cse);

// 5. Create Students, APAAR References, and Biometric Hash Commitments
CREATE (s1:Student {
  id: 'stud-1',
  name: 'Devansh Gupta',
  syntheticApaarId: '9082-3145-6671',
  enrollmentNumber: 'EN-2024-DTU-0842',
  gender: 'MALE',
  admissionCategory: 'GENERAL',
  academicYear: '2024-2025'
})
CREATE (a1:ApaarToken {
  id: 'apaar-1',
  apaarId: '9082-3145-6671',
  issuedBy: 'Ministry of Education National Registry',
  status: 'ACTIVE'
})
CREATE (b1:AadhaarToken {
  id: 'token-1',
  tokenHash: '0x8f2d91c4b72183e91024bc6719ef8a20391d842b',
  blindedCommitment: '0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91'
})
CREATE (s1)-[:HAS_IDENTIFIER]->(a1)
CREATE (s1)-[:VERIFIED_BY]->(b1);

// Primary Valid Enrollment
MATCH (s1:Student {id: 'stud-1'}), (dtu:Institution {code: 'AICTE-DEL-101'}), (p_cse:Program {id: 'prog-cse'})
CREATE (s1)-[:ENROLLED_AT {allotmentStatus: 'CONFIRMED', quota: 'AICTE_OPEN_MERIT', timestamp: '2024-08-15T10:00:00Z'}]->(dtu)
CREATE (s1)-[:PURSUING]->(p_cse);

// 6. INJECT CONCURRENT MULTI-INSTITUTION COLLISION (Ghost Enrollment Case)
MATCH (s1:Student {id: 'stud-1'}), (coep:Institution {code: 'AICTE-MAH-202'})
CREATE (s1)-[:CONCURRENT_CLAIM {
  conflictType: 'DUPLICATE_REGULAR_SEAT',
  severity: 'CRITICAL_COLLISION',
  detectionEngine: 'NEO4J_CYPHER_TRAVERSAL',
  stateEntranceMemo: 'MAH-CET-ROUND-2-ALLOTMENT',
  flaggedTimestamp: '2024-10-28T14:00:00Z'
}]->(coep);

// 7. Additional Valid Student Nodes for Graph Richness
CREATE (s2:Student {
  id: 'stud-2',
  name: 'Priya Sharma',
  syntheticApaarId: '9082-4412-8821',
  enrollmentNumber: 'EN-2024-ANNA-0102',
  gender: 'FEMALE',
  admissionCategory: 'OBC_NCL',
  academicYear: '2024-2025'
})
CREATE (a2:ApaarToken {
  id: 'apaar-2',
  apaarId: '9082-4412-8821',
  status: 'ACTIVE'
})
CREATE (s2)-[:HAS_IDENTIFIER]->(a2)
WITH s2
MATCH (anna:Institution {code: 'AICTE-TN-301'}), (p_cse:Program {id: 'prog-cse'})
CREATE (s2)-[:ENROLLED_AT {allotmentStatus: 'CONFIRMED'}]->(anna)
CREATE (s2)-[:PURSUING]->(p_cse);

// 8. Output Graph Summary
MATCH (s:Student)
OPTIONAL MATCH (s)-[c:CONCURRENT_CLAIM]->(conflictInst:Institution)
RETURN count(s) AS totalStudents, count(c) AS detectedCollisions;
