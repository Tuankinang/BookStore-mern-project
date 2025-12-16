import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShield,
  FiTag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/formatPrice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);
  const handleQuantityObj = (type, _id) => {
    if (type === "increment") {
      const item = cartItems.find((i) => i._id === _id);
      if (item && item.quantity >= item.stock) {
        Swal.fire({
          icon: "warning",
          title: "Đạt giới hạn",
          text: `Kho chỉ còn ${item.stock} cuốn.`,
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
    }
    dispatch(updateQuantity({ type, _id }));
  };

  // Xử lý nhập số trực tiếp (Có check tồn kho)
  const handleInputChange = (e, _id) => {
    const value = parseInt(e.target.value);

    if (value > 0) {
      const item = cartItems.find((i) => i._id === _id);
      if (item && value > item.stock) {
        Swal.fire({
          icon: "warning",
          title: "Đạt giới hạn",
          text: `Kho chỉ còn ${item.stock} cuốn.`,
          timer: 1500,
          showConfirmButton: false,
        });
        dispatch(updateQuantity({ type: "set", _id, quantity: item.stock }));
      } else {
        dispatch(updateQuantity({ type: "set", _id, quantity: value }));
      }
    }
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    const invalidItems = cartItems.filter((item) => item.quantity > item.stock);

    if (invalidItems.length > 0) {
      const itemNames = invalidItems
        .map(
          (item) =>
            `- ${item.title} (Còn: ${item.stock}, Bạn chọn: ${item.quantity})`
        )
        .join("\n");

      Swal.fire({
        icon: "error",
        title: "Không thể thanh toán!",
        html: `Các sản phẩm sau không đủ số lượng:<br/><pre style="text-align:left; white-space: pre-wrap;">${itemNames}</pre><br/>Vui lòng điều chỉnh lại số lượng.`,
      });
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiTag className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-500 mb-8">
            Có vẻ như bạn chưa thêm cuốn sách nào vào đây cả.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-auto py-10 px-4 sm:px-6 lg:px-8 font-sans rounded-xl">
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Giỏ hàng ({cartItems.length} sản phẩm)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                <span className="font-semibold text-gray-700">
                  Chi tiết sản phẩm
                </span>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <FiTrash2 /> Xóa tất cả
                </button>
              </div>

              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
                      <img
                        src={getImgUrl(item.coverImage)}
                        alt={item.title}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        <Link
                          to={`/books/${item._id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 capitalize">
                        Thể loại: {item.category}
                      </p>
                      <p
                        className={`text-xs font-bold inline-block px-2 py-0.5 rounded ${
                          item.quantity > item.stock
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.quantity > item.stock
                          ? `Không đủ hàng (Kho: ${item.stock})`
                          : `Còn hàng: ${item.stock}`}
                      </p>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg bg-white h-10">
                      <button
                        onClick={() => handleQuantityObj("decrement", item._id)}
                        disabled={item.quantity <= 1}
                        className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 border-r"
                      >
                        <FiMinus size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, item._id)}
                        className="w-12 h-full text-center font-semibold text-gray-900 focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuantityObj("increment", item._id)}
                        className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px] flex flex-col items-center sm:items-end gap-2">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.newPrice * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Xóa sản phẩm này"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                <FiArrowLeft className="mr-2" /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all transform active:scale-95 mb-6"
              >
                Thanh Toán
              </button>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiShield className="text-green-500 text-lg" />
                  <span>Bảo mật thanh toán 100%</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiTruck className="text-blue-500 text-lg" />
                  <span>Giao hàng nhanh toàn quốc</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FiTag className="text-orange-500 text-lg" />
                  <span>Đổi trả trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
