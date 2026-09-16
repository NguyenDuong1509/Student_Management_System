import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, FileCheck, CheckCircle2, Plus, X, ShieldCheck } from 'lucide-react';
import { enrollmentApi } from '../api';

export default function StudentPortalDashboard({ courses = [], enrollments = [], currentUser, onRefresh }) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [semester, setSemester] = useState('HK1-2025-2026');

  const studentName = currentUser?.fullName || 'Nguyen Van An';
  const studentCode = currentUser?.username?.toUpperCase() || 'SV2026001';
  const department = currentUser?.department || 'Công nghệ thông tin';

  // Sửa logic khớp thông tin Sinh viên mẫu và Sinh viên đăng nhập
  const cleanName = (currentUser?.fullName || '').replace(/\(.*\)/g, '').trim().toLowerCase();
  const isStudentDemo = currentUser?.username === 'student' || currentUser?.role === 'Student';

  const myEnrollments = enrollments.filter(e => {
    if (!currentUser) return true;
    const eName = (e.studentName || '').toLowerCase();
    const eCode = (e.studentCode || '').toLowerCase();

    if (isStudentDemo && (eCode === 'sv2026001' || e.studentId === 1)) return true;

    return (
      (cleanName && eName.includes(cleanName)) ||
      (cleanName && cleanName.includes(eName)) ||
      (currentUser.username && eCode.includes(currentUser.username.toLowerCase()))
    );
  });

  const getGpa = (e) => {
    if (e.gpa4 !== undefined && e.gpa4 !== null) return Number(e.gpa4);
    if (e.gpA4 !== undefined && e.gpA4 !== null) return Number(e.gpA4);
    if (e.GPA4 !== undefined && e.GPA4 !== null) return Number(e.GPA4);
    return 0;
  };

  const validGpas = myEnrollments.map(getGpa).filter(g => g > 0);
  const myGpa = validGpas.length > 0 
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : '4.00';

  const totalCredits = myEnrollments.reduce((sum, e) => sum + (e.credits || 3), 0);
  const graduationCredits = 120; // Tổng tín chỉ tốt nghiệp chuẩn
  const graduationProgress = Math.round((totalCredits / graduationCredits) * 100);

  // Danh mục môn học thuộc Khoa sinh viên theo học
  const deptCourses = courses.filter(c => c.department === department);

  const handleOpenRegister = () => {
    if (deptCourses.length > 0) {
      setSelectedCourseId(deptCourses[0].id);
    }
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await enrollmentApi.create({
        studentId: 1, // Student 1 (Nguyen Van An)
        courseId: parseInt(selectedCourseId),
        semester: semester,
      });
      setIsRegisterModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể đăng ký môn học!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner & Lộ Trình Đào Tạo Tốt Nghiệp */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, paddingRight: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={28} color="#6366f1" />
            <span>Cổng Thông Tin Học Tập Sinh Viên — Khoa {department}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
            Lộ trình học tập & đăng ký các môn học bắt buộc theo chương trình đào tạo để đủ điều kiện xét tốt nghiệp.
          </p>

          {/* Progress Bar Tín chỉ tốt nghiệp */}
          <div style={{ marginTop: '16px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span>Tiến độ tích lũy tín chỉ tốt nghiệp: <strong>{totalCredits} / {graduationCredits} Tín chỉ</strong></span>
              <span style={{ color: '#6ee7b7', fontWeight: '700' }}>{graduationProgress}% Hoàn thành</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${graduationProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleOpenRegister} style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
          <Plus size={18} />
          <span>Đăng Ký Môn Học Mới</span>
        </button>
      </div>

      {/* Digital Student Card & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Thẻ Sinh Viên Điện Tử */}
        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.08 }}>
            <GraduationCap size={180} color="#818cf8" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '12px', color: 'white' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a5b4fc', fontWeight: '700' }}>
                THẺ SINH VIÊN ĐIỆN TỬ
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'white' }}>Student Manager System</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>HỌ VÀ TÊN SINH VIÊN</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#6ee7b7' }}>{studentName}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>MÃ SINH VIÊN (MSSV)</span>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#818cf8' }}>{studentCode}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>KHOA ĐÀO TẠO</span>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#22d3ee' }}>{department}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Đang học chính quy
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khóa học: 2026</span>
          </div>
        </div>

        {/* Thống kê chỉ số cá nhân */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#fde047', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={20} /> GPA TÍCH LŨY CÁ NHÂN
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: '900', color: 'white', marginTop: '8px' }}>
              {myGpa} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ 4.0</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6ee7b7', marginTop: '6px' }}>
              Thành tích học tập cá nhân
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #06b6d4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#67e8f9', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={20} /> TÍN CHỈ ĐÃ TÍCH LŨY
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: '900', color: 'white', marginTop: '8px' }}>
              {totalCredits} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>Tín chỉ</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '6px' }}>
              {myEnrollments.length} Môn học đã đăng ký
            </div>
          </div>
        </div>
      </div>

      {/* Danh Sách Môn Học Chương Trình Đào Tạo Theo Khoa */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="#22d3ee" />
          <span>Danh Mục Môn Học Theo Lộ Trình Đào Tạo (Khoa {department})</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Môn</th>
                <th>Tên Học Phần</th>
                <th>Số Tín Chỉ</th>
                <th>Mô Tả Học Phần</th>
                <th>Trạng Thái Đăng Ký</th>
              </tr>
            </thead>
            <tbody>
              {deptCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Chưa có danh mục môn học thuộc khoa này.
                  </td>
                </tr>
              ) : (
                deptCourses.map(c => {
                  const registered = myEnrollments.some(e => e.courseCode === c.courseCode || e.courseId === c.id);
                  return (
                    <tr key={c.id}>
                      <td><strong style={{ color: '#22d3ee' }}>{c.courseCode}</strong></td>
                      <td><strong>{c.courseName}</strong></td>
                      <td><span className="badge badge-info">{c.credits} tín chỉ</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || 'Chương trình đào tạo bắt buộc'}</td>
                      <td>
                        {registered ? (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Đã Đăng Ký
                          </span>
                        ) : (
                          <span className="badge badge-warning">Chưa đăng ký</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kết Quả Bảng Điểm Học Phần Cá Nhân */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck size={20} color="#818cf8" />
          <span>Bảng Điểm & Kết Quả Học Phần Cá Nhân</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Môn Học</th>
                <th>Tên Học Phần</th>
                <th>Tín Chỉ</th>
                <th>Học Kỳ</th>
                <th>Điểm Giữa Kỳ (40%)</th>
                <th>Điểm Cuối Kỳ (60%)</th>
                <th>Điểm Tổng Kết</th>
                <th>Điểm Chữ</th>
                <th>Thang 4.0</th>
              </tr>
            </thead>
            <tbody>
              {myEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Bạn chưa đăng ký môn học nào.
                  </td>
                </tr>
              ) : (
                myEnrollments.map(e => {
                  const gpaVal = getGpa(e);
                  return (
                    <tr key={e.id}>
                      <td><strong style={{ color: '#22d3ee' }}>{e.courseCode}</strong></td>
                      <td><strong>{e.courseName}</strong></td>
                      <td>{e.credits || 3} TC</td>
                      <td><span className="badge badge-info">{e.semester}</span></td>
                      <td>{e.midtermScore !== null && e.midtermScore !== undefined ? <strong>{e.midtermScore}</strong> : '-'}</td>
                      <td>{e.finalScore !== null && e.finalScore !== undefined ? <strong>{e.finalScore}</strong> : '-'}</td>
                      <td>
                        <strong style={{ color: e.totalScore >= 7 ? '#6ee7b7' : '#f8fafc', fontSize: '1.05rem' }}>
                          {e.totalScore !== null && e.totalScore !== undefined ? e.totalScore : '-'}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${e.gradeLetter === 'A' ? 'badge-success' : 'badge-purple'}`}>
                          {e.gradeLetter || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning" style={{ fontWeight: '800' }}>
                          {gpaVal.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Sinh Viên Đăng Ký Học Phần */}
      {isRegisterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Đăng Ký Môn Học Mới (Khoa {department})</h3>
              <button className="close-btn" onClick={() => setIsRegisterModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Sinh Viên Đăng Ký</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={`${studentCode} - ${studentName} (${department})`}
                />
              </div>

              <div className="form-group">
                <label>Chọn Môn Học Đào Tạo (Khoa {department})</label>
                <select
                  className="form-control"
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  {deptCourses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.courseCode} - {c.courseName} ({c.credits} tín chỉ)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Học Kỳ Đăng Ký</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsRegisterModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Đăng Ký</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
