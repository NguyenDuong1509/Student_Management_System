import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import TeacherGvcnDashboard from './components/TeacherGvcnDashboard';
import TeacherGvbmDashboard from './components/TeacherGvbmDashboard';
import StudentPortalDashboard from './components/StudentPortalDashboard';
import SubjectAnalyticsTab from './components/SubjectAnalyticsTab';
import TeachersTab from './components/TeachersTab';
import StudentsTab from './components/StudentsTab';
import CoursesTab from './components/CoursesTab';
import EnrollmentsTab from './components/EnrollmentsTab';
import AuthModal from './components/AuthModal';
import { studentApi, courseApi, enrollmentApi } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGatewayOffline, setIsGatewayOffline] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Restore user session from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setActiveTab('dashboard');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStudents, resCourses, resEnrollments] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        enrollmentApi.getAll(),
      ]);
      setStudents(resStudents.data);
      setCourses(resCourses.data);
      setEnrollments(resEnrollments.data);
      setIsGatewayOffline(false);
    } catch (err) {
      console.warn('API Gateway offline. Using initial preview data.');
      setIsGatewayOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const role = currentUser?.role || 'Admin';

  const renderDashboardByRole = () => {
    switch (role) {
      case 'HomeroomTeacher':
        return (
          <TeacherGvcnDashboard
            students={students}
            enrollments={enrollments}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
          />
        );
      case 'SubjectTeacher':
        return (
          <TeacherGvbmDashboard
            courses={courses}
            enrollments={enrollments}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
          />
        );
      case 'Student':
        return (
          <StudentPortalDashboard
            courses={courses}
            enrollments={enrollments}
            currentUser={currentUser}
            onRefresh={fetchData}
          />
        );
      case 'Admin':
      default:
        return (
          <DashboardTab
            students={students}
            courses={courses}
            enrollments={enrollments}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {isGatewayOffline && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fde047',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '0.88rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            ⚠️ <strong>Thông báo API Gateway:</strong> Đang chạy giao diện xem trước. Hãy bật các dịch vụ .NET (Port 5000) để kết nối trực tiếp PostgreSQL.
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchData}>
            Kết nối lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu từ Microservices...</div>
      ) : (
        <main>
          {activeTab === 'dashboard' && renderDashboardByRole()}

          {activeTab === 'teachers' && (
            <TeachersTab />
          )}

          {activeTab === 'analytics' && (
            <SubjectAnalyticsTab
              courses={courses}
              enrollments={enrollments}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'students' && (
            <StudentsTab
              students={students}
              onRefresh={fetchData}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab
              courses={courses}
              onRefresh={fetchData}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'enrollments' && (
            <EnrollmentsTab
              enrollments={enrollments}
              students={students}
              courses={courses}
              onRefresh={fetchData}
              currentUser={currentUser}
            />
          )}
        </main>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
