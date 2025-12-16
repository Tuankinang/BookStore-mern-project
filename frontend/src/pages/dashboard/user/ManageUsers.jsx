import React, { useEffect, useState } from "react";
import axios from "axios";
import getBaseUrl from "../../../utils/baseUrl";
import {
  FiUsers,
  FiTrash2,
  FiSearch,
  FiUserCheck,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/auth`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải users", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (currentUser && currentUser._id === id) {
      alert("Không thể xóa!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`${getBaseUrl()}/api/auth/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 font-medium">
        Đang tải danh sách người dùng...
      </div>
    );

  return (
    <section className="bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Quản lý người dùng
          </h2>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                <FiUsers size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng User</p>
                <p className="text-xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                <FiShield size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Admin</p>
                <p className="text-xl font-bold text-gray-800">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center shadow-sm">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo email hoặc tên..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-b-xl overflow-hidden border border-t-0 border-gray-200">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái mua hàng
                </th>
                <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full rounded-full border border-gray-200"
                            src={
                              user.photoURL ||
                              `https://ui-avatars.com/api/?name=${
                                user.username || user.email
                              }&background=random&color=fff`
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.username || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <span className="flex items-center gap-1">
                            <FiShield size={10} /> Admin
                          </span>
                        ) : (
                          "User"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.hasOrders ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          <FiUserCheck className="mr-1" /> Đã mua (
                          {user.totalOrders})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                          Chưa mua hàng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.role === "admin" ? (
                        <button
                          disabled
                          className="text-gray-300 cursor-not-allowed p-2"
                          title="Không thể xóa Admin"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                          title="Xóa người dùng"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;
