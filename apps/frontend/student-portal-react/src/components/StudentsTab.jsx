import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react';
import { studentApi } from '../api';

export default function StudentsTab({ students, onRefresh, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const isStudentRole = currentUser?.role === 'Student';
  const isGvcnRole = currentUser?.role === 'HomeroomTeacher';
  const isAdminRole = currentUser?.role === 'Admin' || !currentUser;

  const userDepartment = isGvcnRole ? currentUser?.department : '';

  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '2004-01-01',
    gender: 'Nam',
    department: userDepartment || 'Công nghệ thông tin',
    academicYear: 2026,
    status: 'Đang học',
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedStudentId(null);
    setFormData({
      studentCode: `SV2026${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '2004-01-01',
      gender: 'Nam',
      department: userDepartment || 'Công nghệ thông tin',
      academicYear: 2026,
      status: 'Đang học',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setIsEditing(true);
    setSelectedStudentId(s.id);
    let dob = '2004-01-01';
    if (s.dateOfBirth) {
      dob = s.dateOfBirth.split('T')[0];
    }
    setFormData({
      studentCode: s.studentCode,
      fullName: s.fullName,
      email: s.email || '',
      phoneNumber: s.phoneNumber || '',
      dateOfBirth: dob,
      gender: s.gender || 'Nam',
      department: s.department || 'Công nghệ thông tin',
      academicYear: s.academicYear || 2026,
      status: s.status || 'Đang học',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      };

      if (isEditing) {
        await studentApi.update(selectedStudentId, { id: selectedStudentId, ...payload });
      } else {
        await studentApi.create(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin sinh viên!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này khỏi hệ thống?')) {
      try {
        await studentApi.delete(id);
        onRefresh();
      } catch (err) {
        alert('Xóa sinh viên thất bại!');
      }
    }
  };

  // Filter List
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      s.fullName?.toLowerCase().includes(term) ||
      s.studentCode?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phoneNumber?.toLowerCase().includes(term);

    // Nếu là GVCN, chỉ hiển thị sinh viên thuộc Khoa của mình
    if (isGvcnRole && currentUser?.department) {
      return matchSearch && s.department === currentUser.department;
    }

    const matchDept = selectedDepartment ? s.department === selectedDepartment : true;
    return matchSearch && matchDept;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="controls-bar">
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên, mã sinh viên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {!isGvcnRole && (
            <select
              className="form-control"
              style={{ width: '200px' }}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Tất cả khoa</option>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Kinh tế & Quản trị">Kinh tế & Quản trị</option>
              <option value="Ngoại ngữ">Ngoại ngữ</option>
            </select>
          )}
        </div>

        {!isStudentRole && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Thêm Sinh Viên Mới</span>
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Email / SĐT</th>
              <th>Khoa</th>
              <th>Khóa</th>
              <th>Trạng Thái</th>
              {!isStudentRole && <th>Thao Tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Không tìm thấy sinh viên phù hợp.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td><strong style={{ color: '#818cf8' }}>{s.studentCode}</strong></td>
                  <td><strong>{s.fullName}</strong></td>
                  <td>
                    <div>{s.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.phoneNumber}</div>
                  </td>
                  <td><span className="badge badge-info">{s.department}</span></td>
                  <td>{s.academicYear}</td>
                  <td>
                    <span className={`badge ${s.status === 'Đang học' ? 'badge-success' : s.status === 'Bảo lưu' ? 'badge-warning' : 'badge-danger'}`}>
                      {s.status}
                    </span>
                  </td>
                  {!isStudentRole && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(s)} title="Chỉnh sửa hồ sơ sinh viên">
                          <Edit3 size={14} />
                        </button>
                        {isAdminRole && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)} title="Xóa hồ sơ">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Thêm/Sửa Sinh Viên */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Chỉnh Sửa Hồ Sơ Sinh Viên' : 'Thêm Sinh Viên Mới'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Sinh Viên (MSSV)</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    disabled={isEditing}
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Liên Hệ</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="an.nguyen@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="0912345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Trạng Thái Học Tập</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Bảo lưu">Bảo lưu</option>
                    <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                    <option value="Thôi học">Thôi học</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Khoa Đào Tạo</label>
                  <select
                    className="form-control"
                    value={formData.department}
                    disabled={isGvcnRole} // Nếu là GVCN thì giữ nguyên khoa quản lý
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Kinh tế & Quản trị">Kinh tế & Quản trị</option>
                    <option value="Ngoại ngữ">Ngoại ngữ</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giới Tính</label>
                  <select
                    className="form-control"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Khóa Học</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) || 2026 })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Sinh Viên</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
