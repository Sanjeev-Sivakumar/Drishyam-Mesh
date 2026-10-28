# Drishyam Mesh (Project Sentinel-Ledger)

> Smart India Hackathon (SIH) Prototype
> Problem Statement: Development of an APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions.

Drishyam Mesh is a zero-trust, full-stack institutional data governance and academic identity resolution platform engineered for AICTE-approved institutions and statutory regulatory bodies. Built on the national APAAR ID (Automated Permanent Academic Account Registry), the platform unifies student-level data submissions across technical, polytechnic, and PGDM colleges, eliminates cross-institutional duplicate enrollments and ghost students, audits intake quotas in real-time, and issues cryptographically verifiable credentials under DPDP Act 2023 compliance.

---

## 1. Executive Summary & Problem Resolution

### AICTE Regulatory Problem
AICTE receives student-related information from thousands of approved institutions through varied and uncoordinated reporting channels. While PGDM institutions report detailed student-level rosters annually, technical colleges predominantly provide aggregated statistical headcounts during the annual Approval Process Handbook (APH) extension cycle. This disparate data submission model creates severe systemic challenges:
- Absence of an authentic, real-time national student registry.
- Vulnerability to cross-institutional duplicate enrollments and ghost students (candidates claiming seats across multiple state CET allotments simultaneously).
- Inability to enforce sanctioned program intake quotas dynamically against supernumerary caps.
- High risk of fraudulent admission letters and photoshopped credential tampering.
- Compliance bottlenecks with the Digital Personal Data Protection (DPDP) Act 2023 during third-party employer verifications.

### The Drishyam Mesh Solution
Drishyam Mesh establishes an integrated, secure, and event-driven digital platform utilizing APAAR ID as the primary academic key:
- Autonomous Multilingual Ingestion: Sentinel Cognitive Vision Engine parses admission allotment orders, digital cards, and grade sheets in English and regional Indian languages (Hindi, Tamil, Marathi, Telugu) with automatic anti-photoshop Error Level Analysis (ELA).
- Sandboxed Diff Chamber: Git-style pre-commit diff staging prevents silent registry overwrites and enables registrar verification before ledger commitments.
- Multi-Institution Neo4j Knowledge Mesh: Graph-traversal engine maps student-institution-program topological relationships and detects concurrent enrollment collisions via live Cypher queries.
- Autonomous n8n Workflow Orchestration: Four deterministic, event-driven pipelines execute data validation, Private Set Intersection (PSI) collision resolution, quota compliance auditing, and credential dispatch.
- Cryptographic Verifiable Credentials: Offline QR and Ed25519/RSA-2048 signed credentials with DPDP Act 2023 student consent and selective disclosure claims.

---

## 2. System Architecture

```text
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION TIER                                  |
|  React 19 + Vite + Tailwind CSS + Lucide Icons + Pure White High-Contrast UI Tokens   |
|                                                                                       |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  | National Overview  |  | n8n Workflow Viewer  |  | Neo4j Knowledge Mesh Visualizer|  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
|  | Document Ingestion |  | Sandboxed Diff Stage |  | Student Consent & VC Gateway  |  |
|  +--------------------+  +----------------------+  +-------------------------------+  |
+-------------------------------------------+-------------------------------------------+
                                            | REST API / JSON over TLS 1.3
+-------------------------------------------v-------------------------------------------+
|                               APPLICATION & INTELLIGENCE TIER                         |
|  Spring Boot 3.3.5 (Java 21 LTS) + Sentinel Cognitive Vision Engine + JCA Crypto      |
|                                                                                       |
|  - Role-Based Access Control (RBAC): AICTE_ADMIN, COLLEGE_REGISTRAR, VERIFIER        |
|  - Institution Scoping: Strict IDOR isolation per registrar node                      |
|  - Forensic Analysis: Discrete Cosine Transform (DCT) Error Level Analysis (ELA)     |
|  - Cryptographic Engine: RSA-2048 / Ed25519 digital signatures & SHA-256 ledger      |
+---------------------+-------------------------------+---------------------------------+
                      |                               |
+---------------------v-------+       +---------------v---------------+
|      RELATIONAL STORAGE     |       |       GRAPH KNOWLEDGE MESH    |
|  MySQL 8.0 (InnoDB)         |       |  Neo4j Bolt 7687 (Cypher 5.12)|
|  - Flyway Migrations (V1)   |       |  - Nodes: Institution, Student|
|  - 9 Structured Tables      |       |    Program, ApaarToken        |
|  - Audit Log Event Trails   |       |  - Edges: ENROLLED_AT, OFFERS |
|  - Student Revision History |       |    HAS_IDENTIFIER, CONCURRENT |
+-----------------------------+       +-------------------------------+
```

---

## 3. Core Modules & Innovations

### 3.1 Autonomous Multilingual Document Ingestion & Forensic Analyzer
- Multilingual Optical Pattern Recognition: Normalizes Indian regional academic scripts (Devanagari/Hindi, Tamil, Marathi) into canonical AICTE schema formats.
- Forensic Tampering & Photoshop Splicing Detection: Analyzes font baseline jitter, resaving quantization artifacts, and high-frequency Discrete Cosine Transform (DCT) discrepancies to isolate altered admission orders.
- Irrelevant Document Rejection: Automatically rejects non-academic files (grocery invoices, electricity bills, healthcare prescriptions) into a quarantined chamber.

### 3.2 Sandboxed Diff Chamber
- Git-style pre-commit inspection staging field-level additions, modifications, and conflicts before permanent database insertion.
- Visual comparative diffs displaying candidate identity, institutional claims, and intake allocations.
- Reversible staging with atomic commit and revalidation safeguards preventing repeat submissions.

### 3.3 Neo4j Multi-Dimensional Knowledge Graph Mesh
- Graph topology mapping verified students, APAAR tokens, programs, and accredited colleges.
- Identifies cross-institutional collisions in real-time when a single APAAR token is claimed by multiple institutions concurrently.
- Interactive Cypher query terminal executing live graph traversals and property inspection.

### 3.4 n8n Autonomous Workflow Orchestration
Four distinct automated pipelines visualizable in real-time:
1. Workflow A: Admission Ingestion & Data Quality Gateway (ERP webhook ingest, keystore validation, canonical normalization, diff staging).
2. Workflow B: Cross-State Identity Resolution & Private Set Intersection (PSI matching, Neo4j collision traversal, fraud dispute dispatch).
3. Workflow C: Sanctioned Intake Quota Policy Enforcement (Course capacity tracking, supernumerary cap validation, regulatory alerts).
4. Workflow D: W3C Verifiable Credential & Blind Verification Relay (Ed25519 digital signing, offline QR anchoring, DPDP consent management).

### 3.5 DPDP Act 2023 Student Data Sovereignty
- Zero-knowledge attribute filtering allowing students to approve or mask individual credentials (e.g., disclosing degree and cohort while masking cumulative GPA, birth date, or raw Aadhaar references).
- Time-limited authorization tokens preventing perpetual access by third-party verifiers.
- Immediate revocation mechanisms that instantly invalidate third-party verification endpoints.

---

## 4. Repository Directory Structure

```text
Drishyam-Mesh/
|-- backend/
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/com/sentinel/ledger/
|   |   |   |   |-- SentinelLedgerApplication.java
|   |   |   |   |-- config/          (OpenApiConfig, SecurityConfig, CorsConfig)
|   |   |   |   |-- controller/      (Auth, Student, Import, Review, Compliance, Credential, Graph, Workflow)
|   |   |   |   |-- service/         (Student, Import, Review, Crypto, Audit, GraphService, WorkflowService)
|   |   |   |   |-- repository/      (Student, User, Institution, ImportBatch, ReviewCase, AuditLog)
|   |   |   |   |-- entity/          (Student, User, Institution, ImportBatch, ReviewCase, Credential)
|   |   |   |   |-- dto/             (Requests, Responses, Summaries, GraphDTO)
|   |   |   |   |-- exception/       (GlobalExceptionHandler, CustomExceptions)
|   |   |   |   `-- enums/           (Role, AdmissionCategory, CaseStatus, Severity)
|   |   |   `-- resources/
|   |   |       |-- application.yml
|   |   |       `-- db/migration/V1__init_schema.sql
|   |   `-- test/
|   |-- pom.xml
|   `-- README.md
|
|-- frontend/
|   |-- public/
|   |   `-- AICTE.png
|   |-- src/
|   |   |-- assets/
|   |   |   `-- AICTE.png
|   |   |-- components/
|   |   |   |-- analyzer/        (DocumentAnalyzer - 10 Test Bench Scenarios Table)
|   |   |   |-- certificate/     (DegreeCertificateModal - Printable Official Parchment)
|   |   |   |-- consent/         (StudentConsentGateway - DPDP Selective Disclosure)
|   |   |   |-- diff/            (SandboxedDiffChamber - Git-Style Pre-Commit Diff)
|   |   |   |-- graph/           (Neo4jGraphViewer - Pure White Canvas Knowledge Mesh)
|   |   |   |-- layout/          (Sidebar, Topbar, Layout)
|   |   |   |-- ledger/          (TamperLedgerViewer - Append-Only Immutable Chain)
|   |   |   |-- reports/         (RegulatoryReportsModal - AICTE Statutory Reports Hub)
|   |   |   |-- ui/              (Badge, Button, Card, Modal, Input)
|   |   |   `-- workflow/        (N8nWorkflowViewer - Live Autonomous Pipeline Runner)
|   |   |-- pages/
|   |   |   |-- AuditLogs/       (Cryptographic Log Stream)
|   |   |   |-- Compliance/      (Program Intake Capacity & Quota Utilization)
|   |   |   |-- Dashboard/       (National Governance Grid Telemetry)
|   |   |   |-- Imports/         (Multilingual Ingestion & Batch Staging)
|   |   |   |-- Institutions/    (Accredited Institutions Directory)
|   |   |   |-- KnowledgeMesh/   (Full-Screen Neo4j Bolt Explorer)
|   |   |   |-- Login/           (Role Authentication with Preset Accounts)
|   |   |   |-- Register/        (Institutional Tenant Provisioning)
|   |   |   |-- Reviews/         (Collision Dispute Resolution Chamber)
|   |   |   |-- Settings/        (Zero-Trust Key Management & Encryption Specs)
|   |   |   |-- Students/        (Authoritative Student Registry & Diff History)
|   |   |   |-- Verification/    (Cryptographic Trust Gateway & Offline QR)
|   |   |   `-- Workflows/       (Dedicated n8n Workflow Orchestration View)
|   |   |-- services/            (api, auth, student, import, review, graph, workflow, audit, etc.)
|   |   |-- tests/               (pipeline_e2e_test.js - 39-Step End-to-End Suite)
|   |   |-- App.jsx
|   |   |-- index.css            (Pure White Theme Design System Tokens)
|   |   `-- main.jsx
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|
|-- n8n/
|   `-- workflows/               (Authoritative n8n Workflow JSON Definitions)
|-- neo4j/
|   `-- schema/                  (Neo4j Cypher Schema & Constraints)
|-- AICTE.png                    (Official Statutory Logo)
|-- docker-compose.yml           (Orchestration for MySQL, Neo4j, n8n, Backend, Frontend)
|-- LICENSE                      (MIT License)
`-- README.md
```

---

## 5. Pre-Configured Demo Credentials & Scopes

The platform provides built-in one-click role switching on the Login page and Topbar navigation:

| Role | Username | Password | Operational Boundary | System Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **AICTE Admin** | `admin` | `Admin@123` | National AICTE Grid | Global registry access, intake monitoring, national review cases, audit logs |
| **Delhi Registrar** | `registrar_delhi` | `Registrar@123` | Delhi Institute of Adv Tech | Scoped strictly to Delhi Institute; CSV ingestion, student registry, local reviews |
| **Maha Registrar** | `registrar_maha` | `Registrar@123` | Maharashtra Inst of Tech | Scoped strictly to Maharashtra Institute; CSV ingestion, student registry, local reviews |
| **Corporate Verifier**| `verifier_corp` | `Verifier@123` | Verification Gateway | Minimal privacy disclosure verification, ZK proof checks, offline QR verification |

---

## 6. Installation & Local Setup

### 6.1 Prerequisites
- Java 21 LTS or Java 25 LTS
- Apache Maven 3.9+
- Node.js v18+ and npm
- MySQL 8.0 Server (running locally on port 3306)
- Optional: Docker & Docker Compose

### 6.2 Database Initialization (MySQL)
Execute in PowerShell or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS sentinel_ledger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6.3 Backend Service Setup
```powershell
cd backend
mvn clean test
mvn spring-boot:run
```
- REST API Server: `http://localhost:8080/api`
- Swagger OpenAPI Documentation: `http://localhost:8080/swagger-ui.html`

### 6.4 Frontend Web Application Setup
```powershell
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173/`
- Production Build Verification: `npm run build`

### 6.5 Running via Docker Compose
To launch the full containerized stack (MySQL, Neo4j, n8n, Backend, and Frontend):
```bash
docker-compose up -d
```

---

## 7. End-to-End Pipeline Verification Suite

The repository includes a comprehensive 39-step automated test harness validating every tier of the solution:

```powershell
cd frontend
node src/tests/pipeline_e2e_test.js
```

### Verified Acceptance Scenarios (39 / 39 Passing):
- Test Group 1: Authentic Central APAAR Document Ingestion (Status: `VERIFIED_ACADEMIC_RECORD`, ELA passed).
- Test Group 2: Multilingual Hindi / Devanagari Translation (Normalized name: देवांश गुप्ता to Devansh Gupta).
- Test Group 3: Multilingual Tamil TNEA Allotment Order (Institutional code `AICTE-TN-301` validated).
- Test Group 4: Multilingual Marathi DTE Allotment Letter (Institutional code `AICTE-MAH-202` mapped).
- Test Group 5: Anti-Photoshop & Tamper Forensic Detection (Flagged as `FLAGGED_TAMPERED`, high DCT disparity detected).
- Test Group 6: Irrelevant Retail Invoice Rejection (Supermarket bill rejected and quarantined).
- Test Group 7: Irrelevant Municipal Utility Bill Rejection (Electricity receipt classified as `FLAGGED_IRRELEVANT`).
- Test Group 8: Irrelevant Healthcare Prescription Rejection (Pharmacy bill classified as `FLAGGED_IRRELEVANT`).
- Test Group 9: Concurrent Admission Collision Detection (Private Set Intersection flagged multi-college claim).
- Test Group 10: Sandboxed Diff Staging & Registry Commit (Committed to permanent immutable registry).
- Test Group 11: Registrar Scoping & IDOR Prevention (Tenant-isolated queries validated).
- Test Group 12: Decentralized Credential Issuance & Verification (Ed25519/RSA-2048 validated, adversarial tamper detected).

---

## 8. Regulatory Compliance Standards

- APAAR / Academic Bank of Credits (ABC): Adheres to the National Education Policy (NEP) 2020 single academic identifier mandate.
- DPDP Act 2023: Zero-knowledge data minimization, purpose limitation, and consent-driven selective disclosure.
- AICTE Approval Process Handbook (APH): Real-time validation against approved branch intake ceilings and supernumerary caps (EWS, TFW, J&K, PMSSS).
- W3C Verifiable Credentials: Cryptographically verifiable claims format enabling instant offline validation via QR code.

---

## 9. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.
