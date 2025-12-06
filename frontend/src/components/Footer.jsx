import React from "react";
import footerLogo from "../assets/footer-logo.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      {/*Top section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/*Left side - Logo and Nav*/}
        <div className="md:w-1/2 w-full">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />
          <ul className="flex flex-col md:flex-row gap-4">
            <li>
              <a href="#home" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-primary">
                Services
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary">
                Contact
              </a>
            </li>
          </ul>
        </div>
        {/*Right side - Newsletter*/}
        <div className="md:w-1/2 w-full">
          <p className="mb-4">
            Đăng ký nhận bản tin của chúng tôi để nhận những cập nhật, tin tức và ưu đãi mới nhất!
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
      {/*Buttom Section*/}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        {/*Left Side - Privacy Links*/}
        <ul>
          <li>
            <a href="#privacy" className="hover:text-primary">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#terms" className="hover:text-primary">
              Terms of Service
            </a>
          </li>
        </ul>
        {/*Right Side - Social Icons*/}
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
