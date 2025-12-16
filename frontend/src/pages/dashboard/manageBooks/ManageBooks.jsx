import React, { useState, useEffect } from "react"; // 1. Thêm useEffect
import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
} from "../../../redux/features/books/booksApi";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const ManageBooks = () => {
  const navigate = useNavigate();
  const { data: books = [], refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- QUAN TRỌNG: RESET TRANG VỀ 1 KHI TÌM KIẾM ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- BƯỚC 1: LỌC SÁCH THEO TỪ KHÓA ---
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- BƯỚC 2: SẮP XẾP (Dựa trên danh sách ĐÃ LỌC) ---
  const sortedBooks = [...filteredBooks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // --- BƯỚC 3: PHÂN TRANG (Dựa trên danh sách ĐÃ LỌC & SẮP XẾP) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  // Các hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này không?")) {
      try {
        await deleteBook(id).unwrap();
        alert("Xóa sách thành công!");
        refetch();
      } catch (error) {
        console.error("Failed to delete book:", error.message);
        alert("Không thể xóa sách. Vui lòng thử lại.");
      }
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Quản lý sách
          </h2>
          <div className="text-sm text-gray-500 bg-white px-4 py-1 rounded-full shadow-sm border">
            Tổng số sách:{" "}
            <span className="font-bold text-indigo-600">
              {books?.length || 0}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {/* --- THANH TÌM KIẾM (Đưa lên trên bảng để chuẩn UX) --- */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Nút thêm mới (Nếu cần) */}
            {/* <Link to="/dashboard/add-new-book" ... >Thêm sách</Link> */}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên sách
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thể loại
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.length > 0 ? (
                  currentBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">
                        {indexOfFirstItem + index + 1}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p
                          className="text-gray-900 font-medium whitespace-no-wrap max-w-xs truncate"
                          title={book.title}
                        >
                          {book.title}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-blue-100 opacity-50 rounded-full"
                          ></span>
                          <span className="relative text-xs uppercase">
                            {book.category}
                          </span>
                        </span>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-700">
                        {formatPrice(book.newPrice)}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            book.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock}
                        </span>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center font-bold text-indigo-600">
                        {book.sold || 0}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            to={`/dashboard/edit-book/${book._id}`}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded text-xs font-medium transition duration-300 shadow-sm border border-indigo-200"
                          >
                            Sửa
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-medium transition duration-300 shadow-sm border border-red-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Hiển thị khi không tìm thấy kết quả
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500 italic"
                    >
                      Không tìm thấy sách nào phù hợp với từ khóa "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-4 bg-white border-t border-gray-200 flex flex-col xs:flex-row items-center justify-between">
            <span className="text-xs xs:text-sm text-gray-600 mb-2 xs:mb-0">
              Hiển thị {currentBooks.length > 0 ? indexOfFirstItem + 1 : 0} đến{" "}
              {Math.min(indexOfLastItem, sortedBooks.length)} trong tổng số{" "}
              {sortedBooks.length} kết quả
            </span>

            <div className="inline-flex mt-2 xs:mt-0 gap-1">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border text-sm font-medium transition-colors
                        ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
              >
                <FiChevronLeft className="inline-block" />
              </button>

              {/* Render số trang */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded border text-sm font-medium transition-colors
                            ${
                              currentPage === i + 1
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                            }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded border text-sm font-medium transition-colors
                        ${
                          currentPage === totalPages || totalPages === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
              >
                <FiChevronRight className="inline-block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
