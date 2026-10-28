import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  ExternalLink,
  Clock
} from 'lucide-react';
import { N8nWorkflowViewer } from '../../components/workflow/N8nWorkflowViewer';
import { workflowService } from '../../services/workflowService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const Workflows = () => {
  const [daemonStatus, setDaemonStatus] = useState(null);
  const [autoRunWorkflow, setAutoRunWorkflow] = useState(false);

  useEffect(() => {
    loadDaemonStatus();
  }, []);

  const loadDaemonStatus = async () => {
    try {
      const res = await workflowService.getStatus();
      setDaemonStatus(res);
    } catch (e) {
      console.error('Error fetching workflow daemon status', e);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in text-slate-900">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded border border-purple-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              N8N AUTONOMOUS ENGINE
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Event-Driven Zero-Trust Pipeline Grid</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            n8n Workflow Automation Engine
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Real-time visual monitoring of backend autonomous microservices orchestrated via n8n.
            Inspect node-by-node execution payloads, Private Set Intersection (PSI) identity resolution,
            neural anomaly circuit breakers, and immutable audit ledger anchoring.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAutoRunWorkflow(prev => !prev)}
            variant="primary"
            icon={Play}
            size="sm"
            className="shadow-sm"
          >
            Trigger Full Pipeline
          </Button>
          <Button
            onClick={loadDaemonStatus}
            variant="secondary"
            icon={RotateCcw}
            size="sm"
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Daemon Status</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {daemonStatus?.status || 'ONLINE'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono font-medium">
            {daemonStatus?.engine || 'n8n v1.42.0 Autonomous'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Orchestrated Workflows</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono">
            4 Production Pipelines
          </div>
          <div className="text-[10px] text-purple-700 mt-1 font-mono font-bold">
            A, B, C, D Active Nodes: 20
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Average Pipeline Latency</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-base font-bold text-cyan-800 font-mono">
            {daemonStatus?.telemetry?.averagePipelineLatency || '142ms'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            End-to-End Cryptographic Match
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Zero-Trust Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-indigo-700 font-mono">
            {daemonStatus?.telemetry?.zeroKnowledgeSuccessRate || '99.98%'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium">
            Zero PII Leakage / O(1) PSI
          </div>
        </div>
      </div>

      {/* Embedded High-Impact Workflow Viewer */}
      <N8nWorkflowViewer isAutoRunning={autoRunWorkflow} onPipelineComplete={() => setAutoRunWorkflow(false)} />
    </div>
  );
};
