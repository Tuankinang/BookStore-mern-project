import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiCheckCircle,
  FiRefreshCw,
  FiPhone,
  FiTruck,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      if (quantity < book?.stock) {
        setQuantity((prev) => Number(prev) + 1);
      } else {
        alert(`Bạn không thể mua quá ${book?.stock} cuốn!`);
      }
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => Number(prev) - 1);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
      return;
    }

    let numValue = parseInt(value);
    if (numValue > book?.stock) {
      alert(`Bạn không thể mua quá ${book?.stock} cuốn!`);
      numValue = book?.stock;
    }
    if (numValue > 0) setQuantity(numValue);
  };

  const handleBlur = () => {
    if (quantity === "" || parseInt(quantity) < 1) {
      setQuantity(1);
    }
  };
  const handleAddToCart = (product) => {
    if (currentUser) {
      const finalQty = parseInt(quantity) || 1;
      if (finalQty > product.stock) {
        alert("Số lượng vượt quá tồn kho!");
        return;
      }
      dispatch(addToCart({ ...product, quantity: finalQty }));
    } else {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      navigate("/login");
    }
  };
  if (isLoading) return <div>Đang tải...</div>;
  if (isError) return <div>Lỗi xảy ra khi tải thông tin sách...</div>;
  return (
    <div className="bg-gray-50 pb-12">
      {/* 1. BREADCRUMB (Điều hướng) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize hover:text-blue-600 cursor-pointer">
            {book?.category}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium truncate">
            {book?.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
            <div className="w-full md:w-5/12 lg:w-4/12 flex-shrink-0">
              <div className="border border-gray-100 rounded-lg overflow-hidden bg-white p-4 flex justify-center items-center shadow-md relative group">
                {/* Badge giảm giá nếu có */}
                {book?.oldPrice && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    -
                    {Math.round(
                      ((book.oldPrice - book.newPrice) / book.oldPrice) * 100
                    )}
                    %
                  </span>
                )}
                <img
                  src={`${getImgUrl(book.coverImage)}`}
                  alt={book.title}
                  className="w-full h-auto object-contain max-h-[500px] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN --- */}
            <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col">
              {/* Tên & Tác giả */}
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 border-b pb-4">
                {/* <p>Tác giả: <span className="text-blue-600 font-semibold cursor-pointer">{book.author || "Admin"}</span></p> */}
                <span className="h-4 w-px bg-gray-300"></span>
                {/* <p>
                  Tình trạng:
                  <span
                    className={`ml-1 font-bold ${
                      book?.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {book?.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </p>
                *{" "} */}
                <p>
                  Sách có sẵn:
                  <span className="text-gray-900 font-medium">
                    {book?.stock || 0}
                  </span>
                </p>
                <span className="h-4 w-px bg-gray-300"></span>
                <p>
                  Sách đã bán:
                  <span className="text-gray-900 font-medium">
                    {book?.sold || 0}
                  </span>
                </p>
                <span className="h-4 w-px bg-gray-300"></span>
                {/* <p>
                  Mã SP:{" "}
                  <span className="text-gray-900 font-medium">
                    #{id.slice(-6).toUpperCase()}
                  </span>
                </p> */}
              </div>

              {/* Giá & Hành động */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-bold text-red-600">
                    {formatPrice(book?.newPrice)}
                  </span>
                  {book?.oldPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1">
                      {formatPrice(book?.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Chọn số lượng */}
                  <div className="flex flex-col w-full sm:w-auto">
                    <span className="text-sm font-semibold mb-1 text-gray-700">
                      Số lượng:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded bg-white h-11">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        className="px-4 hover:bg-gray-100 h-full border-r text-gray-600 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-16 text-center font-bold text-gray-900 focus:outline-none h-full"
                      />
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        className="px-4 hover:bg-gray-100 h-full border-l text-gray-600"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* Nút Mua */}
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book?.stock === 0}
                    className={`flex-1 w-full sm:w-auto h-11 px-8 rounded font-bold uppercase transition-all flex items-center justify-center gap-2 mt-auto
                        ${
                          book?.stock > 0
                            ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-md hover:shadow-lg transform active:scale-95"
                            : "bg-gray-300 cursor-not-allowed text-gray-500"
                        }`}
                  >
                    <FiShoppingCart className="text-xl" />
                    {book?.stock > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
                  </button>
                </div>
              </div>

              {/* Chính sách */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 border rounded bg-white hover:shadow-sm transition">
                  <FiTruck className="text-2xl text-blue-500 mt-1" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      Miễn phí vận chuyển
                    </p>
                    <p className="text-xs text-gray-500">Cho đơn hàng từ $50</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded bg-white hover:shadow-sm transition">
                  <FiCheckCircle className="text-2xl text-green-500 mt-1" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      Chính hãng 100%
                    </p>
                    <p className="text-xs text-gray-500">Hoàn tiền nếu giả</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded bg-white hover:shadow-sm transition">
                  <FiRefreshCw className="text-2xl text-orange-500 mt-1" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      Đổi trả 30 ngày
                    </p>
                    <p className="text-xs text-gray-500">Nếu có lỗi nhà SX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded bg-white hover:shadow-sm transition">
                  <FiPhone className="text-2xl text-purple-500 mt-1" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      Hỗ trợ 24/7
                    </p>
                    <p className="text-xs text-gray-500">
                      Hotline: 0905.474.805
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 3. MÔ TẢ SẢN PHẨM */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Mô tả sản phẩm
            </h3>
            <div className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="mb-4">
                <strong>{book.title}</strong> là một cuốn sách thuộc thể loại{" "}
                <span className="capitalize font-semibold text-blue-600">
                  {book.category}
                </span>
                . Dưới đây là nội dung chi tiết:
              </p>
              <p className="mb-4">{book.description}</p>
              <p className="italic text-gray-500 text-sm">
                *Lưu ý: Hình ảnh bìa sách có thể thay đổi tùy thuộc vào đợt tái
                bản của nhà xuất bản.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
