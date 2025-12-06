import React, { useEffect, useState } from "react";
import getBaseUrl from "../../utils/baseUrl";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import { MdAttachMoney, MdBarChart, MdInventory2, MdShoppingCart, MdTrendingUp } from "react-icons/md";
import RevenueChart from "./RevenueChart";
import { FiArrowRight, FiCheckCircle, FiPackage } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";

// Component hiển thị thẻ KPI
const KPI = ({ icon, title, value, sub }) => (
  <div className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mr-4">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500 font-medium">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  </div>
);

// Component hiển thị từng sản phẩm (Đã chỉnh sửa để nhận dữ liệu thật)
const ProductItem = ({ p, index }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
    {/* Số thứ tự Top */}
    <div className="text-lg font-bold text-gray-300 w-4">#{index + 1}</div>
    
    {/* Ảnh */}
    <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 shadow-sm">
      <img 
        src={getImgUrl(p?.coverImage)} 
        alt={p?.title} 
        className="object-cover w-full h-full" 
        onError={(e) => {e.target.src = "https://placehold.co/100"}} // Fallback image
      />
    </div>
    
    {/* Thông tin */}
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1" title={p?.title}>{p?.title}</h4>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Kho: {p?.stock}</span>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Đã bán: {p?.sold || 0}</span>
      </div>
    </div>
    
    {/* Giá */}
    <div className="text-sm font-bold text-indigo-600">${p?.newPrice}</div>
  </div>
);


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  console.log(data);
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
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);
  if (loading) return <Loading />;

  const topProducts = data?.trendingBooksList || [];

  return (
    <div className="pb-10">
      {/* --- PHẦN 1: KPI CARDS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI
            icon={<MdInventory2 size={24} />} 
            title="Sản phẩm" 
            value={data?.totalBooks} 
            sub="Đầu sách đang quản lý" 
        />
        <KPI 
            icon={<MdAttachMoney size={24} />} 
            title="Tổng doanh thu" 
            value={`$${data?.totalSales}`} 
            sub="Doanh thu thực tế (Đã giao)" 
        />
        <KPI 
            icon={<MdTrendingUp size={24} />} 
            title="Sách đã bán" 
            value={data?.totalBooksSold} 
            sub={`Tồn kho: ${data?.totalBooksStock}`} 
        />
        <Link to="/dashboard/manage-orders">
            <KPI 
              icon={<MdShoppingCart size={24} />} 
              title="Tổng đơn hàng" 
              value={data?.totalOrders} 
              sub="Nhấn để quản lý đơn hàng"
            />
        </Link>
      </section>

      {/* --- PHẦN 2: BIỂU ĐỒ & TOP SẢN PHẨM --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (2/3): Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Doanh thu theo tháng</h3>
              <p className="text-sm text-gray-400">Thống kê đơn hàng đã hoàn thành</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
                <MdBarChart className="text-gray-400 text-xl" />
            </div>
          </div>
          <div className="w-full h-[400px]">
            <RevenueChart />
          </div>
        </div>

        {/* CỘT PHẢI (1/3): Top 5 Sản phẩm bán chạy (ĐÃ SỬA) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h4 className="text-lg font-bold text-gray-800">Top Bán Chạy</h4>
                <div className="text-xs text-gray-400">5 sản phẩm doanh số cao nhất</div>
            </div>
            <Link to="/dashboard/manage-books" className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors">
                <FiArrowRight size={20} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {topProducts.length > 0 ? (
                <div className="space-y-1">
                    {topProducts.map((book, index) => (
                        <ProductItem key={book._id} p={book} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-10">Chưa có dữ liệu bán hàng</div>
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

      {/* --- PHẦN 3: INSIGHTS (Thống kê phụ) --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
                <FiCheckCircle size={24}/>
            </div>
            <div>
                <p className="text-sm text-gray-500">Đơn thành công</p>
                <p className="text-lg font-bold text-gray-800">{data?.totalOrders}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
                <FiPackage size={24}/>
            </div>
            <div>
                <p className="text-sm text-gray-500">Tổng tồn kho</p>
                <p className="text-lg font-bold text-gray-800">{data?.totalBooksStock}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <MdBarChart size={24}/>
            </div>
            <div>
                <p className="text-sm text-gray-500">Tăng trưởng</p>
                <p className="text-lg font-bold text-gray-800">+12.5% <span className="text-xs font-normal text-gray-400">(tháng này)</span></p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
