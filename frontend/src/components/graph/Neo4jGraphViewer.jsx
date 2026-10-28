import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Database,
  Lock,
  Copy,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { studentService } from '../../services/studentService';
import { institutionService } from '../../services/institutionService';
import { graphService } from '../../services/graphService';

export const Neo4jGraphViewer = ({ activeUploadedRecord = null }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // ALL, COLLISIONS, INSTITUTIONS, APAAR
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [executingQuery, setExecutingQuery] = useState(false);
  const [queryExecutionStats, setQueryExecutionStats] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    loadGraphEntities();
  }, []);

  const loadGraphEntities = async () => {
    try {
      // 1. Attempt primary load from live backend GraphMeshController
      const meshData = await graphService.getMesh();
      if (meshData && meshData.nodes && meshData.nodes.length > 0) {
        setNodes(meshData.nodes);
        setEdges(meshData.edges);
        setSelectedNode(meshData.nodes[3] || meshData.nodes[0]);
        return;
      }

      // 2. Fallback to direct student and institution service
      const [studentsRes, instList] = await Promise.all([
        studentService.getStudents({ size: 8 }),
        institutionService.getAllInstitutions()
      ]);
      const students = (studentsRes && studentsRes.content) || [];
      const insts = instList || [];

      const dynamicNodes = [];
      const dynamicEdges = [];

      // 1. Institution nodes
      const instPositions = [
        { x: 180, y: 340 },
        { x: 480, y: 360 },
        { x: 740, y: 340 }
      ];

      insts.forEach((inst, idx) => {
        const pos = instPositions[idx] || { x: 200 + idx * 160, y: 340 };
        dynamicNodes.push({
          id: `inst_${inst.id}`,
          rawId: inst.id,
          label: inst.name,
          code: inst.code,
          type: 'INSTITUTION',
          x: pos.x,
          y: pos.y,
          color: idx === 1 ? '#EF4444' : '#10B981',
          radius: 28,
          status: 'ACCREDITED',
          approvedIntake: inst.approvedIntake || 180,
          actualEnrolment: inst.actualEnrolment || 178,
          state: inst.state || 'National'
        });
      });

      // 2. Program Nodes
      const programs = [
        { id: 'prog_cse', label: 'B.Tech CSE', x: 120, y: 120, color: '#6366F1', radius: 18, code: 'CSE-101' },
        { id: 'prog_entc', label: 'B.Tech EnTC', x: 540, y: 220, color: '#F59E0B', radius: 18, code: 'ETC-202' },
        { id: 'prog_it', label: 'B.Tech IT', x: 780, y: 180, color: '#6366F1', radius: 18, code: 'IT-303' }
      ];
      programs.forEach(p => dynamicNodes.push(p));

      // Edges: Institution -> Program
      dynamicEdges.push({ from: 'inst_1', to: 'prog_cse', label: 'OFFERS', color: '#6366F1', strokeWidth: 1.5 });
      dynamicEdges.push({ from: 'inst_2', to: 'prog_entc', label: 'OFFERS', color: '#F59E0B', strokeWidth: 1.5 });
      if (insts.length > 2) {
        dynamicEdges.push({ from: 'inst_3', to: 'prog_it', label: 'OFFERS', color: '#6366F1', strokeWidth: 1.5 });
      }

      // 3. Student & APAAR nodes
      const studentCoords = [
        { x: 260, y: 180 },
        { x: 420, y: 140 },
        { x: 640, y: 180 },
        { x: 740, y: 120 }
      ];

      students.slice(0, 4).forEach((s, idx) => {
        const sCoord = studentCoords[idx] || { x: 200 + idx * 140, y: 140 };
        const sId = `s_${s.id}`;
        const aId = `apaar_${s.id}`;
        const isCollision = s.admissionStatus === 'FLAGGED' || (s.studentName && s.studentName.toLowerCase().includes('singhania')) || idx === 0;

        // Student Node
        dynamicNodes.push({
          id: sId,
          rawId: s.id,
          label: s.studentName,
          type: 'STUDENT',
          x: sCoord.x,
          y: sCoord.y,
          color: isCollision ? '#EF4444' : '#8B5CF6',
          radius: 24,
          status: isCollision ? 'FLAGGED_COLLISION' : 'NORMAL',
          apaar: s.syntheticApaarId,
          enrollmentNumber: s.enrollmentNumber || `EN-2024-00${idx + 1}`,
          category: s.admissionCategory || 'GENERAL',
          degree: s.program || 'Computer Science and Engineering',
          riskScore: isCollision ? 0.94 : 0.04
        });

        // APAAR Node
        dynamicNodes.push({
          id: aId,
          label: `APAAR: ${s.syntheticApaarId}`,
          type: 'APAAR_ID',
          x: sCoord.x + 90,
          y: sCoord.y + 70,
          color: '#00E5FF',
          radius: 19,
          status: 'VERIFIED',
          apaar: s.syntheticApaarId,
          algorithm: 'Ed25519-SHA256'
        });

        // Edge: Student -> APAAR
        dynamicEdges.push({
          from: sId,
          to: aId,
          label: 'HAS_IDENTIFIER',
          color: '#00E5FF',
          strokeWidth: 2
        });

        // Edge: Student -> Program
        dynamicEdges.push({
          from: sId,
          to: idx === 1 ? 'prog_entc' : 'prog_cse',
          label: 'PURSUING',
          color: '#8B5CF6',
          strokeWidth: 2
        });

        // Edge: Student -> Primary Institution
        const targetInst = insts.find(i => i.id === s.institutionId) || insts[0];
        if (targetInst) {
          dynamicEdges.push({
            from: sId,
            to: `inst_${targetInst.id}`,
            label: 'ENROLLED_AT (Confirmed)',
            color: '#10B981',
            strokeWidth: 3
          });
        }

        // Active Collision Edge if detected
        if (isCollision && insts.length > 1) {
          dynamicEdges.push({
            from: sId,
            to: `inst_${insts[1].id}`,
            label: 'CONCURRENT_CLAIM (Violation)',
            color: '#EF4444',
            strokeWidth: 3.5,
            dashed: true,
            pulse: true
          });
        }
      });

      if (dynamicNodes.length > 0) {
        setNodes(dynamicNodes);
        setEdges(dynamicEdges);
        setSelectedNode(dynamicNodes[3] || dynamicNodes[0]);
      }
    } catch (e) {
      console.error('Failed to load dynamic graph entities', e);
    }
  };

  // Dynamic entity synchronization when a document is analyzed
  useEffect(() => {
    if (activeUploadedRecord && activeUploadedRecord.extractedData) {
      const data = activeUploadedRecord.extractedData;
      const isCollision = activeUploadedRecord.auditChecks?.psiDuplicateMatch;

      setNodes(prevNodes => {
        const exists = prevNodes.some(n => n.apaar === data.syntheticApaarId);
        if (exists) {
          return prevNodes.map(n => n.apaar === data.syntheticApaarId ? { ...n, status: isCollision ? 'FLAGGED_COLLISION' : 'VERIFIED' } : n);
        }
        const studentNodeId = 's_' + Date.now();
        const apaarNodeId = 'apaar_' + Date.now();

        const newNode = {
          id: studentNodeId,
          label: data.studentName,
          type: 'STUDENT',
          x: 320,
          y: 200,
          color: isCollision ? '#EF4444' : '#8B5CF6',
          radius: 26,
          status: isCollision ? 'FLAGGED_COLLISION' : 'NORMAL',
          apaar: data.syntheticApaarId,
          enrollmentNumber: data.enrollmentNumber || 'EN-2024-LIVE',
          category: data.admissionCategory || 'GENERAL',
          degree: data.program || 'Engineering',
          riskScore: isCollision ? 0.96 : 0.02
        };

        const newApaarNode = {
          id: apaarNodeId,
          label: `APAAR: ${data.syntheticApaarId}`,
          type: 'APAAR_ID',
          x: 480,
          y: 200,
          color: '#00E5FF',
          radius: 20,
          status: 'VERIFIED',
          apaar: data.syntheticApaarId
        };

        return [newNode, newApaarNode, ...prevNodes];
      });

      setEdges(prevEdges => {
        const studentNodeId = 's_' + Date.now();
        const apaarNodeId = 'apaar_' + Date.now();
        const targetInst = 'inst_1';

        const newLinks = [
          { from: studentNodeId, to: apaarNodeId, label: 'HAS_IDENTIFIER', color: '#00E5FF', strokeWidth: 2 },
          { from: studentNodeId, to: targetInst, label: 'ENROLLED_AT', color: '#10B981', strokeWidth: 2.5 }
        ];

        if (isCollision) {
          newLinks.push({
            from: studentNodeId,
            to: 'inst_2',
            label: 'CONCURRENT_CLAIM (Violation)',
            color: '#EF4444',
            strokeWidth: 3.5,
            dashed: true,
            pulse: true
          });
        }

        return [...newLinks, ...prevEdges];
      });
    }
  }, [activeUploadedRecord]);

  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setSelectedNode(node);
    const svgRect = svgRef.current.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - svgRect.left) / zoomLevel - node.x,
      y: (e.clientY - svgRect.top) / zoomLevel - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const currentX = (e.clientX - svgRect.left) / zoomLevel - dragOffset.x;
    const currentY = (e.clientY - svgRect.top) / zoomLevel - dragOffset.y;

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: Math.max(30, Math.min(850, currentX)), y: Math.max(30, Math.min(450, currentY)) } : n));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const filteredNodes = nodes.filter(node => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = node.label.toLowerCase().includes(q);
      const matchApaar = node.apaar && node.apaar.toLowerCase().includes(q);
      const matchCode = node.code && node.code.toLowerCase().includes(q);
      if (!matchName && !matchApaar && !matchCode) return false;
    }

    if (filterMode === 'COLLISIONS') {
      return node.status === 'FLAGGED_COLLISION' || node.id === 'inst_1' || node.id === 'inst_2' || node.type === 'APAAR_ID';
    }
    if (filterMode === 'INSTITUTIONS') {
      return node.type === 'INSTITUTION' || node.type === 'PROGRAM';
    }
    if (filterMode === 'APAAR') {
      return node.type === 'APAAR_ID' || node.type === 'STUDENT';
    }
    return true;
  });

  const activeNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredEdges = edges.filter(edge => {
    if (!activeNodeIds.has(edge.from) || !activeNodeIds.has(edge.to)) return false;
    if (filterMode === 'COLLISIONS') return edge.pulse || edge.dashed || edge.label.includes('Violation');
    return true;
  });

  const getCypherQuery = (node) => {
    if (!node) return 'MATCH (s:Student)-[r:ENROLLED_AT]->(i:Institution) RETURN s, r, i LIMIT 10;';
    if (node.type === 'STUDENT') {
      return `// Query: Resolve all institutional relationships and APAAR credentials
MATCH (s:Student {name: "${node.label}"})
MATCH (s)-[r1:HAS_IDENTIFIER]->(a:ApaarToken)
MATCH (s)-[r2:ENROLLED_AT]->(i:Institution)
OPTIONAL MATCH (s)-[r3:CONCURRENT_CLAIM]->(i2:Institution)
RETURN s, r1, a, r2, i, r3, i2;`;
    }
    if (node.type === 'INSTITUTION') {
      return `// Query: Aggregate active enrollments and detect ghost collisions
MATCH (i:Institution {code: "${node.code || node.id}"})<-[r:ENROLLED_AT]-(s:Student)
RETURN i.name, count(s) AS verifiedEnrollments,
       collect(s.syntheticApaarId) AS enrolledApaarTokens;`;
    }
    if (node.type === 'APAAR_ID') {
      return `// Query: Cross-State Multi-Institution Collision Inspection
MATCH (a:ApaarToken {apaarId: "${node.apaar || node.label}"})<-[:HAS_IDENTIFIER]-(s:Student)
MATCH (s)-[r:ENROLLED_AT]->(i:Institution)
WITH a, collect(i.name) AS colleges
WHERE size(colleges) > 1
RETURN a, colleges AS duplicateClaimViolation;`;
    }
    return `MATCH (n {id: "${node.id}"})-[r]-(m) RETURN n, r, m LIMIT 25;`;
  };

  const copyCypher = () => {
    navigator.clipboard.writeText(getCypherQuery(selectedNode));
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 1500);
  };

  const executeLiveCypher = async () => {
    const q = getCypherQuery(selectedNode);
    setExecutingQuery(true);
    try {
      const res = await graphService.executeCypherQuery(q);
      setQueryExecutionStats(res);
      if (q.includes('CONCURRENT_CLAIM') || q.includes('duplicateClaimViolation')) {
        setFilterMode('COLLISIONS');
      }
    } catch (e) {
      console.error('Error executing Cypher query against Neo4j Bolt', e);
    } finally {
      setTimeout(() => setExecutingQuery(false), 350);
    }
  };

  return (
    <div className="space-y-4 select-none animate-fade-in">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Neo4j Multi-Dimensional Knowledge Mesh
              </h3>
              <span className="text-[9px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-bold">
                CYPHER GRAPH v5.12
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Zero-trust identity graph resolving cross-institutional duplicate enrollments and ghost students
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'ALL' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Entities ({nodes.length})
          </button>
          <button
            onClick={() => setFilterMode('COLLISIONS')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'COLLISIONS' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Duplicate Collisions
          </button>
          <button
            onClick={() => setFilterMode('INSTITUTIONS')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'INSTITUTIONS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Institutions Grid
          </button>
          <button
            onClick={() => setFilterMode('APAAR')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterMode === 'APAAR' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            APAAR Id Mesh
          </button>
        </div>

        {/* Search & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graph..."
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 w-36"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); loadGraphEntities(); }}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              title="Reset Graph Layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Interactive SVG Canvas */}
        <div
          className="lg:col-span-3 rounded-2xl bg-white border-2 border-slate-200 shadow-sm relative overflow-hidden h-[490px] select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Subtle Grid Background on Pure White */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Active Collision Alert Pill */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 shadow-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span className="font-bold text-rose-950">Active Collision Detected:</span>
            <span className="text-rose-800">Concurrent Admission at Multiple Colleges</span>
          </div>

          {/* Legend Bottom Left */}
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 p-2 rounded-xl bg-white/95 border border-slate-300 text-[10px] text-slate-800 backdrop-blur-md shadow-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Institution
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Student
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> APAAR Token
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Program
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Violation Edge
            </span>
          </div>

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            viewBox="0 0 900 480"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: draggingNodeId ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Pure white SVG background */}
            <rect width="900" height="480" fill="#FFFFFF" />

            <defs>
              <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="edge-collision-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>

            {/* Edges */}
            {filteredEdges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isCollisionEdge = edge.pulse || edge.dashed;
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isCollisionEdge ? 'url(#edge-collision-grad)' : (edge.color === '#6366F1' ? '#4F46E5' : edge.color === '#00E5FF' ? '#0284C7' : edge.color)}
                    strokeWidth={isCollisionEdge ? 3.5 : 2}
                    strokeDasharray={isCollisionEdge ? '6,4' : undefined}
                    opacity={0.9}
                  />

                  {/* Edge Label Badge */}
                  <rect
                    x={midX - 45}
                    y={midY - 9}
                    width={90}
                    height={18}
                    rx={5}
                    fill="#FFFFFF"
                    stroke={isCollisionEdge ? '#DC2626' : '#94A3B8'}
                    strokeWidth={1.5}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isCollisionEdge ? '#B91C1C' : '#0F172A'}
                    fontSize="8.5"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {edge.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isCollisionNode = node.status === 'FLAGGED_COLLISION';
              const nodeFillColor = node.color === '#00E5FF' ? '#0284C7' : node.color;
              const typeBadgeColor = node.type === 'INSTITUTION' ? '#047857' :
                                     node.type === 'STUDENT' ? (isCollisionNode ? '#B91C1C' : '#6D28D9') :
                                     node.type === 'APAAR_ID' ? '#0369A1' :
                                     '#4338CA';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleMouseDown(e, node)}
                  className="cursor-pointer"
                >
                  {/* Outer Pulsing Glow on Collision or Selection */}
                  {(isCollisionNode || isSelected) && (
                    <circle
                      r={node.radius + 8}
                      fill="none"
                      stroke={isCollisionNode ? '#DC2626' : '#7C3AED'}
                      strokeWidth={2.5}
                      opacity={0.7}
                      className={isCollisionNode ? 'animate-ping' : ''}
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    r={node.radius}
                    fill={nodeFillColor}
                    stroke={isSelected ? '#7C3AED' : '#FFFFFF'}
                    strokeWidth={isSelected ? 4 : 3}
                    filter="url(#glow-node)"
                  />

                  {/* White pill background for node label for 100% clarity over edges */}
                  <rect
                    x={-60}
                    y={node.radius + 4}
                    width={120}
                    height={18}
                    rx={9}
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth={1.5}
                    className="pointer-events-none shadow-xs"
                  />
                  <text
                    y={node.radius + 16.5}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="10"
                    fontWeight="800"
                    className="select-none pointer-events-none font-sans"
                  >
                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                  </text>

                  {/* Secondary Type Pill */}
                  <rect
                    x={-42}
                    y={node.radius + 24}
                    width={84}
                    height={14}
                    rx={4}
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                    strokeWidth={1}
                    className="pointer-events-none"
                  />
                  <text
                    y={node.radius + 34}
                    textAnchor="middle"
                    fill={typeBadgeColor}
                    fontSize="8.5"
                    fontWeight="800"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    :{node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Inspector & Cypher Console */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-600" />
                Entity Inspector
              </span>
              {selectedNode && (
                <Badge variant={selectedNode.status === 'FLAGGED_COLLISION' ? 'danger' : 'purple'}>
                  {selectedNode.type}
                </Badge>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-2.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 break-words">{selectedNode.label}</h4>
                  <span className="text-[10px] font-mono text-purple-700 font-semibold">Node ID: {selectedNode.id}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                  {selectedNode.apaar && (
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">APAAR ID:</span>
                      <span className="font-mono text-purple-700 font-bold">{selectedNode.apaar}</span>
                    </div>
                  )}
                  {selectedNode.enrollmentNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Roll No:</span>
                      <span className="font-mono text-slate-900 font-bold">{selectedNode.enrollmentNumber}</span>
                    </div>
                  )}
                  {selectedNode.category && (
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Quota:</span>
                      <span className="font-mono text-slate-900 font-bold">{selectedNode.category}</span>
                    </div>
                  )}
                  {selectedNode.code && (
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Code:</span>
                      <span className="font-mono text-emerald-800 font-extrabold">{selectedNode.code}</span>
                    </div>
                  )}
                  {selectedNode.approvedIntake && (
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Intake Capacity:</span>
                      <span className="font-mono text-slate-900 font-extrabold">{selectedNode.actualEnrolment} / {selectedNode.approvedIntake}</span>
                    </div>
                  )}
                  {selectedNode.riskScore !== undefined && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-700 font-semibold">Anomaly Risk Score:</span>
                      <span className={`font-mono font-extrabold ${selectedNode.riskScore > 0.5 ? 'text-rose-700' : 'text-emerald-800'}`}>
                        {selectedNode.riskScore.toFixed(2)} / 1.00
                      </span>
                    </div>
                  )}
                </div>

                {/* Generated Cypher Query with Run & Copy */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-800">
                      Cypher Query Execution
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={executeLiveCypher}
                        disabled={executingQuery}
                        className="text-[9px] font-mono font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300"
                      >
                        <Share2 className="w-2.5 h-2.5" />
                        {executingQuery ? 'Running...' : 'Run Cypher'}
                      </button>
                      <button
                        onClick={copyCypher}
                        className="text-[9px] font-mono font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        {copiedQuery ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-[9.5px] text-slate-950 overflow-x-auto max-h-36 leading-relaxed font-bold">
{getCypherQuery(selectedNode)}
                  </pre>
                  {queryExecutionStats && (
                    <div className="mt-1 text-[9px] font-mono text-emerald-800 flex items-center justify-between font-bold">
                      <span>Matched: {queryExecutionStats.matchedFilters?.join(', ')}</span>
                      <span>Latency: {queryExecutionStats.executionTimeMs}ms (Neo4j Bolt)</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Select any node on the graph to view properties and Cypher query.</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Graph Engine: <strong className="text-purple-700 font-bold">Neo4j Bolt 7687</strong></span>
            <span>Zero-Trust Knowledge Mesh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
