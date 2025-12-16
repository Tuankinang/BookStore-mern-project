import React, { useState } from "react";
import { Link } from "react-router-dom";
import bannerImg from "../../assets/banner.png";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { getImgUrl } from "../../utils/getImgUrl";
import { IoSearchOutline } from "react-icons/io5";
import { formatPrice } from "../../utils/formatPrice";

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: books = [] } = useFetchAllBooksQuery();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#FFFBF0] min-h-[500px] flex items-center py-12 md:py-0 relative overflow-visible">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 w-full space-y-6 text-center md:text-left z-20">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Bản phát hành mới trong tuần này
            </h1>

            <p className="text-gray-600 text-lg md:pr-12 leading-relaxed">
              Đã đến lúc cập nhật danh sách đọc của bạn với những tác phẩm mới
              nhất và tuyệt vời nhất trong thế giới văn học. Từ những câu chuyện
              ly kỳ nghẹt thở đến những hồi ký lôi cuốn, những tác phẩm mới ra
              mắt tuần này sẽ mang đến điều gì đó cho tất cả mọi người.
            </p>

            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <div className="bg-white p-2 rounded-lg shadow-lg flex items-center gap-2 border border-gray-100">
                <IoSearchOutline className="text-gray-400 ml-3 text-xl" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách tại đây..."
                  className="flex-1 px-2 py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {searchTerm.length > 0 && (
                <div className="absolute left-0 right-0 bg-white shadow-2xl z-50 mt-2 rounded-xl max-h-96 overflow-y-auto border border-gray-100 text-left">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <Link
                        key={book._id}
                        to={`/books/${book._id}`}
                        onClick={() => setSearchTerm("")}
                        className="flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors border-b last:border-none group"
                      >
                        <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded shadow-sm border border-gray-200">
                          <img
                            src={getImgUrl(book.coverImage)}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {book.title}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {book.category}
                          </span>
                          <span className="text-sm font-bold text-red-500 mt-1">
                            {formatPrice(book.newPrice)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>Không tìm thấy sách nào phù hợp!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2 w-full flex justify-center md:justify-end relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
            <img
              src={bannerImg}
              alt="Banner Book"
              className="relative w-full max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
