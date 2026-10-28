import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  History,
  Award,
  Download,
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Info,
  Lock,
  Printer
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { institutionService } from '../../services/institutionService';
import { credentialService } from '../../services/credentialService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/tables/DataTable';
import { StudentHistoryModal } from './StudentHistoryModal';
import { DegreeCertificateModal } from '../../components/certificate/DegreeCertificateModal';

export const Students = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isRegistrar = user?.role === 'COLLEGE_REGISTRAR';

  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filtering state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstId, setSelectedInstId] = useState(isRegistrar ? String(user?.institutionId || 1) : '');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuota, setSelectedQuota] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCredentialFilter, setSelectedCredentialFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certificateStudent, setCertificateStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    institutionId: isRegistrar ? user?.institutionId : 1,
    syntheticApaarId: '',
    enrollmentNumber: '',
    studentName: '',
    program: 'Computer Science and Engineering',
    academicYear: '2024-2025',
    admissionYear: 2024,
    admissionCategory: 'GENERAL',
    admissionStatus: 'ADMITTED',
    gender: 'MALE',
    dob: '2003-04-15',
    isNri: false,
    isOci: false,
    isForeignNational: false,
    supernumeraryType: 'NONE',
    updateReason: ''
  });

  const [issueData, setIssueData] = useState({
    qualification: 'Bachelor of Technology in Computer Science and Engineering',
    completionYear: 2024,
    cgpaOrGrade: '8.8 CGPA'
  });

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [page, searchQuery, selectedInstId, selectedProgram, selectedCategory, selectedQuota, selectedStatus, selectedCredentialFilter]);

  const loadInstitutions = async () => {
    try {
      const data = await institutionService.getAllInstitutions();
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const credParam = selectedCredentialFilter === '' ? undefined : (selectedCredentialFilter === 'true');
      const targetInstId = isRegistrar ? user?.institutionId : (selectedInstId || undefined);

      const res = await studentService.getStudents({
        page,
        size: 10,
        query: searchQuery || undefined,
        institutionId: targetInstId,
        program: selectedProgram || undefined,
        category: selectedCategory || undefined,
        quota: selectedQuota || undefined,
        status: selectedStatus || undefined,
        credentialIssued: credParam
      });
      setStudents(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (e) {
      showToast('Failed to load student records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCertificate = (student) => {
    setCertificateStudent(student);
    setIsCertificateModalOpen(true);
  };

  const handleOpenAdd = () => {
    const defaultInst = isRegistrar ? user.institutionId : (institutions[0]?.id || 1);
    setFormData({
      institutionId: defaultInst,
      syntheticApaarId: `9082-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      enrollmentNumber: `EN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: '',
      program: 'Computer Science and Engineering',
      academicYear: '2024-2025',
      admissionYear: 2024,
      admissionCategory: 'GENERAL',
      admissionStatus: 'ADMITTED',
      gender: 'MALE',
      dob: '2003-04-15',
      isNri: false,
      isOci: false,
      isForeignNational: false,
      supernumeraryType: 'NONE',
      updateReason: ''
    });
    setIsAddModalOpen(true);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await studentService.createStudent(formData);
      showToast('Student record registered with synthetic APAAR reference', 'success');
      setIsAddModalOpen(false);
      loadStudents();
    } catch (err) {
      showToast('Error registering student record', 'error');
    }
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      studentName: student.studentName,
      program: student.program,
      academicYear: student.academicYear,
      admissionYear: student.admissionYear,
      admissionCategory: student.admissionCategory,
      admissionStatus: student.admissionStatus,
      gender: student.gender,
      updateReason: ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!formData.updateReason.trim()) {
      showToast('Mandatory update reason is required for immutable audit trail', 'warning');
      return;
    }
    try {
      await studentService.updateStudent(selectedStudent.id, formData);
      showToast('Student record updated and appended to audit log', 'success');
      setIsEditModalOpen(false);
      loadStudents();
    } catch (err) {
      showToast('Error updating student record', 'error');
    }
  };

  const handleOpenInspect = (student) => {
    setSelectedStudent(student);
    setIsInspectModalOpen(true);
  };

  const handleOpenIssue = (student) => {
    if (student.credentialIssued) {
      showToast('Credential already issued for this student', 'warning');
      return;
    }
    setSelectedStudent(student);
    setIssueData({
      qualification: `Bachelor of Technology in ${student.program}`,
      completionYear: student.admissionYear ? student.admissionYear + 4 : 2024,
      cgpaOrGrade: '8.8 CGPA'
    });
    setIsIssueModalOpen(true);
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    try {
      await credentialService.issueCredential({
        studentId: selectedStudent.id,
        studentName: selectedStudent.studentName,
        syntheticApaarId: selectedStudent.syntheticApaarId,
        ...issueData
      });
      showToast('Cryptographically signed digital credential issued successfully', 'success');
      setIsIssueModalOpen(false);
      loadStudents();
    } catch (err) {
      showToast('Error issuing digital credential', 'error');
    }
  };

  const columns = [
    {
      header: 'Synthetic APAAR ID',
      accessor: (row) => (
        <div>
          <span className="font-mono font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-[11px]">
            {row.syntheticApaarId}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{row.enrollmentNumber}</p>
        </div>
      )
    },
    {
      header: 'Student Name',
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-slate-900">{row.studentName}</p>
            {row.isNri && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                NRI
              </span>
            )}
            {row.isOci && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-50 text-cyan-900 border border-cyan-300">
                OCI
              </span>
            )}
            {row.isForeignNational && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-900 border border-blue-300">
                FN
              </span>
            )}
            {row.supernumeraryType && row.supernumeraryType !== 'NONE' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-900 border border-purple-300">
                {row.supernumeraryType}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            {row.gender} • DOB: {row.dob || '2003-04-15'} • Cat: {row.admissionCategory}
          </p>
        </div>
      )
    },
    {
      header: 'Institution',
      accessor: (row) => (
        <span className="text-slate-800 font-semibold truncate max-w-[180px] block" title={row.institutionName}>
          {row.institutionName}
        </span>
      )
    },
    {
      header: 'Program & Cohort',
      accessor: (row) => (
        <div>
          <p className="text-slate-800 font-semibold">{row.program}</p>
          <p className="text-[10px] text-slate-500 font-medium">AY: {row.academicYear} (Adm: {row.admissionYear})</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.admissionStatus === 'ADMITTED' ? 'success' : 'neutral'}>
          {row.admissionStatus}
        </Badge>
      )
    },
    {
      header: 'Credential Status',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.credentialIssued ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Issued</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Pending</span>
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row) => {
        return (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleOpenCertificate(row)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-slate-100 transition-colors"
              title="Print / View Dual-ID Degree Certificate (Requirement 10)"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenInspect(row)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-cyan-700 hover:bg-slate-100 transition-colors"
              title="Inspect Student Record"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-slate-100 transition-colors"
              title="Edit Student Record"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setSelectedStudent(row);
                setIsHistoryModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="View Change History"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenIssue(row)}
              disabled={row.credentialIssued}
              className={`p-1.5 rounded-lg transition-colors ${
                row.credentialIssued
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
              }`}
              title={row.credentialIssued ? 'Credential already issued' : 'Issue Verifiable Credential'}
            >
              <Award className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Registry</h2>
            {isRegistrar && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Lock className="w-3 h-3" /> Scoped: {user?.institutionName || 'Delhi Tech Univ'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Privacy-preserving student master records indexed by synthetic APAAR identifiers
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button onClick={handleOpenAdd} icon={Plus}>
            Register Student
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, synthetic APAAR ID, enrollment..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>

          {!isRegistrar && (
            <div>
              <select
                value={selectedInstId}
                onChange={(e) => {
                  setSelectedInstId(e.target.value);
                  setPage(0);
                }}
                className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
              >
                <option value="">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                setPage(0);
              }}
              className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
            >
              <option value="">All Programs</option>
              <option value="Computer Science and Engineering">Computer Science</option>
              <option value="Electronics and Telecommunication Engineering">Electronics & Telecom</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Artificial Intelligence & Machine Learning">AI & ML</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
            >
              <option value="">All Categories</option>
              <option value="GENERAL">General</option>
              <option value="OBC_NCL">OBC-NCL</option>
              <option value="EWS">EWS</option>
              <option value="MANAGEMENT_SUPERNUMERARY">Management Quota</option>
            </select>
          </div>

          <div>
            <select
              value={selectedQuota}
              onChange={(e) => {
                setSelectedQuota(e.target.value);
                setPage(0);
              }}
              className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
            >
              <option value="">All Quotas (NRI / OCI / FN)</option>
              <option value="NRI">NRI (Non-Resident Indian)</option>
              <option value="OCI">OCI (Overseas Citizen of India)</option>
              <option value="FOREIGN_NATIONAL">Foreign National (FN)</option>
              <option value="SUPERNUMERARY">Supernumerary (TFW / PMSSS)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCredentialFilter}
              onChange={(e) => {
                setSelectedCredentialFilter(e.target.value);
                setPage(0);
              }}
              className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-medium"
            >
              <option value="">All Credential Statuses</option>
              <option value="true">Credential Issued</option>
              <option value="false">Credential Not Issued</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Student Data Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <DataTable
          columns={columns}
          data={students}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          emptyTitle="No Student Records Found"
          emptyDescription="No student records match your query or filter criteria. Try resetting filters or register a student."
        />
      </Card>

      {/* History Modal */}
      <StudentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        student={selectedStudent}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student Record"
        subtitle="Provision an authoritative synthetic student record in the AICTE Sentinel registry"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          {!isRegistrar && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Institution</label>
              <select
                value={formData.institutionId}
                onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
                required
              >
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.name} ({i.code})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Synthetic APAAR Reference"
              value={formData.syntheticApaarId}
              onChange={(e) => setFormData({ ...formData, syntheticApaarId: e.target.value })}
              required
            />
            <Input
              label="Enrollment / Roll Number"
              value={formData.enrollmentNumber}
              onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Student Full Name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Ananya Sen"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date of Birth (DOB)"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supernumerary Seat Type</label>
              <select
                value={formData.supernumeraryType}
                onChange={(e) => setFormData({ ...formData, supernumeraryType: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="NONE">None (Regular Sanctioned)</option>
                <option value="TFW">Tuition Fee Waiver (TFW 5%)</option>
                <option value="PMSSS_JK">PMSSS (J&K and Ladakh)</option>
                <option value="GULF_PIO_OCI">Gulf Quota / PIO / OCI</option>
                <option value="FOREIGN_NATIONAL">Foreign National (FN)</option>
                <option value="DEFENSE">Defense Personnel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="Computer Science and Engineering">Computer Science & Engg</option>
                <option value="Electronics and Telecommunication Engineering">Electronics & Telecom</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Category</label>
              <select
                value={formData.admissionCategory}
                onChange={(e) => setFormData({ ...formData, admissionCategory: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="GENERAL">General</option>
                <option value="OBC_NCL">OBC-NCL</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="MANAGEMENT_SUPERNUMERARY">Management Quota</option>
              </select>
            </div>
          </div>

          {/* AICTE Quota Flags */}
          <div className="p-3 bg-[#151824] rounded-xl border border-[#1E202B] space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              AICTE Special Quota Classifications
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNri}
                  onChange={(e) => setFormData({ ...formData, isNri: e.target.checked })}
                  className="rounded border-[#1E202B] bg-[#0E1017] text-purple-600 focus:ring-0"
                />
                <span>NRI Category</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOci}
                  onChange={(e) => setFormData({ ...formData, isOci: e.target.checked })}
                  className="rounded border-[#1E202B] bg-[#0E1017] text-purple-600 focus:ring-0"
                />
                <span>OCI Status</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isForeignNational}
                  onChange={(e) => setFormData({ ...formData, isForeignNational: e.target.checked })}
                  className="rounded border-[#1E202B] bg-[#0E1017] text-purple-600 focus:ring-0"
                />
                <span>Foreign National (FN)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#1E202B]">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Register Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Record"
        subtitle={`Updating ${selectedStudent?.studentName} (${selectedStudent?.syntheticApaarId})`}
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <Input
            label="Student Full Name"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="Computer Science and Engineering">Computer Science & Engg</option>
                <option value="Electronics and Telecommunication Engineering">Electronics & Telecom</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">AI & ML</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Category</label>
              <select
                value={formData.admissionCategory}
                onChange={(e) => setFormData({ ...formData, admissionCategory: e.target.value })}
                className="w-full rounded-xl border border-[#1E202B] bg-[#151824] px-3 py-2 text-xs text-slate-200"
              >
                <option value="GENERAL">General</option>
                <option value="OBC_NCL">OBC-NCL</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="MANAGEMENT_SUPERNUMERARY">Management Quota</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mandatory Reason for Update <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={formData.updateReason}
              onChange={(e) => setFormData({ ...formData, updateReason: e.target.value })}
              placeholder="Justification for record amendment (permanently recorded to cryptographic audit log)..."
              rows={3}
              required
              className="w-full rounded-xl border border-[#1E202B] bg-[#151824] p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#1E202B]">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save & Append to Audit Trail
            </Button>
          </div>
        </form>
      </Modal>

      {/* Issue Credential Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Cryptographic Credential"
        subtitle={`Generate tamper-proof Ed25519 signed credential for ${selectedStudent?.studentName}`}
      >
        <form onSubmit={handleIssueCredential} className="space-y-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p>
              This action will sign the canonical academic claims using the institution's Ed25519 private key.
              Verifiers can authenticate this claim online or offline using public key cryptography.
            </p>
          </div>

          <Input
            label="Degree / Qualification Awarded"
            value={issueData.qualification}
            onChange={(e) => setIssueData({ ...issueData, qualification: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Completion Year"
              type="number"
              value={issueData.completionYear}
              onChange={(e) => setIssueData({ ...issueData, completionYear: parseInt(e.target.value) })}
              required
            />
            <Input
              label="CGPA / Grade"
              value={issueData.cgpaOrGrade}
              onChange={(e) => setIssueData({ ...issueData, cgpaOrGrade: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#1E202B]">
            <Button variant="secondary" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon={Award}>
              Sign & Issue Credential
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Inspection Modal */}
      <Modal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        title="Student Master Record Inspection"
        subtitle={`Authoritative cryptographic details for ${selectedStudent?.studentName || 'Student'}`}
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            {/* Top Identity Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Synthetic APAAR ID</span>
                <p className="font-mono text-base font-bold text-purple-700">{selectedStudent.syntheticApaarId}</p>
                <p className="text-[11px] text-slate-600 font-mono font-medium mt-0.5">Enrollment: {selectedStudent.enrollmentNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Admission Status</span>
                <div className="mt-1">
                  <Badge variant="success">{selectedStudent.admissionStatus}</Badge>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Student Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedStudent.studentName}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Institution</span>
                <span className="font-semibold text-slate-800">{selectedStudent.institutionName}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Department / Program</span>
                <span className="font-semibold text-slate-800">{selectedStudent.program}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Academic Year / Cohort</span>
                <span className="font-semibold text-slate-800">{selectedStudent.academicYear} (Adm: {selectedStudent.admissionYear})</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Admission Quota Category</span>
                <span className="font-bold text-purple-700 font-mono">{selectedStudent.admissionCategory}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Gender</span>
                <span className="font-semibold text-slate-800">{selectedStudent.gender || 'Not specified'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 block uppercase font-mono font-medium">Merkle State Leaf Hash</span>
                <span className="font-mono text-[10px] text-slate-600 truncate block mt-0.5">
                  {selectedStudent.hashSignature || '0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b'}
                </span>
              </div>
            </div>

            {/* AICTE Regulatory Quota & Supernumerary Profile (Requirement 2) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
                AICTE Quota & Supernumerary Profile
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">Date of Birth</span>
                  <span className="font-bold text-slate-900">{selectedStudent.dob || '2003-04-15'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">Supernumerary Type</span>
                  <span className="font-bold text-purple-700">{selectedStudent.supernumeraryType || 'NONE'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">NRI Status</span>
                  <span className={selectedStudent.isNri ? "font-bold text-amber-800" : "text-slate-600 font-medium"}>
                    {selectedStudent.isNri ? 'YES (NRI Quota)' : 'NO'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">OCI / FN Status</span>
                  <span className={(selectedStudent.isOci || selectedStudent.isForeignNational) ? "font-bold text-cyan-800" : "text-slate-600 font-medium"}>
                    {selectedStudent.isOci ? 'OCI Verified' : selectedStudent.isForeignNational ? 'Foreign National' : 'DOMESTIC'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono font-medium">Biometric Hash Proof (Zero-Knowledge Token)</span>
                <span className="font-mono text-[10px] text-slate-600 truncate block mt-0.5">
                  {selectedStudent.biometricHash || '0x88e7a021bc789012cd3456ef7890123456789012345678901234567890abcdef'}
                </span>
              </div>
            </div>

            {/* Credential Status Box */}
            <div className={`p-4 rounded-xl border ${selectedStudent.credentialIssued ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {selectedStudent.credentialIssued ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Award className="w-5 h-5 text-slate-500" />
                  )}
                  <div>
                    <span className="font-semibold text-white block">
                      {selectedStudent.credentialIssued ? 'Verifiable Credential Active' : 'No Credential Issued'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {selectedStudent.credentialIssued
                        ? `ID: ${selectedStudent.credentialId || 'VC-AICTE-2024-908231'} • Cryptographic signature active on-chain`
                        : 'Eligible for signing once official graduation terms are fulfilled.'}
                    </span>
                  </div>
                </div>
                <div>
                  <Badge variant={selectedStudent.credentialIssued ? 'success' : 'neutral'}>
                    {selectedStudent.credentialIssued ? 'ISSUED' : 'PENDING'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1E202B]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  handleOpenCertificate(selectedStudent);
                  setIsInspectModalOpen(false);
                }}
                icon={Printer}
              >
                Print Degree Certificate
              </Button>

              <Button variant="secondary" onClick={() => setIsInspectModalOpen(false)}>
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Degree Certificate Modal (Requirement 10: Dual APAAR + Student Roll ID) */}
      <DegreeCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        student={certificateStudent}
      />
    </div>
  );
};
