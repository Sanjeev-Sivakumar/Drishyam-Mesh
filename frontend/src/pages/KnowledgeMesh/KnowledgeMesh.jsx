import React, { useState, useEffect } from 'react';
import {
  Share2,
  Database,
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Code
} from 'lucide-react';
import { Neo4jGraphViewer } from '../../components/graph/Neo4jGraphViewer';
import { graphService } from '../../services/graphService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const KnowledgeMesh = () => {
  const [meshSummary, setMeshSummary] = useState(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      const res = await graphService.getMesh();
      if (res && res.summary) {
        setMeshSummary(res.summary);
      }
    } catch (e) {
      console.error('Error loading knowledge graph data', e);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in text-slate-900">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs mt-1">
            <img src="/AICTE.png" alt="AICTE" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded border border-sky-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-ping"></span>
                NEO4J BOLT 7687 MESH
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">AICTE Cross-Institution Resolution</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              Multi-Institution Knowledge Graph Mesh
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
              Autonomous graph-traversal engine mapping institutional entity relationships, APAAR token assignments,
              and cross-border concurrent admissions. Inspect active collision paths and execute live Cypher queries.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={loadGraphData}
            variant="secondary"
            icon={RotateCcw}
            size="sm"
          >
            Sync Live Graph
          </Button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Graph Entities</span>
            <Database className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono">
            {meshSummary?.totalNodes || 18} Nodes
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            Colleges, Programs, Students, APAAR
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Active Graph Edges</span>
            <Share2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-indigo-700 font-mono">
            {meshSummary?.totalEdges || 22} Relationships
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            ENROLLED_AT, HAS_IDENTIFIER, OFFERS
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Active Duplicate Collisions</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold text-rose-700 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            {meshSummary?.activeCollisions || 1} Flagged Violation
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            CONCURRENT_CLAIM across DTU & COEP
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Graph Traversal Engine</span>
            <Code className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-base font-bold text-cyan-800 font-mono">
            Cypher v5.12
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            Live Interactive Cypher Terminal
          </div>
        </div>
      </div>

      {/* Embedded High-Impact Neo4j Graph Viewer */}
      <Neo4jGraphViewer />
    </div>
  );
};
