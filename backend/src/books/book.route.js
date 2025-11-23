const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../middleware/verifyAdminToken.js");
const {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
} = require("./book.controller.js");

// frontend => backend sever => controller => book schema => db => send to sever => trở lại frontend
// post = gửi dữ liệu frontend lên db
// get = lấy dữ liệu trở lại db
// put/patch = chỉnh sửa hoặc cập nhật dữ liệu
// delete = xóa

// post a book
router.post("/create-book", verifyAdminToken, postABook);

// get all books
router.get("/", getAllBooks);

//single book endpoint
router.get("/:id", getSingleBook);

//update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

//delete
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
