const Order = require("./order.model");
const Book = require("../books/book.model");
const { param } = require("./order.route");

// --- TẠO MỘT ĐƠN HÀNG MỚI ---
const createAOrder = async (req, res) => {
  try {
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
    const orders = await Order.find({ email })
      .populate({
        path: 'productIds.productId',
        select: 'title coverImage newPrice'
      })
      .sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi tìm đơn đặt hàng", error);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

// --- Lấy TOÀN BỘ đơn hàng (Cho Admin) ---
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
            path: 'productIds.productId',
            select: 'title coverImage newPrice'
        })
      .sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ message: "Chưa có đơn hàng nào", orders: [] });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- Cập nhật trạng thái đơn hàng (Admin duyệt đơn) ---
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 1. Tìm đơn hàng hiện tại trong DB
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // 2. Logic quan trọng: Chỉ tăng "Đã bán" (sold) khi chuyển sang 'completed'
    // Và phải check order.status cũ != 'completed' để tránh cộng dồn nhiều lần nếu admin bấm nhầm
    if (status === 'completed' && order.status !== 'completed') {
        const products = order.productIds;
        for (const item of products) {
            await Book.findByIdAndUpdate(item.productId, {
                $inc: {
                  stock: -item.quantity,
                  sold: item.quantity 
                }
            });
        }
    }

    // 3. Cập nhật trạng thái mới
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái", error);
    res.status(500).json({ message: "Không thể cập nhật trạng thái" });
  }
};

// --- XÓA ĐƠN HÀNG (Khi khách hủy) ---
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json({ message: "Đơn hàng đã bị hủy thành công", order: deletedOrder });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// --- CẬP NHẬT ĐƠN HÀNG (Sửa địa chỉ/SĐT) ---
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrder
};
