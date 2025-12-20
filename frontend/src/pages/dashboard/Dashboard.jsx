import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAttachMoney,
  MdBarChart,
  MdInventory2,
  MdShoppingCart,
  MdTrendingUp,
} from "react-icons/md";
import { FiArrowRight, FiCheckCircle, FiPackage } from "react-icons/fi";

import getBaseUrl from "../../utils/baseUrl";
import { getImgUrl } from "../../utils/getImgUrl";
import { formatPrice } from "../../utils/formatPrice";
import Loading from "../../components/Loading";
import RevenueChart from "./RevenueChart";

const KPI = ({
  icon,
  title,
  value,
  sub,
  colorClass = "text-indigo-600 bg-indigo-50",
}) => (
  <div className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className={`p-3 rounded-xl mr-4 ${colorClass}`}>{icon}</div>
    <div>
      <div className="text-sm text-gray-500 font-medium">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  </div>
);

const ProductItem = ({ p, index }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
    <div
      className={`text-lg font-bold w-6 text-center ${
        index < 3 ? "text-indigo-500" : "text-gray-300"
      }`}
    >
      #{index + 1}
    </div>

    {/* Ảnh sách */}
    <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 shadow-sm relative">
      <img
        src={getImgUrl(p?.coverImage)}
        alt={p?.title}
        className="object-cover w-full h-full"
        onError={(e) => {
          e.target.src = "https://placehold.co/100?text=Book";
        }}
      />
    </div>

    {/* Thông tin */}
    <div className="flex-1 min-w-0">
      <h4
        className="text-sm font-semibold text-gray-800 line-clamp-1"
        title={p?.title}
      >
        {p?.title}
      </h4>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Kho: {p?.stock}
        </span>
        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Đã bán: {p?.sold || 0}
        </span>
      </div>
    </div>

    {/* Giá tiền */}
    <div className="text-sm font-bold text-indigo-600 whitespace-nowrap">
      {formatPrice(p?.newPrice)}
    </div>
  </div>
);

// --- Main Component ---
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  // Dữ liệu Top 5 lấy từ backend
  const topProducts = data?.trendingBooksList || [];

  return (
    <div className="pb-10 fade-in">
      {/* 1. Phần KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI
          icon={<MdInventory2 size={24} />}
          title="Sản phẩm"
          value={data?.totalBooks}
          sub="Đầu sách đang quản lý"
        />
        <KPI
          icon={<MdAttachMoney size={24} />}
          title="Doanh thu"
          value={`${formatPrice(data?.totalSales)}`}
          sub="Doanh thu thực tế"
          colorClass="text-green-600 bg-green-50"
        />
        <KPI
          icon={<MdTrendingUp size={24} />}
          title="Sách đã bán"
          value={data?.totalBooksSold}
          sub={`Tồn kho: ${data?.totalBooksStock}`}
          colorClass="text-blue-600 bg-blue-50"
        />
        <Link to="/dashboard/manage-orders" className="block">
          <KPI
            icon={<MdShoppingCart size={24} />}
            title="Tổng đơn hàng"
            value={data?.totalOrders}
            sub="Nhấn để quản lý"
            colorClass="text-red-600 bg-red-50"
          />
        </Link>
      </section>

      {/* 2. Chart & Top Selling */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Doanh thu theo tháng
              </h3>
              <p className="text-sm text-gray-400">
                Thống kê đơn hàng đã hoàn thành
              </p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <MdBarChart className="text-gray-400 text-xl" />
            </div>
          </div>
          <div className="w-full h-[400px]">
            <RevenueChart />
          </div>
        </div>

        {/* Right: Top Selling Books */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-gray-800">Top Bán Chạy</h4>
              <div className="text-xs text-gray-400">
                5 sản phẩm doanh số cao nhất
              </div>
            </div>
            <Link
              to="/dashboard/manage-books"
              className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
              title="Quản lý sách"
            >
              <FiArrowRight size={20} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
            {topProducts.length > 0 ? (
              <div className="space-y-1">
                {topProducts.map((book, index) => (
                  <ProductItem key={book._id} p={book} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p>Chưa có dữ liệu bán hàng</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/dashboard/manage-books")}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              Xem tất cả sách
            </button>
          </div>
        </div>
      </section>

      {/* 3. Footer Stats (Tùy chọn hiển thị thêm) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đơn thành công</p>
            <p className="text-lg font-bold text-gray-800">
              {data?.totalOrders}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng tồn kho</p>
            <p className="text-lg font-bold text-gray-800">
              {data?.totalBooksStock}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <MdBarChart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tăng trưởng</p>
            <p className="text-lg font-bold text-gray-800">
              +12.5%{" "}
              <span className="text-xs font-normal text-gray-400">
                (tháng này)
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
