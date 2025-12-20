const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
} = require("./order.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken.js");

//tạo đơn hàng
router.post("/", createOrder);

//nhận đơn hàng qua email của người dùng
router.get("/email/:email", getOrderByEmail);

// Route lấy tất cả đơn
router.get("/", verifyAdminToken, getAllOrders);

// Route sửa trạng thái
router.patch("/:id/status", verifyAdminToken, updateOrderStatus);

// Route xóa đơn (Khách hàng tự hủy)
router.delete("/:id", deleteOrder);

// Route sửa thông tin đơn (Khách hàng sửa địa chỉ)
router.patch("/:id", updateOrder);

module.exports = router;
