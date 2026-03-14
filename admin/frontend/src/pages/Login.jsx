import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    try {
      // login trả về { ok: true/false, message: "" }
      const res = await login(username, password);

      if (!res.ok) {
        setErr(res.message || "Đăng nhập thất bại");
        return;
      }

      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card premium animated-card">

        <h1 className="login-heading">HOTEL ADMIN PANEL</h1>
        <p className="login-title">Đăng nhập hệ thống</p>

        <form onSubmit={handle} style={{ marginTop: 20 }}>

          {/* USERNAME */}
          <div className="v3-field">
            <input
              name="username"
              className="v3-input"
              placeholder=" "
              required
            />
            <label className="v3-label">Tài khoản</label>
          </div>

          {/* PASSWORD */}
          <div className="v3-field" style={{ marginTop: 18 }}>
            <input
              name="password"
              type="password"
              className="v3-input"
              placeholder=" "
              required
            />
            <label className="v3-label">Mật khẩu</label>
          </div>

          {err && <div className="err">{err}</div>}

          <button className="btn-primary" disabled={loading} style={{ marginTop: 22 }}>
            {loading ? "Đang xử lý…" : "Đăng nhập"}
          </button>

        </form>
      </div>
    </div>
  );
}
