import React, { useState } from 'react';
import { X, Lock, User, Mail, ShieldCheck, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'Student',
    department: 'Công nghệ thông tin',
  });

  if (!isOpen) return null;

  const handleQuickLogin = async (username, password) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authApi.login({ username, password });
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authApi.login(loginForm);
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authApi.register(registerForm);
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '32px' }}>
        <div className="modal-header" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck color="#6366f1" size={26} />
            <span>{isRegisterMode ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}</span>
          </h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '0.88rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Login Presets */}
        {!isRegisterMode && (
          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px dashed rgba(99, 102, 241, 0.4)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a5b4fc', marginBottom: '10px' }}>
              ⚡ NÚT ĐĂNG NHẬP NHANH TÀI KHOẢN MẪU:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', background: 'rgba(99, 102, 241, 0.2)' }}
                onClick={() => handleQuickLogin('admin', 'admin123')}
              >
                <strong>Admin (Quản trị)</strong>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', background: 'rgba(6, 182, 212, 0.2)' }}
                onClick={() => handleQuickLogin('gvcn_cntt', '123456')}
              >
                <strong>GVCN (Khoa CNTT)</strong>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', background: 'rgba(245, 158, 11, 0.2)' }}
                onClick={() => handleQuickLogin('gvbm', '123456')}
              >
                <strong>GVBM (Nhập điểm)</strong>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', background: 'rgba(16, 185, 129, 0.2)' }}
                onClick={() => handleQuickLogin('student', '123456')}
              >
                <strong>Sinh viên (Xem)</strong>
              </button>
            </div>
          </div>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Nhập tên đăng nhập (VD: admin)"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Nhập mật khẩu"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ marginTop: '24px', flexDirection: 'column', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                <LogIn size={18} />
                <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Chưa có tài khoản?{' '}
                <span
                  style={{ color: '#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
                >
                  Đăng ký ngay
                </span>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên Đăng Nhập</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="VD: gv_nguyenvanb"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Nhập mật khẩu"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="VD: Nguyễn Văn B"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vai Trò Tài Khoản</label>
                <select
                  className="form-control"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="Student">Student (Sinh viên)</option>
                  <option value="HomeroomTeacher">HomeroomTeacher (Giáo viên chủ nhiệm)</option>
                  <option value="SubjectTeacher">SubjectTeacher (Giáo viên bộ môn)</option>
                  <option value="Admin">Admin (Quản trị viên)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Khoa Phụ Trách</label>
                <select
                  className="form-control"
                  value={registerForm.department}
                  onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })}
                >
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  <option value="Kinh tế & Quản trị">Kinh tế & Quản trị</option>
                  <option value="Ngoại ngữ">Ngoại ngữ</option>
                </select>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '24px', flexDirection: 'column', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                <UserPlus size={18} />
                <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}</span>
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Đã có tài khoản?{' '}
                <span
                  style={{ color: '#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
                >
                  Quay lại đăng nhập
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
