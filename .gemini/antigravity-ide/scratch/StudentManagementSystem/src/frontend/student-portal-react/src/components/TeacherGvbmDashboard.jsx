import React from 'react';
import { BookOpen, Edit3, Award, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TeacherGvbmDashboard({ courses = [], enrollments = [], currentUser, setActiveTab }) {
  const department = currentUser?.department || 'Công nghệ thông tin';

  // Lọc môn học thuộc Khoa phụ trách của Giảng viên bộ môn
  const myCourses = courses.filter(c => c.department === department);
  const myCourseCodes = new Set(myCourses.map(c => c.courseCode));

  // Lọc các bài thi/đăng ký học phần chỉ thuộc môn học do GVBM đảm nhận
  const myEnrollments = enrollments.filter(e => {
    const matchedCourse = courses.find(c => c.id === e.courseId || c.courseCode === e.courseCode);
    return matchedCourse ? matchedCourse.department === department : myCourseCodes.has(e.courseCode);
  });

  // Đếm tổng số học phần đã chấm điểm vs chưa chấm điểm thuộc bộ môn
  const gradedCount = myEnrollments.filter(e => e.finalScore !== null && e.finalScore !== undefined).length;
  const pendingCount = myEnrollments.length - gradedCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner GVBM */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={28} color="#f59e0b" />
            <span>Cổng Giảng Dạy & Nhập Điểm Bộ Môn ({department})</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
            Chào mừng giảng viên <strong>{currentUser?.fullName}</strong>. Bạn có quyền cập nhật điểm thi giữa kỳ & cuối kỳ cho sinh viên học các môn thuộc <strong>Khoa {department}</strong>.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('enrollments')}>
          <Edit3 size={18} />
          <span>Nhập Điểm Thi Ngay</span>
        </button>
      </div>

      {/* Stats Cards GVBM */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <h4>Môn Học Đảm Nhận</h4>
            <div className="value">{myCourses.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#67e8f9', marginTop: '4px' }}>
              Danh mục học phần bộ môn
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <h4>Đã Hoàn Thành Nhập Điểm</h4>
            <div className="value">{gradedCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '4px' }}>
              Bài thi đã có điểm kết thúc
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
            <AlertCircle size={26} />
          </div>
          <div className="stat-info">
            <h4>Chưa Nhập Điểm</h4>
            <div className="value">{pendingCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '4px' }}>
              Cần cập nhật điểm thi
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <FileCheck size={26} />
          </div>
          <div className="stat-info">
            <h4>Tổng Bài Thi Bộ Môn</h4>
            <div className="value">{myEnrollments.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#a5b4fc', marginTop: '4px' }}>
              Lượt đăng ký môn bộ môn
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách các bài thi thuộc bộ môn cần nhập điểm */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={20} color="#f59e0b" />
          <span>Danh Sách Bài Thi & Nhập Điểm Môn Học ({department})</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sinh Viên</th>
                <th>Môn Học</th>
                <th>Giữa Kỳ (40%)</th>
                <th>Cuối Kỳ (60%)</th>
                <th>Tổng Điểm</th>
                <th>Xếp Loại</th>
              </tr>
            </thead>
            <tbody>
              {myEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Chưa có sinh viên nào đăng ký các môn học thuộc khoa {department}.
                  </td>
                </tr>
              ) : (
                myEnrollments.map(e => (
                  <tr key={e.id}>
                    <td>
                      <strong style={{ color: '#818cf8' }}>{e.studentCode}</strong>
                      <div style={{ fontSize: '0.8rem' }}>{e.studentName}</div>
                    </td>
                    <td>
                      <strong style={{ color: '#22d3ee' }}>{e.courseCode}</strong>
                      <div style={{ fontSize: '0.8rem' }}>{e.courseName}</div>
                    </td>
                    <td>{e.midtermScore !== null && e.midtermScore !== undefined ? <strong>{e.midtermScore}</strong> : <span style={{ color: '#ef4444' }}>Chưa có</span>}</td>
                    <td>{e.finalScore !== null && e.finalScore !== undefined ? <strong>{e.finalScore}</strong> : <span style={{ color: '#ef4444' }}>Chưa có</span>}</td>
                    <td><strong>{e.totalScore !== null && e.totalScore !== undefined ? e.totalScore : '-'}</strong></td>
                    <td>
                      <span className={`badge ${e.gradeLetter === 'A' ? 'badge-success' : e.gradeLetter === 'F' ? 'badge-danger' : 'badge-purple'}`}>
                        {e.gradeLetter || 'N/A'}
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
