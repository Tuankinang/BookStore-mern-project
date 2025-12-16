import React, { useState } from "react";
import BookCart from "../books/BookCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

// Giữ nguyên mảng tiếng Việt khớp với Database
const categories = [
  "Danh mục sách",
  "Sách kinh doanh",
  "Sách viễn tưởng",
  "Sách kinh dị",
  "Sách phiêu lưu",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Danh mục sách");
  const { data: books = [] } = useFetchAllBooksQuery();

  const filteredBooks =
    selectedCategory === "Danh mục sách" // 1. SỬA LỖI: Đã xóa dấu cách thừa ở cuối
      ? books
      : books.filter(
          (book) =>
            // 2. SỬA LỖI: So sánh cả 2 bên đều là chữ thường để chắc chắn khớp
            book.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Bán chạy nhất</h2>

      {/* Dropdown lọc */}
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCart book={book} />
            </SwiperSlide>
          ))
        ) : (
          // Thêm dòng này để dễ debug xem có lỗi không
          <div className="text-gray-500 py-4">
            Không có sách nào thuộc danh mục này.
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default TopSellers;
