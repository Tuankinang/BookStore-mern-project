const express = require("express");
const User = require("./user.model");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../orders/order.model");
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const verifyAdminToken = require("../middleware/verifyAdminToken.js");

// 1. ĐĂNG KÝ USER (Mặc định role là "user")
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    let { username } = req.body;

    if (!username) {
      username = email.split("@")[0];
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc Username đã được sử dụng!" });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Lỗi khi đăng ký user", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
});

// 2. ĐĂNG NHẬP
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
});

// 3. LẤY DANH SÁCH USER (Cho trang Admin quản lý)
router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    const usersWithOrderInfo = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ email: user.email });
        return {
          ...user.toObject(),
          hasOrders: orderCount > 0,
          totalOrders: orderCount,
        };
      })
    );

    res.status(200).json(usersWithOrderInfo);
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 4. XÓA USER
router.delete("/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 5. CẬP NHẬT PROFILE
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, photoURL, oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy User" });

    // Cập nhật thông tin thường
    if (phone) user.phone = phone;
    if (photoURL) user.photoURL = photoURL;

    // Logic đổi mật khẩu
    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mật khẩu cũ không chính xác!" });
      }
      user.password = newPassword;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Cập nhật thành công", user: userResponse });
  } catch (error) {
    console.error("Lỗi update profile:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
});

module.exports = router;
