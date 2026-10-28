import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Shield, Clock, User, Terminal } from 'lucide-react';
import { auditService } from '../../services/auditService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/tables/DataTable';
import { TamperLedgerViewer } from '../../components/ledger/TamperLedgerViewer';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter, userFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await auditService.getAuditLogs({
        page,
        size: 15,
        action: actionFilter || undefined,
        username: userFilter || undefined
      });
      setLogs(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: (row) => (
        <div>
          <p className="font-semibold text-white font-mono text-xs">{new Date(row.timestamp).toLocaleTimeString()}</p>
          <p className="text-[10px] text-slate-400 font-mono">{new Date(row.timestamp).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      header: 'Action / Event',
      accessor: (row) => (
        <div>
          <span className="font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px]">
            {row.action}
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono font-medium">Entity: {row.entityType} ({row.entityId || 'N/A'})</p>
        </div>
      )
    },
    {
      header: 'Operator & Node',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.username}</p>
          <p className="text-[10px] text-slate-500 font-mono">IP: {row.ipAddress || '127.0.0.1'}</p>
        </div>
      )
    },
    {
      header: 'Outcome',
      accessor: (row) => (
        <Badge variant={row.outcome === 'SUCCESS' ? 'success' : row.outcome === 'WARNING' ? 'warning' : 'danger'}>
          {row.outcome}
        </Badge>
      )
    },
    {
      header: 'Audit Evidence / Rationale',
      accessor: (row) => (
        <p className="text-slate-700 max-w-sm truncate text-xs font-medium" title={row.reason}>
          {row.reason}
        </p>
      )
    },
    {
      header: 'Correlation ID',
      accessor: (row) => (
        <span className="font-mono text-[11px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">
          {row.correlationId || 'CORR-GEN'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Zero-Trust Cryptographic Audit Trail</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Tamper-evident chronological record of all administrative operations, autonomous pipeline events, and cognitive scans
        </p>
      </div>

      {/* Visual Self-Healing Cryptographic Ledger Box */}
      <TamperLedgerViewer />

      {/* Filter Bar */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          <Input
            placeholder="Filter by event name (e.g. COGNITIVE_ANALYSIS)..."
            icon={Search}
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
          />
          <Input
            placeholder="Filter by username or service..."
            icon={User}
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
          emptyTitle="No Audit Logs Found"
          emptyDescription="No events match your current filter criteria."
        />
      </Card>
    </div>
  );
};
