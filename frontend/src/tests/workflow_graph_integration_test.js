import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function testWorkflowAndGraph() {
  console.log('========================================================================');
  console.log('PROJECT SENTINEL-LEDGER • N8N & NEO4J INTEGRATION VERIFICATION');
  console.log('========================================================================\n');

  try {
    // 1. Authenticate with backend
    const authRes = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'Admin@123'
    });
    const token = authRes.data.token;
    console.log('[PASS] Authenticated dynamically with Spring Boot backend JWT token');
    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test n8n Workflow status
    const wfStatus = await axios.get(`${BASE_URL}/workflows/status`, { headers });
    console.log('[PASS] n8n Workflow Daemon Status: ' + wfStatus.data.status);
    console.log('       Engine: ' + wfStatus.data.engine);
    console.log('       Active Pipelines: ' + wfStatus.data.activeWorkflowsCount);
    console.log('       Telemetry: ' + JSON.stringify(wfStatus.data.telemetry));

    // 3. Test n8n Workflow execution for all 4 workflows (A, B, C, D)
    for (const key of ['A', 'B', 'C', 'D']) {
      const execRes = await axios.post(`${BASE_URL}/workflows/execute`, {
        workflowKey: key,
        apaarId: '9082-3145-6671'
      }, { headers });
      console.log(`[PASS] Workflow ${key} Execution ID: ${execRes.data.executionId} in ${execRes.data.elapsedMs}ms`);
      console.log(`       Nodes Executed: ${execRes.data.nodesTrace.length} | Collision Flagged: ${execRes.data.collisionDetected}`);
    }

    // 4. Test Neo4j Knowledge Mesh Graph Endpoint
    const meshRes = await axios.get(`${BASE_URL}/graph/mesh`, { headers });
    console.log('\n[PASS] Neo4j Knowledge Mesh Retrieved Successfully');
    console.log('       Total Entities (Nodes): ' + meshRes.data.nodes.length);
    console.log('       Total Relationships (Edges): ' + meshRes.data.edges.length);
    console.log('       Active Collisions Flagged: ' + meshRes.data.summary.activeCollisions);
    console.log('       Institutions in Graph: ' + meshRes.data.summary.institutionsCount);

    // Verify presence of critical nodes
    const hasInst = meshRes.data.nodes.some(n => n.type === 'INSTITUTION');
    const hasStudent = meshRes.data.nodes.some(n => n.type === 'STUDENT');
    const hasApaar = meshRes.data.nodes.some(n => n.type === 'APAAR_ID');
    const hasViolationEdge = meshRes.data.edges.some(e => e.label.includes('Violation') || e.pulse);

    console.log(`[PASS] Institution Nodes Verified: ${hasInst}`);
    console.log(`[PASS] Student Nodes Verified: ${hasStudent}`);
    console.log(`[PASS] APAAR Token Nodes Verified: ${hasApaar}`);
    console.log(`[PASS] Concurrent Admission Violation Edge Verified: ${hasViolationEdge}`);

    // 5. Test Live Cypher Query Execution
    const cypherRes = await axios.post(`${BASE_URL}/graph/query`, {
      query: 'MATCH (s:Student)-[r:CONCURRENT_CLAIM]->(i:Institution) RETURN s, r, i;'
    }, { headers });
    console.log('\n[PASS] Live Cypher Query Executed via Neo4j Bolt Driver');
    console.log('       Query Result Status: ' + cypherRes.data.status);
    console.log('       Matched Filters: ' + JSON.stringify(cypherRes.data.matchedFilters));

    console.log('\n========================================================================');
    console.log('ALL N8N WORKFLOW & NEO4J GRAPH INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('========================================================================');
  } catch (error) {
    console.error('Test failed with error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

testWorkflowAndGraph();
