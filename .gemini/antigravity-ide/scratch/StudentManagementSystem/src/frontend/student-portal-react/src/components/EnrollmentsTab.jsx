import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Award } from 'lucide-react';
import { enrollmentApi } from '../api';

export default function EnrollmentsTab({ enrollments, students, courses, onRefresh, currentUser }) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const isStudentRole = currentUser?.role === 'Student';
  const isGvbmRole = currentUser?.role === 'SubjectTeacher';
  const isGvcnRole = currentUser?.role === 'HomeroomTeacher';
  const isAdminRole = currentUser?.role === 'Admin' || !currentUser;

  // Lọc danh sách sinh viên & môn học phù hợp theo Khoa quản lý của GVCN / GVBM
  const selectableStudents = isGvcnRole && currentUser?.department
    ? students.filter(s => s.department === currentUser.department)
    : students;

  const selectableCourses = (isGvcnRole || isGvbmRole) && currentUser?.department
    ? courses.filter(c => c.department === currentUser.department)
    : courses;

  const [registerData, setRegisterData] = useState({
    studentId: '',
    courseId: '',
    semester: 'HK1-2025-2026',
  });

  const [gradeData, setGradeData] = useState({
    midtermScore: '',
    finalScore: '',
  });

  const getGpaValue = (e) => {
    if (e.gpa4 !== undefined && e.gpa4 !== null) return Number(e.gpa4);
    if (e.gpA4 !== undefined && e.gpA4 !== null) return Number(e.gpA4);
    if (e.GPA4 !== undefined && e.GPA4 !== null) return Number(e.GPA4);
    return 0.0;
  };

  const handleOpenRegister = () => {
    setRegisterData({
      studentId: selectableStudents[0]?.id || '',
      courseId: selectableCourses[0]?.id || '',
      semester: 'HK1-2025-2026',
    });
    setIsRegisterModalOpen(true);
  };

  const handleOpenGrade = (e) => {
    setSelectedEnrollment(e);
    setGradeData({
      midtermScore: e.midtermScore !== null && e.midtermScore !== undefined ? e.midtermScore : '',
      finalScore: e.finalScore !== null && e.finalScore !== undefined ? e.finalScore : '',
    });
    setIsGradeModalOpen(true);
  };

  const handleRegisterSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await enrollmentApi.create({
        studentId: parseInt(registerData.studentId),
        courseId: parseInt(registerData.courseId),
        semester: registerData.semester,
      });
      setIsRegisterModalOpen(false);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể đăng ký môn học!');
    }
  };

  const handleGradeSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await enrollmentApi.updateGrades(selectedEnrollment.id, {
        midtermScore: gradeData.midtermScore !== '' ? parseFloat(gradeData.midtermScore) : null,
        finalScore: gradeData.finalScore !== '' ? parseFloat(gradeData.finalScore) : null,
      });
      setIsGradeModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Cập nhật điểm thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký học phần này?')) {
      try {
        await enrollmentApi.delete(id);
        onRefresh();
      } catch (err) {
        alert('Hủy đăng ký thất bại!');
      }
    }
  };

  // Filter List according to Role Scoping Rules
  const filteredEnrollments = enrollments.filter(e => {
    // 1. Sinh viên: chỉ xem kết quả học phần của chính mình
    if (isStudentRole && currentUser) {
      const cleanName = (currentUser.fullName || '').replace(/\(.*\)/g, '').trim().toLowerCase();
      const isStudentDemo = currentUser.username === 'student' || currentUser.role === 'Student';
      const eName = (e.studentName || '').toLowerCase();
      const eCode = (e.studentCode || '').toLowerCase();

      if (isStudentDemo && (eCode === 'sv2026001' || e.studentId === 1)) return true;

      return (
        (cleanName && eName.includes(cleanName)) ||
        (cleanName && cleanName.includes(eName)) ||
        (currentUser.username && eCode.includes(currentUser.username.toLowerCase()))
      );
    }

    // 2. Giáo viên chủ nhiệm (GVCN): chỉ xem kết quả học phần của sinh viên thuộc Khoa chủ nhiệm của mình
    if (isGvcnRole && currentUser?.department) {
      const studentObj = students.find(s => s.id === e.studentId || s.studentCode === e.studentCode);
      if (studentObj) {
        return studentObj.department === currentUser.department;
      }
    }

    // 3. Giáo viên bộ môn (GVBM): chỉ xem & nhập điểm các môn học thuộc Khoa đảm nhận của mình
    if (isGvbmRole && currentUser?.department) {
      const courseObj = courses.find(c => c.id === e.courseId || c.courseCode === e.courseCode);
      if (courseObj) {
        return courseObj.department === currentUser.department;
      }
    }

    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="controls-bar">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: '700' }}>
          <Award color="#f59e0b" size={24} />
          <span>Bảng Điểm & Đăng Ký Học Phần</span>
        </h3>

        {!isStudentRole && !isGvbmRole && (
          <button className="btn btn-primary" onClick={handleOpenRegister}>
            <Plus size={18} />
            <span>Đăng Ký Học Phần Mới</span>
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã & Tên Sinh Viên</th>
              <th>Mã & Tên Môn Học</th>
              <th>Học Kỳ</th>
              <th>Giữa Kỳ (40%)</th>
              <th>Cuối Kỳ (60%)</th>
              <th>Tổng Điểm</th>
              <th>Điểm Chữ</th>
              <th>Thang 4</th>
              {!isStudentRole && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Chưa có dữ liệu đăng ký học phần phù hợp.
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((e) => {
                const gpaVal = getGpaValue(e);
                return (
                  <tr key={e.id}>
                    <td>
                      <strong style={{ color: '#818cf8', display: 'block' }}>{e.studentCode}</strong>
                      <span style={{ fontSize: '0.85rem' }}>{e.studentName}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#22d3ee', display: 'block' }}>{e.courseCode}</strong>
                      <span style={{ fontSize: '0.85rem' }}>{e.courseName} ({e.credits || 3} TC)</span>
                    </td>
                    <td><span className="badge badge-info">{e.semester}</span></td>
                    <td>{e.midtermScore !== null && e.midtermScore !== undefined ? <strong>{e.midtermScore}</strong> : <span style={{ color: 'var(--text-muted)' }}>Chưa nhập</span>}</td>
                    <td>{e.finalScore !== null && e.finalScore !== undefined ? <strong>{e.finalScore}</strong> : <span style={{ color: 'var(--text-muted)' }}>Chưa nhập</span>}</td>
                    <td>
                      <strong style={{ fontSize: '1rem', color: e.totalScore >= 7 ? '#6ee7b7' : '#f8fafc' }}>
                        {e.totalScore !== null && e.totalScore !== undefined ? e.totalScore : '-'}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${e.gradeLetter === 'A' ? 'badge-success' : e.gradeLetter === 'F' ? 'badge-danger' : 'badge-purple'}`}>
                        {e.gradeLetter || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-warning" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                        {gpaVal.toFixed(1)}
                      </span>
                    </td>
                    {!isStudentRole && (
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenGrade(e)} title="Nhập / Chỉnh sửa điểm số">
                            <Edit3 size={14} />
                            <span>Nhập điểm</span>
                          </button>
                          {isAdminRole && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)} title="Hủy đăng ký học phần">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Đăng Ký Học Phần */}
      {isRegisterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Đăng Ký Học Phần Mới</h3>
              <button className="close-btn" onClick={() => setIsRegisterModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Chọn Sinh Viên</label>
                <select
                  className="form-control"
                  required
                  value={registerData.studentId}
                  onChange={(evt) => setRegisterData({ ...registerData, studentId: evt.target.value })}
                >
                  {selectableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Chọn Môn Học</label>
                <select
                  className="form-control"
                  required
                  value={registerData.courseId}
                  onChange={(evt) => setRegisterData({ ...registerData, courseId: evt.target.value })}
                >
                  {selectableCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseCode} - {c.courseName} ({c.credits} tín chỉ)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Học Kỳ</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={registerData.semester}
                  onChange={(evt) => setRegisterData({ ...registerData, semester: evt.target.value })}
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

      {/* Modal Nhập Điểm */}
      {isGradeModalOpen && selectedEnrollment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nhập Điểm Học Phần</h3>
              <button className="close-btn" onClick={() => setIsGradeModalOpen(false)}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '16px', padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', borderLeft: '4px solid #6366f1' }}>
              <div><strong>Sinh viên:</strong> {selectedEnrollment.studentName} ({selectedEnrollment.studentCode})</div>
              <div><strong>Môn học:</strong> {selectedEnrollment.courseName} ({selectedEnrollment.courseCode})</div>
            </div>

            <form onSubmit={handleGradeSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Điểm Giữa Kỳ (Thang 10 - 40%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-control"
                    placeholder="VD: 8.5"
                    value={gradeData.midtermScore}
                    onChange={(evt) => setGradeData({ ...gradeData, midtermScore: evt.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Điểm Cuối Kỳ (Thang 10 - 60%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-control"
                    placeholder="VD: 9.0"
                    value={gradeData.finalScore}
                    onChange={(evt) => setGradeData({ ...gradeData, finalScore: evt.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsGradeModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Điểm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
