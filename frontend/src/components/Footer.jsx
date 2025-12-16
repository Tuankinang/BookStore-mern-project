import React from "react";
import footerLogo from "../assets/footer-logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="md:w-1/2 w-full">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />
          <ul className="flex flex-col md:flex-row gap-4">
            <li>
              <a href="#home" className="hover:text-primary">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-primary">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary">
                Giới thiệu về chúng tôi
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        <div className="md:w-1/2 w-full">
          <p className="mb-4">
            Đăng ký nhận bản tin của chúng tôi để nhận những cập nhật, tin tức
            và ưu đãi mới nhất!
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full px-4 py-2 rounded-1-md text-black"
            />
            <button className="bg-primary px-6 py-2 rounded-r-md hover:bg-primary-dark">
              Nhận thông báo
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        <ul>
          <li>
            <a href="#privacy" className="hover:text-primary">
              Chính sách bảo mật
            </a>
          </li>
          <li>
            <a href="#terms" className="hover:text-primary">
              Điều khoản dịch vụ
            </a>
          </li>
        </ul>
        <div className="flex gap-6">
          <a
            href="https://www.facebook.com/muan.manhtuan/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.facebook.com/muan.manhtuan/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com/muan.manhtuan/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
