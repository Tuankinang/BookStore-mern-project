const Order = require("./order.model");
const Book = require("../books/book.model");

// --- HELPER FUNCTION: Quản lý kho (Dùng chung) ---
// action: 'deduct' (trừ kho - bán hàng) | 'restore' (cộng kho - hoàn hàng)
const manageStock = async (productIds, action) => {
  const operations = productIds.map(async (item) => {
    const bookId = item.productId;
    const quantity = item.quantity;

    // Logic tính toán tăng/giảm
    const adjustment = action === "deduct" ? -quantity : quantity;
    const soldAdjustment = action === "deduct" ? quantity : -quantity;

    // Điều kiện lọc: Nếu là trừ kho, phải đảm bảo đủ hàng (stock >= quantity)
    const filter = {
      _id: bookId,
      ...(action === "deduct" && { stock: { $gte: quantity } }),
    };

    const update = {
      $inc: {
        stock: adjustment,
        sold: soldAdjustment,
      },
    };

    return await Book.findOneAndUpdate(filter, update, { new: true });
  });

  return await Promise.all(operations);
};

// 1. TẠO ĐƠN HÀNG (Create Order)
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const updatedBooks = await manageStock(newOrder.productIds, "deduct");

    if (updatedBooks.includes(null)) {
      return res.status(400).json({
        message: "Có sản phẩm đã hết hàng hoặc không đủ số lượng!",
      });
    }

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Không tạo được đơn hàng" });
  }
};

// 2. LẤY ĐƠN HÀNG THEO EMAIL
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .populate({
        path: "productIds.productId",
        select: "title coverImage newPrice",
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng nào", orders: [] });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi tìm đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 3. LẤY TOÀN BỘ ĐƠN HÀNG (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "productIds.productId",
        select: "title coverImage newPrice",
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Chưa có đơn hàng nào", orders: [] });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 4. CẬP NHẬT TRẠNG THÁI (Admin duyệt/hủy)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });

    if (status === "canceled" && order.status !== "canceled") {
      await manageStock(order.productIds, "restore");
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi cập nhật status:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 5. XÓA ĐƠN HÀNG (Delete)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderToDelete = await Order.findById(id);
    if (!orderToDelete) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (orderToDelete.status !== "canceled") {
      await manageStock(orderToDelete.productIds, "restore");
    }

    // Xóa đơn
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Đơn hàng đã bị hủy và hoàn kho thành công",
      order: orderToDelete,
    });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 6. CẬP NHẬT THÔNG TIN GIAO HÀNG (Sửa địa chỉ/SĐT)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  createOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
};
