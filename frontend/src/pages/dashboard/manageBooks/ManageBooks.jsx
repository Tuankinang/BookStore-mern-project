import React from "react";
import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
} from "../../../redux/features/books/booksApi";
import { Link, useNavigate } from "react-router-dom";

const ManageBooks = () => {
  const navigate = useNavigate();

  const { data: books, refetch } = useFetchAllBooksQuery();

  const [deleteBook] = useDeleteBookMutation();

  // Handle deleting a book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id).unwrap();
      alert("Book deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete book:", error.message);
      alert("Failed to delete book. Please try again.");
    }
  };

  // Handle navigating to Edit Book page
  const handleEditClick = (id) => {
    navigate(`dashboard/edit-book/${id}`);
  };
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      {/* Container mở rộng tối đa chiều ngang */}
      <div className="container mx-auto px-4"> 
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Kho Sách</h2>
            <div className="text-sm text-gray-500">
                Tổng số sách: <span className="font-bold text-gray-800">{books?.length || 0}</span>
            </div>
        </div>  

        {/* Table Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto"> {/* Vẫn giữ overflow-x-auto để mobile không bị vỡ, nhưng desktop sẽ đủ rộng */}
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
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
                {books &&
                  books.map((book, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">
                        {index + 1}
                      </td>                     

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 font-medium whitespace-no-wrap max-w-xs truncate" title={book.title}>
                          {book.title}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                          <span aria-hidden className="absolute inset-0 bg-blue-100 opacity-50 rounded-full"></span>
                          <span className="relative text-xs uppercase">{book.category}</span>
                        </span>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-700">
                        ${book.newPrice}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition duration-300 shadow-sm"
                            >
                            Sửa
                            </Link>
                            <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition duration-300 shadow-sm"
                            >
                            Xóa
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer bảng (nếu cần phân trang sau này) */}
          <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
            <span className="text-xs xs:text-sm text-gray-900">
                Hiển thị {books?.length} kết quả
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
