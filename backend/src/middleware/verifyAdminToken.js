const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Truy cập bị từ chối." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Lỗi xác thực token:", err.message);
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền Admin!" });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyAdminToken;
