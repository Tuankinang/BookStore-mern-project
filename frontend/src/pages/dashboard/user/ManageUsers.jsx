import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseUrl'; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Hàm gọi API lấy danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/auth`); // Lưu ý: check lại route trong index.js backend xem prefix là gì. Thường là /api/users hoặc /api/auth
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải users", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Hàm xóa user
  const handleDeleteUser = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
        try {
            await axios.delete(`${getBaseUrl()}/api/auth/${id}`);
            // Cập nhật lại danh sách sau khi xóa
            setUsers(users.filter(user => user._id !== id));
            alert("Xóa thành công!");
        } catch (error) {
            alert("Xóa thất bại!");
        }
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <section className="bg-blue-50 py-16 min-h-screen">
      <div className="max-w-screen-lg mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Người dùng</h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email / Username
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lịch sử mua hàng
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap font-medium">
                          {user.username}
                        </p>
                        <p className="text-gray-500 text-xs">{user._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.role === 'admin' ? 'text-green-900' : 'text-blue-900'}`}>
                      <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${user.role === 'admin' ? 'bg-green-200' : 'bg-blue-200'}`}></span>
                      <span className="relative">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {user.hasOrders ? (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            ✅ Đã mua ({user.totalOrders} đơn)
                        </span>
                    ) : (
                        <span className="text-gray-400">Chưa mua hàng</span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;