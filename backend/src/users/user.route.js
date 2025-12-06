const express = require("express");
const User = require("./user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../orders/order.model");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// 1. ĐĂNG KÝ USER (Mặc định role là "user")
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User đã tồn tại" });
        }

        const newUser = new User({
            username, 
            email,    
            password,
            role: "user" // <--- Dòng này quyết định đây là tài khoản thường
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        console.error("Lỗi khi đăng ký user", error);
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
});

// --- API ĐĂNG NHẬP ADMIN ---
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username });
    if (!admin) {
      res.status(404).send({ message: "Không tìm thấy Admin!" });
    }
    if (admin.password !== password) {
      return res.status(401).send({ message: "Mật khẩu không hợp lệ!" });
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role }, //https://www.npmjs.com/package/jsonwebtoken?activeTab=readme
      JWT_SECRET, //require('crypto').randomBytes(32).toString('hex')
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Xác thực thành công",
      token: token,
      username: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("không thể đăng nhập với tư cách Admin", error);
    res.status(401).json({ message: "không thể đăng nhập với tư cách Admin" });
  }
});

// 3. LẤY DANH SÁCH USER (Cho trang Admin quản lý)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const usersWithOrderInfo = await Promise.all(
      users.map(async (user) => {
        try {
            const orderCount = await Order.countDocuments({ email: user.username });
            return { ...user.toObject(), hasOrders: orderCount > 0, totalOrders: orderCount };
        } catch (err) {
            return { ...user.toObject(), hasOrders: false, totalOrders: 0 };
        }
      })
    );
    res.status(200).json(usersWithOrderInfo);
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 4. XÓA USER
router.delete("/:id", async (req, res) => {
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

module.exports = router;
