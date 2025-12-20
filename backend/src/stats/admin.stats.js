const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const [
      totalOrders,
      totalSalesResult,
      booksStats,
      totalBooks,
      monthlySales,
      topSellingBooks,
    ] = await Promise.all([
      // 1. Tổng đơn hàng
      Order.countDocuments(),

      // 2. Tổng doanh thu (chỉ tính đơn completed)
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
      ]),

      // 3. Thống kê sách (đã bán / tồn kho)
      Book.aggregate([
        {
          $group: {
            _id: null,
            totalSold: { $sum: "$sold" },
            totalStock: { $sum: "$stock" },
          },
        },
      ]),

      // 4. Tổng số đầu sách
      Book.countDocuments(),

      // 5. Biểu đồ doanh thu theo tháng
      Order.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            totalSales: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 6. --- MỚI: Lấy Top 5 sách bán chạy nhất ---
      Book.find()
        .sort({ sold: -1 })
        .limit(5)
        .select("title coverImage newPrice oldPrice sold stock category"),
    ]);

    // Format dữ liệu trả về
    res.status(200).json({
      totalOrders,
      totalSales: totalSalesResult[0]?.totalSales || 0,
      totalBooks,
      totalBooksSold: booksStats[0]?.totalSold || 0,
      totalBooksStock: booksStats[0]?.totalStock || 0,
      monthlySales,
      trendingBooksList: topSellingBooks || [],
    });
  } catch (error) {
    console.error("Lỗi khi tải thống kê Admin:", error);
    res.status(500).json({ message: "Lỗi server khi lấy số liệu thống kê!" });
  }
});

module.exports = router;
