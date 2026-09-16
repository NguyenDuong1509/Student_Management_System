import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, X, UserCheck, ShieldCheck, Mail, Building } from 'lucide-react';
import { authApi } from '../api';

export default function TeachersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'HomeroomTeacher',
    department: 'Công nghệ thông tin',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Không thể lấy danh sách người dùng', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedUserId(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      role: 'HomeroomTeacher',
      department: 'Công nghệ thông tin',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setFormData({
      username: user.username,
      password: '', // Không bắt buộc khi sửa
      fullName: user.fullName,
      email: user.email || '',
      role: user.role || 'HomeroomTeacher',
      department: user.department || 'Công nghệ thông tin',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await authApi.updateUser(selectedUserId, formData);
      } else {
        await authApi.register(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin giáo viên!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản giáo viên/người dùng này?')) {
      try {
        await authApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Xóa tài khoản thất bại!');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      u.fullName?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term);

    const matchRole = selectedRole ? u.role === selectedRole : true;
    return matchSearch && matchRole;
  });

  const getRoleLabel = (role) => {
    switch (role) {
      case 'Admin':
        return <span className="badge badge-danger">Quản Trị Viên (Admin)</span>;
      case 'HomeroomTeacher':
        return <span className="badge badge-info">Giáo Viên Chủ Nhiệm (GVCN)</span>;
      case 'SubjectTeacher':
        return <span className="badge badge-warning">Giáo Viên Bộ Môn (GVBM)</span>;
      case 'Student':
        return <span className="badge badge-success">Sinh Viên</span>;
      default:
        return <span className="badge badge-purple">{role}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="controls-bar">
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '650px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên giảng viên, tên đăng nhập, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <select
            className="form-control"
            style={{ width: '220px' }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="HomeroomTeacher">Giáo Viên Chủ Nhiệm</option>
            <option value="SubjectTeacher">Giáo Viên Bộ Môn</option>
            <option value="Admin">Quản Trị Viên</option>
            <option value="Student">Sinh Viên</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Thêm Giáo Viên Mới</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID & Tên Đăng Nhập</th>
              <th>Họ và Tên Giảng Viên</th>
              <th>Email</th>
              <th>Vai Trò Nghiệp Vụ</th>
              <th>Khoa Phụ Trách</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Đang tải danh sách tài khoản...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Không tìm thấy tài khoản giáo viên/người dùng nào.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong style={{ color: '#818cf8' }}>#{u.id} - {u.username}</strong>
                  </td>
                  <td><strong>{u.fullName}</strong></td>
                  <td>{u.email || <span style={{ color: 'var(--text-muted)' }}>N/A</span>}</td>
                  <td>{getRoleLabel(u.role)}</td>
                  <td><span className="badge badge-info">{u.department || 'Ban BGH'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(u)} title="Chỉnh sửa tài khoản">
                        <Edit3 size={14} />
                      </button>
                      {u.username !== 'admin' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)} title="Xóa tài khoản">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Thêm/Sửa Giáo Viên */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Chỉnh Sửa Tài Khoản Giảng Viên' : 'Thêm Giảng Viên / Tài Khoản Mới'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên Đăng Nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    disabled={isEditing}
                    placeholder="VD: gv_nguyenvanb"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{isEditing ? 'Mật Khẩu Mới (Bỏ trống nếu giữ nguyên)' : 'Mật Khẩu'}</label>
                  <input
                    type="password"
                    className="form-control"
                    required={!isEditing}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Họ và Tên Giảng Viên</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="VD: ThS. Nguyễn Văn Bình"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Liên Hệ</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="binh.nguyen@studentmanager.vn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vai Trò Phân Quyền</label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="HomeroomTeacher">Giáo Viên Chủ Nhiệm (GVCN)</option>
                    <option value="SubjectTeacher">Giáo Viên Bộ Môn (GVBM)</option>
                    <option value="Admin">Quản Trị Viên (Admin)</option>
                    <option value="Student">Sinh Viên (Student)</option>
                  </select>
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
                    <option value="Ban BGH">Ban BGH / Khác</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
