const Book = require("./book.model");

const postABook = async (req, res) => {
  try {
    const newBook = await Book({ ...req.body });
    await newBook.save();
    res
      .status(200)
      .send({ message: "Sách được đăng thành công!", book: newBook });
  } catch (error) {
    console.error("Lỗi tạo sách!", error);
    res.status(500).send({ message: "Không tạo được sách" });
  }
};

//get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Lỗi lấy sách!", error);
    res.status(500).send({ message: "Không lấy được sách" });
  }
};

//get single books
const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).send({ message: "Không tìm thấy sách!" });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Lỗi lấy sách!", error);
    res.status(500).send({ message: "Không lấy được sách" });
  }
};

//update book data
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      res.status(404).send({ message: "Sách không được tìm thấy!" });
    }
    res.status(200).send({
      message: "Cập nhật sách thành công!",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sách!", error);
    res.status(500).send({ message: "Không cập nhật được sách" });
  }
};

//delete
const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      res.status(404).send({ message: "Sách không được tìm thấy!" });
    }
    res.status(200).send({
      message: "Xóa sách thành công!",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Lỗi xóa sách!", error);
    res.status(500).send({ message: "Không xóa được sách" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
};
