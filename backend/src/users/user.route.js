const express = require("express");
const User = require("./user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

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

module.exports = router;
