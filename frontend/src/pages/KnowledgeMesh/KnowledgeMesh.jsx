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
  Code,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Neo4jGraphViewer } from '../../components/graph/Neo4jGraphViewer';
import { graphService } from '../../services/graphService';
import { Card } from '../../components/ui/Card';
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

      {/* Graph Topology & Entity Visual Analytics Section */}
      <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Graph Topology & Relationship Visual Analytics
              </h3>
              <Badge variant="purple">Neo4j Cypher Traversal Metrics</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Multi-dimensional analysis of node degrees, relationship density, and cross-institutional admission collisions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
              Topology: 18 Nodes • 22 Edges
            </span>
          </div>
        </div>

        {/* 2-Column Graph Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chart 1: Relationship Type & Collision Degree (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Relationship Classification & Degree Frequency
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Traversal volume across edge types in Neo4j knowledge mesh</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                1 Flagged Collision
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'ENROLLED_AT', count: 6, isViolation: false, label: 'Confirmed Admission' },
                    { type: 'PURSUING', count: 6, isViolation: false, label: 'Active Program Degree' },
                    { type: 'HAS_IDENTIFIER', count: 6, isViolation: false, label: 'Verified APAAR Token' },
                    { type: 'OFFERS', count: 3, isViolation: false, label: 'Accredited Department' },
                    { type: 'CONCURRENT_CLAIM', count: 1, isViolation: true, label: 'Duplicate Violation' }
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="type"
                    tick={{ fontSize: 9, fill: '#64748B' }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 9, fill: '#64748B' }} domain={[0, 8]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 8, color: '#fff', fontSize: 11 }}
                    formatter={(val, name, props) => [`${val} edges`, props.payload.label]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {[
                      { color: '#10B981' },
                      { color: '#6366F1' },
                      { color: '#0284C7' },
                      { color: '#64748B' },
                      { color: '#EF4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-edge-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 font-medium gap-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed Admission (6)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pursuing Degree (6)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500"></span> APAAR Token (6)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Concurrent Collision (1)</span>
            </div>
          </div>

          {/* Chart 2: Entity Composition Donut (5 cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-cyan-600" />
                  Graph Node Entity Breakdown
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Distribution of vertices by semantic entity label</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                18 Total Nodes
              </span>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Students', value: 6, color: '#7C3AED' },
                      { name: 'APAAR Tokens', value: 6, color: '#0284C7' },
                      { name: 'Institutions', value: 3, color: '#059669' },
                      { name: 'Academic Programs', value: 3, color: '#4F46E5' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[
                      { color: '#7C3AED' },
                      { color: '#0284C7' },
                      { color: '#059669' },
                      { color: '#4F46E5' }
                    ].map((entry, index) => (
                      <Cell key={`cell-entity-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 8, color: '#fff', fontSize: 11 }}
                    formatter={(val, name) => [`${val} nodes (${Math.round(val / 18 * 100)}%)`, name]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
