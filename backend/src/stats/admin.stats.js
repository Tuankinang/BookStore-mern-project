const mongoose = require("mongoose");
const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");
const router = express.Router();

// Hàm tính toán số liệu thống kê của admin
router.get("/", async (req, res) => {
  try {
    // 1. Tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // 2. Tổng doanh số (tổng giá của tất cả các đơn hàng)
    const totalSales = await Order.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const trendingBooksList = await Book.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("title coverImage newPrice stock sold");

    // 4. Thống kê sách đang thịnh hành
    const trendingBooksCount = await Book.aggregate([
      { $match: { trending: true } },
      { $count: "trendingBooksCount" },
    ]);

    const trendingBooks =
      trendingBooksCount.length > 0
        ? trendingBooksCount[0].trendingBooksCount
        : 0;

    // 5. Tổng số sách
    const totalBooks = await Book.countDocuments();

    // 6. Doanh số hàng tháng (nhóm theo tháng và tổng doanh số cho mỗi tháng)
    const monthlySales = await Order.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Result summary
    res.status(200).json({
      totalOrders,
      totalSales: totalSales[0]?.totalSales || 0,
      trendingBooks,
      totalBooks,
      monthlySales,
      trendingBooksList,
    });
  } catch (error) {
    console.error("Lỗi khi tải số liệu thống kê quản trị", error);
    res
      .status(500)
      .json({ message: "Không thể lấy số liệu thống kê quản trị!" });
  }
});

module.exports = router;
