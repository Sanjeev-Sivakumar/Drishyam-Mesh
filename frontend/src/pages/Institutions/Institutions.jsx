import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Users, MapPin, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { institutionService } from '../../services/institutionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';

export const Institutions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: '',
    city: '',
    approvalStatus: 'APPROVED',
    configuredIntake: 120,
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const data = await institutionService.getAllInstitutions();
      setInstitutions(data);
    } catch (e) {
      showToast('Failed to load institutions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingInst(null);
    setFormData({
      name: '',
      code: `AICTE-INST-${Math.floor(100 + Math.random() * 900)}`,
      state: '',
      city: '',
      approvalStatus: 'APPROVED',
      configuredIntake: 120,
      contactEmail: '',
      contactPhone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inst) => {
    setEditingInst(inst);
    setFormData({
      name: inst.name,
      code: inst.code,
      state: inst.state,
      city: inst.city,
      approvalStatus: inst.approvalStatus,
      configuredIntake: inst.configuredIntake,
      contactEmail: inst.contactEmail || '',
      contactPhone: inst.contactPhone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInst) {
        await institutionService.updateInstitution(editingInst.id, formData);
        showToast('Institution settings updated in national registry', 'success');
      } else {
        await institutionService.createInstitution(formData);
        showToast('New AICTE institution registered successfully', 'success');
      }
      setIsModalOpen(false);
      loadInstitutions();
    } catch (err) {
      showToast('Error saving institution configuration', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AICTE Participating Institutions</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Institutional mesh nodes, approved intake limits, and cryptographic tenant boundaries
          </p>
        </div>
        {user?.role === 'AICTE_ADMIN' && (
          <Button onClick={handleOpenAdd} icon={Plus}>
            Register Institution
          </Button>
        )}
      </div>

      {/* Grid of Institution Cards */}
      {isLoading ? (
        <LoadingSpinner message="Querying decentralized institutional nodes..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutions.map((inst) => (
            <Card key={inst.id} className="bg-white border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs font-mono">
                    {inst.code.substring(6, 9) || 'INS'}
                  </div>
                  <Badge variant={inst.approvalStatus === 'APPROVED' ? 'success' : 'neutral'}>
                    {inst.approvalStatus}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3.5 tracking-tight">{inst.name}</h3>
                <p className="text-xs font-mono font-bold text-purple-700 mt-1">{inst.code}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {inst.city}, {inst.state}
                  </p>
                  {inst.contactEmail && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {inst.contactEmail}
                    </p>
                  )}
                  {inst.contactPhone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {inst.contactPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* AICTE Sanctioned Intake & Supernumerary Quota Matrix */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Approved Intake</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{inst.approvedIntake || inst.configuredIntake} seats</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Actual Enrolment</span>
                    <span className={`text-sm font-bold font-mono ${(inst.actualEnrolment > (inst.approvedIntake || inst.configuredIntake)) ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {inst.actualEnrolment || (inst.configuredIntake - 2)} admitted
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Supernumerary (TFW)</span>
                    <span className="text-xs font-bold text-purple-700 font-mono">
                      {inst.supernumeraryEnrolled || 10} / {inst.supernumeraryQuota || 12}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">NRI / OCI / FN</span>
                    <span className="text-xs font-bold text-cyan-800 font-mono">
                      {inst.nriEnrolled || 4} NRI • {inst.ociFnEnrolled || 3} OCI
                    </span>
                  </div>
                </div>

                {inst.actualEnrolment > (inst.approvedIntake || inst.configuredIntake) && (
                  <div className="pt-2 border-t border-rose-500/20 text-[10px] text-rose-400 flex items-center justify-between font-mono">
                    <span>CIRCUIT BREAKER: INTAKE EXCEEDED</span>
                    <span className="font-bold">+{inst.actualEnrolment - (inst.approvedIntake || inst.configuredIntake)} SEATS</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E202B] flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">AICTE Reg: 2024-STD-ACT</span>
                {user?.role === 'AICTE_ADMIN' && (
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(inst)} icon={Edit2}>
                    Configure
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Institution Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInst ? 'Configure Institution & Quota' : 'Register AICTE Institution'}
        subtitle="Tenant identity, campus region, and sanctioned enrollment ceiling"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Institution Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Indian Institute of Technology Bombay"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Institution Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={!!editingInst}
            />
            <Input
              label="Sanctioned Intake Capacity"
              type="number"
              value={formData.configuredIntake}
              onChange={(e) => setFormData({ ...formData, configuredIntake: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Official Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
            <Input
              label="Helpline Phone"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Regulatory Approval Status</label>
            <select
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
              className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
            >
              <option value="APPROVED">Approved</option>
              <option value="PROVISIONAL">Provisional</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#1E202B]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingInst ? 'Save Changes' : 'Register Institution'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
