import React from 'react';
import { Users, Award, TrendingUp, UserCheck, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

export default function TeacherGvcnDashboard({ students = [], enrollments = [], currentUser, setActiveTab }) {
  const department = currentUser?.department || 'Công nghệ thông tin';

  // Lọc sinh viên thuộc Khoa của GVCN
  const deptStudents = students.filter(s => s.department === department);
  const studentIds = new Set(deptStudents.map(s => s.id));

  // Lọc kết quả học tập của sinh viên lớp chủ nhiệm
  const deptEnrollments = enrollments.filter(e => studentIds.has(e.studentId));

  const getGpa = (e) => {
    if (e.gpa4 !== undefined && e.gpa4 !== null) return Number(e.gpa4);
    if (e.gpA4 !== undefined && e.gpA4 !== null) return Number(e.gpA4);
    if (e.GPA4 !== undefined && e.GPA4 !== null) return Number(e.GPA4);
    return 0;
  };

  const validGpas = deptEnrollments.map(getGpa).filter(g => g > 0);
  const avgGpa = validGpas.length > 0 
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : '0.00';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner cho GVCN */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #06b6d4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={28} color="#06b6d4" />
            <span>Cổng Quản Lý Lớp Chủ Nhiệm — Khoa {department}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
            Chào mừng giảng viên <strong>{currentUser?.fullName}</strong>. Đây là bảng tổng quan sĩ số & học tập của sinh viên thuộc khoa phụ trách.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('students')}>
          Quản Lý Sinh Viên Lớp
        </button>
      </div>

      {/* Stats Cards Lớp Chủ Nhiệm */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h4>Sĩ Số Sinh Viên Khoa</h4>
            <div className="value">{deptStudents.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '4px' }}>
              Sinh viên thuộc khoa {department}
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <h4>Đang Theo Học</h4>
            <div className="value">{deptStudents.filter(s => s.status === 'Đang học').length}</div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '4px' }}>
              Trạng thái đi học bình thường
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <Award size={26} />
          </div>
          <div className="stat-info">
            <h4>GPA Trung Bình Lớp</h4>
            <div className="value">{avgGpa}</div>
            <div style={{ fontSize: '0.78rem', color: '#fde047', marginTop: '4px' }}>
              Thang điểm 4.0 trung bình
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
            <AlertCircle size={26} />
          </div>
          <div className="stat-info">
            <h4>Lượt Đăng Ký Học Phần</h4>
            <div className="value">{deptEnrollments.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '4px' }}>
              Tổng môn sinh viên lớp đăng ký
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sinh viên Lớp chủ nhiệm */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#818cf8" />
          <span>Danh Sách Sinh Viên Lớp Chủ Nhiệm ({department})</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Email / SĐT</th>
                <th>Khóa Học</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {deptStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Chưa có sinh viên nào thuộc khoa này.
                  </td>
                </tr>
              ) : (
                deptStudents.map(s => (
                  <tr key={s.id}>
                    <td><strong style={{ color: '#818cf8' }}>{s.studentCode}</strong></td>
                    <td><strong>{s.fullName}</strong></td>
                    <td>
                      <div>{s.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.phoneNumber}</div>
                    </td>
                    <td>{s.academicYear}</td>
                    <td>
                      <span className={`badge ${s.status === 'Đang học' ? 'badge-success' : 'badge-warning'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
