import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiMiniBars3CenterLeft,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import avatarImg from "../assets/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { clearCart, setCart } from "../redux/features/cart/cartSlice";

const navigation = [
  { name: "Thông tin cá nhân", href: "/user-profile" },
  { name: "Lịch sử đơn hàng", href: "/orders" },
  { name: "Giỏ hàng", href: "/cart" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
      if (savedCart) {
        dispatch(setCart(JSON.parse(savedCart)));
      }
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          `cart_${currentUser.email}`,
          JSON.stringify(cartItems)
        );
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, currentUser]);

  const handleLogOut = () => {
    dispatch(clearCart());
    logout();
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6 bg-white z-50 relative border-b border-gray-100 shadow-sm">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <HiMiniBars3CenterLeft className="size-6" />
            <span>Book Store</span>
          </Link>
        </div>

        <div className="relative flex items-center md:space-x-4 space-x-3">
          <Link
            to="/cart"
            className="bg-yellow-400 px-4 py-2 flex items-center gap-2 rounded-full hover:bg-yellow-500 transition-all shadow-sm"
          >
            <HiOutlineShoppingCart className="size-5 text-gray-900" />
            {cartItems.length > 0 ? (
              <span className="text-sm font-bold text-gray-900">
                {cartItems.length}
              </span>
            ) : (
              <span className="text-sm font-bold text-gray-900">0</span>
            )}
          </Link>
          <div className="relative">
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="focus:outline-none"
                >
                  <img
                    src={currentUser?.photoURL || avatarImg}
                    alt="User Avatar"
                    className={`size-8 rounded-full object-cover border border-gray-200 ${
                      currentUser ? "ring-2 ring-blue-100" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md z-50 border border-gray-100 animate-fade-in">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
