import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, BookOpen } from 'lucide-react';
import { courseApi } from '../api';

export default function CoursesTab({ courses, onRefresh, currentUser }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const isAdminRole = currentUser?.role === 'Admin' || !currentUser;
  const isGvbmRole = currentUser?.role === 'SubjectTeacher';

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    credits: 3,
    department: currentUser?.department || 'Công nghệ thông tin',
    description: '',
  });

  // Lọc môn học theo tìm kiếm và theo Khoa đảm nhận nếu là Giáo viên bộ môn
  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode?.toLowerCase().includes(search.toLowerCase());

    if (isGvbmRole && currentUser?.department) {
      return matchSearch && c.department === currentUser.department;
    }

    return matchSearch;
  });

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseCode: course.courseCode || '',
        courseName: course.courseName || '',
        credits: course.credits || 3,
        department: course.department || 'Công nghệ thông tin',
        description: course.description || '',
      });
    } else {
      setEditingCourse(null);
      setFormData({
        courseCode: `INT100${Math.floor(1 + Math.random() * 9)}`,
        courseName: '',
        credits: 3,
        department: currentUser?.department || 'Công nghệ thông tin',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseApi.update(editingCourse.id, { ...formData, id: editingCourse.id });
      } else {
        await courseApi.create(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu môn học!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này khỏi chương trình đào tạo?')) {
      try {
        await courseApi.delete(id);
        onRefresh();
      } catch (err) {
        alert('Xóa thất bại!');
      }
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="controls-bar">
        <div className="search-box">
          <Search className="icon" size={18} />
          <input
            type="text"
            placeholder="Tìm môn học theo tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isAdminRole && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            <span>Thêm Môn Học Mới</span>
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Môn</th>
              <th>Tên Môn Học</th>
              <th>Số Tín Chỉ</th>
              <th>Khoa Phụ Trách</th>
              <th>Mô Tả Học Phần</th>
              {isAdminRole && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Không tìm thấy môn học phù hợp.
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ color: '#22d3ee' }}>{c.courseCode}</strong></td>
                  <td><strong>{c.courseName}</strong></td>
                  <td>
                    <span className="badge badge-info">{c.credits} tín chỉ</span>
                  </td>
                  <td>{c.department}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || 'N/A'}</td>
                  {isAdminRole && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(c)} title="Chỉnh sửa môn học">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)} title="Xóa môn học">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCourse ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học Mới'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Môn Học</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số Tín Chỉ</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control"
                    required
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tên Môn Học</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Khoa Phụ Trách</label>
                <select
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  <option value="Kinh tế & Quản trị">Kinh tế & Quản trị</option>
                  <option value="Ngoại ngữ">Ngoại ngữ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mô Tả Học Phần</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Môn Học</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
