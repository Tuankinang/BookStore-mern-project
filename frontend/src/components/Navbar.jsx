import React, { useState } from "react";
import { href, Link } from "react-router-dom";
import {
  HiMiniBars3CenterLeft,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { clearCart, setCart } from "../redux/features/cart/cartSlice"
import { useEffect } from "react";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import { getImgUrl } from "../utils/getImgUrl";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch(); 
  const { currentUser, logout } = useAuth();

  // --- LOGIC TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  // Lấy toàn bộ sách về để lọc (Cách đơn giản cho Client-side search)
  const { data: books = [] } = useFetchAllBooksQuery();

  // Lọc sách theo từ khóa (Không phân biệt hoa thường)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // ----------------------

  const token = localStorage.getItem('token');
  const isAdmin = !!token;

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
        localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cartItems));
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, currentUser]);
  const handleLogOut = () => {
    dispatch(clearCart());
    logout();
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft className="size-6" />
          </Link>
          {/* search input */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline className="absolute inline-block left-3 inset-y-2" />
            <input
              type="text"
              placeholder="Tìm kiếm sách"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}             
            />
            {searchTerm.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-xl z-50 mt-1 rounded-md max-h-96 overflow-y-auto border border-gray-100">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <Link
                      key={book._id}
                      to={`/books/${book._id}`}
                      onClick={() => setSearchTerm("")} // Bấm vào thì đóng search, xóa từ khóa
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-none"
                    >
                      <img 
                        src={getImgUrl(book.coverImage)} 
                        alt={book.title} 
                        className="w-10 h-14 object-cover rounded shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-800 line-clamp-1">
                          {book.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {book.category} - <span className="text-red-500 font-medium">${book.newPrice}</span>
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    Không tìm thấy sách nào!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div className="">
            {currentUser ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src={avatarImg}
                    alt=""
                    className={`size-7 rounded-full ${
                      currentUser ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>
                {/* show dropdowns */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>
          <button className="hidden sm:block" />
          <HiOutlineHeart className="size-6" />
          <button />
          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 py-2 flex items-center rounded-sm"
          >
            <HiOutlineShoppingCart className="" />
            {cartItems.length > 0 ? (
              <span className="text-sm font-semibold sm:ml-1">
                {cartItems.length}
              </span>
            ) : (
              <span className="text-sm font-semibold sm:ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
