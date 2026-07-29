import React from 'react';
import { GraduationCap, LayoutDashboard, Users, BookOpen, FileCheck, LogIn, LogOut, UserCheck, Award, BarChart2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal, onLogout }) {
  const role = currentUser?.role || 'Admin';

  const getRoleBadge = (r) => {
    switch (r) {
      case 'Admin':
        return <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>Admin</span>;
      case 'HomeroomTeacher':
        return <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>GVCN</span>;
      case 'SubjectTeacher':
        return <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>GVBM</span>;
      case 'Student':
        return <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Sinh viên</span>;
      default:
        return <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{r || 'Khách'}</span>;
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={26} />
        </div>
        <div>
          <h1 className="brand-title">Student Manager</h1>
          <p className="brand-subtitle">Hệ Thống Quản Lý Sinh Viên & Học Phần</p>
        </div>
      </div>

      {/* Dynamic Nav Tabs based on Role */}
      <div className="nav-tabs">
        {/* Admin Tabs */}
        {role === 'Admin' && (
          <>
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <UserCheck size={18} />
              <span>Quản Lý Giáo Viên</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={18} />
              <span>Sinh Viên</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={18} />
              <span>Môn Học</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrollments')}
            >
              <FileCheck size={18} />
              <span>Đăng Ký & Điểm Số</span>
            </button>
          </>
        )}

        {/* Homeroom Teacher (GVCN) Tabs */}
        {role === 'HomeroomTeacher' && (
          <>
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Tổng Quan Lớp Chủ Nhiệm</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={18} />
              <span>Danh Sách Sinh Viên Lớp</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrollments')}
            >
              <FileCheck size={18} />
              <span>Bảng Điểm Lớp</span>
            </button>
          </>
        )}

        {/* Subject Teacher (GVBM) Tabs */}
        {role === 'SubjectTeacher' && (
          <>
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Tổng Quan Giảng Dạy</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrollments')}
            >
              <Award size={18} />
              <span>Nhập Điểm Môn Học</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart2 size={18} />
              <span>Báo Cáo & Thống Kê Môn</span>
            </button>
          </>
        )}

        {/* Student Tabs */}
        {role === 'Student' && (
          <>
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <GraduationCap size={18} />
              <span>Trang Cá Nhân & GPA</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrollments')}
            >
              <FileCheck size={18} />
              <span>Bảng Điểm Học Phần</span>
            </button>
          </>
        )}
      </div>

      {/* Profile & Auth Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.75)',
            padding: '6px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#f8fafc', lineHeight: '1.2' }}>
                {currentUser.fullName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                {getRoleBadge(currentUser.role)}
                {currentUser.department && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
                    ({currentUser.department})
                  </span>
                )}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Đăng xuất khỏi hệ thống" style={{ padding: '6px 10px' }}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuthModal}>
            <LogIn size={18} />
            <span>Đăng Nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
}
