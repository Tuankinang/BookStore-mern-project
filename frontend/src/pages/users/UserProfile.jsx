import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import avatarPlaceholder from "../../assets/avatar.png";
import { FiCamera, FiUser, FiLock, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.photoURL || avatarPlaceholder
  );

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
  } = useForm();

  useEffect(() => {
    if (currentUser) {
      setValueProfile("phone", currentUser.phone || "");
      if (currentUser.photoURL) setAvatarPreview(currentUser.photoURL);
    }
  }, [currentUser, setValueProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn ảnh dưới 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = async (data) => {
    const updatedData = {
      phone: data.phone,
      photoURL: avatarPreview,
    };
    await callUpdateAPI(updatedData);
  };

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    watch,
    reset: resetPass,
    formState: { errors: errorsPass },
  } = useForm();

  const onPasswordSubmit = async (data) => {
    const updatedData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    await callUpdateAPI(updatedData);
    resetPass();
  };

  const callUpdateAPI = async (data) => {
    try {
      const response = await axios.put(
        `${getBaseUrl()}/api/auth/profile/${currentUser._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser.photoURL) {
        setAvatarPreview(updatedUser.photoURL);
      }

      Swal.fire({
        title: "Thành công",
        text: "Cập nhật thành công!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500,
      }).then(() => {
        if (!data.newPassword) window.location.reload();
      });
    } catch (error) {
      console.error("Lỗi update:", error);
      const msg = error.response?.data?.message || "Không thể cập nhật.";
      Swal.fire("Lỗi", msg, "error");
    }
  };

  const handleLogout = () => {
    dispatch(clearCart());
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 flex items-center gap-4 border border-gray-200">
              <img
                src={avatarPreview}
                alt=""
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {currentUser?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${
                  activeTab === "profile"
                    ? "text-indigo-600 bg-indigo-50 font-bold border-l-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiUser size={20} /> Hồ sơ của tôi
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${
                  activeTab === "password"
                    ? "text-indigo-600 bg-indigo-50 font-bold border-l-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiLock size={20} /> Đổi mật khẩu
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut size={20} /> Đăng xuất
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
              {activeTab === "profile" && (
                <div className="p-8 animate-fade-in">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Hồ Sơ Của Tôi
                    </h2>
                    <p className="text-sm text-gray-500">
                      Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmitProfile(onProfileSubmit)}
                    className="flex flex-col-reverse md:flex-row gap-10"
                  >
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-gray-600 text-sm md:text-right">
                          Tên đăng nhập
                        </label>
                        <div className="md:col-span-3">
                          <span className="text-gray-800 font-medium">
                            {currentUser?.username}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-gray-600 text-sm md:text-right">
                          Email
                        </label>
                        <div className="md:col-span-3">
                          <span className="text-gray-800">
                            {currentUser?.email}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <label className="text-gray-600 text-sm md:text-right">
                          Số điện thoại
                        </label>
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            {...registerProfile("phone")}
                            placeholder="Nhập số điện thoại"
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 mt-8">
                        <div className="md:col-start-2 md:col-span-3">
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                          >
                            Lưu Hồ Sơ
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-64 flex flex-col items-center border-l border-gray-100 md:pl-10 pt-4 gap-4">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 relative group">
                        <img
                          src={avatarPreview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                        >
                          <FiCamera size={24} />
                        </label>
                      </div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer border border-gray-300 px-4 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Chọn Ảnh
                      </label>
                      <div className="text-center text-xs text-gray-400">
                        <p>Dụng lượng file tối đa 1 MB</p>
                        <p>Định dạng:.JPEG, .PNG</p>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="p-8 animate-fade-in max-w-2xl">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Đổi Mật Khẩu
                    </h2>
                    <p className="text-sm text-gray-500">
                      Để bảo mật, vui lòng nhập mật khẩu hiện tại của bạn.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmitPass(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <label className="text-gray-600 text-sm md:text-right">
                        Mật khẩu cũ
                      </label>
                      <div className="md:col-span-3">
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          {...registerPass("oldPassword", {
                            required: "Vui lòng nhập mật khẩu cũ",
                          })}
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        {errorsPass.oldPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsPass.oldPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <label className="text-gray-600 text-sm md:text-right">
                        Mật khẩu mới
                      </label>
                      <div className="md:col-span-3">
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          {...registerPass("newPassword", {
                            required: "Nhập mật khẩu mới",
                            minLength: {
                              value: 6,
                              message: "Tối thiểu 6 ký tự",
                            },
                          })}
                          placeholder="Nhập mật khẩu mới"
                        />
                        {errorsPass.newPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsPass.newPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <label className="text-gray-600 text-sm md:text-right">
                        Xác nhận MK
                      </label>
                      <div className="md:col-span-3">
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          {...registerPass("confirmPassword", {
                            required: true,
                            validate: (val) => {
                              if (watch("newPassword") != val) {
                                return "Mật khẩu không khớp";
                              }
                            },
                          })}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        {watch("confirmPassword") &&
                          watch("newPassword") !== watch("confirmPassword") && (
                            <span className="text-xs text-red-500 mt-1">
                              Mật khẩu xác nhận không khớp
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 mt-8">
                      <div className="md:col-start-2 md:col-span-3">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                        >
                          Xác Nhận Đổi
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
