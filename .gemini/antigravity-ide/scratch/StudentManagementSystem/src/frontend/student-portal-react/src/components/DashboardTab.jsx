import React from 'react';
import { Users, BookOpen, FileCheck, Award, TrendingUp, PieChart, Star, UserPlus, PlusCircle, Clock, UserCheck } from 'lucide-react';

export default function DashboardTab({ students = [], courses = [], enrollments = [], setActiveTab }) {
  const getGpa = (e) => {
    if (e.gpa4 !== undefined && e.gpa4 !== null) return Number(e.gpa4);
    if (e.gpA4 !== undefined && e.gpA4 !== null) return Number(e.gpA4);
    if (e.GPA4 !== undefined && e.GPA4 !== null) return Number(e.GPA4);
    return 0;
  };

  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;

  const validGpas = enrollments.map(getGpa).filter(g => g > 0);
  const avgGpa = validGpas.length > 0 
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : '0.00';

  // Thống kê theo Khoa
  const deptCounts = students.reduce((acc, s) => {
    const d = s.department || 'Khác';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  // Thống kê theo Điểm chữ
  const gradeCounts = enrollments.reduce((acc, e) => {
    const g = e.gradeLetter || 'Chưa nhập';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  // 5 Đăng ký học phần mới nhất
  const recentEnrollments = [...enrollments].reverse().slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stat Cards Overview */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h4>Tổng Sinh Viên</h4>
            <div className="value">{totalStudents}</div>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> Hồ sơ sinh viên hoạt động
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <h4>Tổng Môn Học</h4>
            <div className="value">{totalCourses}</div>
            <div style={{ fontSize: '0.78rem', color: '#67e8f9', marginTop: '4px' }}>
              {courses.reduce((sum, c) => sum + (c.credits || 3), 0)} Tín chỉ chương trình
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <FileCheck size={26} />
          </div>
          <div className="stat-info">
            <h4>Đăng Ký Học Phần</h4>
            <div className="value">{totalEnrollments}</div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '4px' }}>
              Lượt đăng ký học kỳ
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <Award size={26} />
          </div>
          <div className="stat-info">
            <h4>GPA Trung Bình toàn trường</h4>
            <div className="value">{avgGpa}</div>
            <div style={{ fontSize: '0.78rem', color: '#fde047', marginTop: '4px' }}>
              Thang điểm 4.0
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section: Department Breakdown & Grade Standings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Phân bố sinh viên theo Khoa */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#818cf8" />
            <span>Phân Bố Sinh Viên Theo Khoa</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(deptCounts).length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu khoa.</div>
            ) : (
              Object.entries(deptCounts).map(([dept, count]) => {
                const percent = Math.round((count / totalStudents) * 100) || 0;
                return (
                  <div key={dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span><strong>{dept}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} sinh viên ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Phân bố kết quả học tập (Xếp loại điểm) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="#fbbf24" />
            <span>Thống Kê Xếp Loại Học Lực</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: '600' }}>HỌC LỰC XUẤT SẮC (A)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>
                {gradeCounts['A'] || 0}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: '600' }}>HỌC LỰC GIỎI / KHÁ (B/C)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>
                {(gradeCounts['B'] || 0) + (gradeCounts['C'] || 0)}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: '600' }}>TRUNG BÌNH / YẾU (D/F)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>
                {(gradeCounts['D'] || 0) + (gradeCounts['F'] || 0)}
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(148, 163, 184, 0.12)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>CHƯA CÓ ĐIỂM</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>
                {gradeCounts['Chưa nhập'] || gradeCounts['N/A'] || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Registrations Table & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#06b6d4" />
              <span>Đăng Ký & Học Phần Gần Đây</span>
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('enrollments')}>
              Xem tất cả
            </button>
          </div>

          <div className="table-container">
            <table className="data-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Sinh Viên</th>
                  <th>Môn Học</th>
                  <th>Học Kỳ</th>
                  <th>Tổng Điểm</th>
                  <th>Xếp Loại</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                      Chưa có đăng ký học phần nào.
                    </td>
                  </tr>
                ) : (
                  recentEnrollments.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <strong style={{ color: '#818cf8' }}>{e.studentCode}</strong>
                        <div style={{ fontSize: '0.8rem' }}>{e.studentName}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#22d3ee' }}>{e.courseCode}</strong>
                        <div style={{ fontSize: '0.8rem' }}>{e.courseName}</div>
                      </td>
                      <td><span className="badge badge-info">{e.semester}</span></td>
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

        {/* Quick Management Shortcuts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#22d3ee" />
            <span>Thao Tác Quản Lý</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('teachers')}>
              <UserCheck size={16} />
              <span>+ Thêm Giáo Viên Mới</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('students')}>
              <UserPlus size={16} />
              <span>+ Thêm Sinh Viên Mới</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('courses')}>
              <PlusCircle size={16} />
              <span>+ Thêm Môn Học Mới</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('enrollments')}>
              <FileCheck size={16} />
              <span>+ Đăng Ký & Nhập Điểm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
