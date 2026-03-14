const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // 2. Kiểm tra password: ưu tiên bcrypt hash, fallback plain-text cho dữ liệu cũ
    const isHash = typeof user.password === "string" && user.password.startsWith("$2");
    const isValidPassword = isHash
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isValidPassword) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    // 3. Kiểm tra quyền admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập Admin" });
    }

    // 4. Tạo token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "hotel_secret_key",
      { expiresIn: "1d" }
    );

    // 5. Trả về
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        displayName: user.username, // Tạm dùng username làm display name
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
