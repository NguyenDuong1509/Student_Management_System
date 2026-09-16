import React from 'react';
import { Award, BarChart2, CheckCircle2, AlertCircle, PieChart, Users, BookOpen } from 'lucide-react';

export default function SubjectAnalyticsTab({ courses = [], enrollments = [], currentUser }) {
  const department = currentUser?.department || 'Công nghệ thông tin';

  // Lọc môn học thuộc Khoa phụ trách
  const myCourses = courses.filter(c => c.department === department);
  const myCourseCodes = new Set(myCourses.map(c => c.courseCode));

  // Lọc các đăng ký học phần thuộc các môn bộ môn đảm nhận
  const myEnrollments = enrollments.filter(e => {
    const matchedCourse = courses.find(c => c.id === e.courseId || c.courseCode === e.courseCode);
    return matchedCourse ? matchedCourse.department === department : myCourseCodes.has(e.courseCode);
  });

  // Thống kê phân bố điểm
  const gradeDistribution = myEnrollments.reduce((acc, e) => {
    const g = e.gradeLetter || 'Chưa có';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const passedCount = myEnrollments.filter(e => e.totalScore >= 5.0).length;
  const passRate = myEnrollments.length > 0 
    ? Math.round((passedCount / myEnrollments.length) * 100)
    : 100;

  const getGpa = (e) => {
    if (e.gpa4 !== undefined && e.gpa4 !== null) return Number(e.gpa4);
    if (e.gpA4 !== undefined && e.gpA4 !== null) return Number(e.gpA4);
    return 0;
  };

  const validGpas = myEnrollments.map(getGpa).filter(g => g > 0);
  const avgGpa = validGpas.length > 0 
    ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2)
    : '0.00';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #818cf8' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart2 size={28} color="#818cf8" />
          <span>Báo Cáo & Thống Kê Phân Bố Điểm Môn Học ({department})</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Phân tích chi tiết kết quả thi, tỷ lệ đạt/trượt và chất lượng học tập của sinh viên trong các môn học phụ trách.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <h4>Tỷ Lệ Đạt Học Phần</h4>
            <div className="value">{passRate}%</div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '4px' }}>
              {passedCount} / {myEnrollments.length} bài thi từ 5.0 trở lên
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <Award size={26} />
          </div>
          <div className="stat-info">
            <h4>GPA Trung Bình Môn</h4>
            <div className="value">{avgGpa}</div>
            <div style={{ fontSize: '0.78rem', color: '#fde047', marginTop: '4px' }}>
              Thang điểm 4.0 bộ môn
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h4>Tổng Lượt Sinh Viên Thi</h4>
            <div className="value">{myEnrollments.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#67e8f9', marginTop: '4px' }}>
              Hồ sơ sinh viên đăng ký học
            </div>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ borderLeft: '4px solid #6366f1' }}>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <h4>Số Môn Phụ Trách</h4>
            <div className="value">{myCourses.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#a5b4fc', marginTop: '4px' }}>
              Học phần chuyên ngành CNTT
            </div>
          </div>
        </div>
      </div>

      {/* Grade Breakdown Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Tiến độ chấm điểm theo từng môn học */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#06b6d4" />
            <span>Tiến Độ Chấm Điểm Theo Môn Học</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {myCourses.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>Chưa có môn học phụ trách.</div>
            ) : (
              myCourses.map(c => {
                const courseEnrollments = myEnrollments.filter(e => e.courseCode === c.courseCode || e.courseId === c.id);
                const graded = courseEnrollments.filter(e => e.finalScore !== null && e.finalScore !== undefined).length;
                const total = courseEnrollments.length;
                const percent = total > 0 ? Math.round((graded / total) * 100) : 100;

                return (
                  <div key={c.id} style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ color: '#22d3ee' }}>{c.courseCode}</strong> — <span>{c.courseName}</span>
                      </div>
                      <span className="badge badge-info">{c.credits} tín chỉ</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                      <span>Đã chấm: <strong>{graded}/{total}</strong> sinh viên</span>
                      <span style={{ color: percent === 100 ? '#6ee7b7' : '#fbbf24', fontWeight: '700' }}>{percent}% Hoàn thành</span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: percent === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #6366f1)',
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

        {/* Phân bố xếp loại điểm (A, B, C, D, F) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#fbbf24" />
            <span>Phân Bố Xếp Loại Điểm Thi</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#6ee7b7' }}>Loại A (Xuất Sắc: 8.5 - 10)</div>
              <strong style={{ fontSize: '1.2rem', color: 'white' }}>{gradeDistribution['A'] || 0} sinh viên</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#a5b4fc' }}>Loại B (Giỏi/Khá: 7.0 - 8.4)</div>
              <strong style={{ fontSize: '1.2rem', color: 'white' }}>{gradeDistribution['B'] || 0} sinh viên</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#67e8f9' }}>Loại C (Trung Bình Khá: 5.5 - 6.9)</div>
              <strong style={{ fontSize: '1.2rem', color: 'white' }}>{gradeDistribution['C'] || 0} sinh viên</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#fde047' }}>Loại D (Trung Bình: 4.0 - 5.4)</div>
              <strong style={{ fontSize: '1.2rem', color: 'white' }}>{gradeDistribution['D'] || 0} sinh viên</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', color: '#fca5a5' }}>Loại F (Không Đạt: dưới 4.0)</div>
              <strong style={{ fontSize: '1.2rem', color: 'white' }}>{gradeDistribution['F'] || 0} sinh viên</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
