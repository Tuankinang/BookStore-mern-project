// Import model Order của bạn
const Order = require("./order.model");
const { param } = require("./order.route");

// --- TẠO MỘT ĐƠN HÀNG MỚI ---
// (Người dùng khi thanh toán)
const createAOrder = async (req, res) => {
  try {
    // Tạo đơn hàng mới từ dữ liệu gửi lên (req.body)
    const newOrder = await Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng", error);
    res.status(500).json({ message: "Không tạo được đơn hàng" });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi tìm đơn đặt hàng", error);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
};
