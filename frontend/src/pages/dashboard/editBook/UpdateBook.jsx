import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseUrl";
import { getImgUrl } from "../../../utils/getImgUrl"; // Hàm lấy ảnh của bạn
import {
  FiSave,
  FiX,
  FiUploadCloud,
  FiBookOpen,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);

  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData?.category);
      setValue("trending", bookData.trending);
      setValue("oldPrice", bookData.oldPrice);
      setValue("newPrice", bookData.newPrice);
      setValue("stock", bookData.stock);
      setValue("coverImage", bookData.coverImage);

      setImageFileName(bookData.coverImage);
      // Giả sử hàm getImgUrl trả về đường dẫn đầy đủ
      setImagePreview(getImgUrl(bookData.coverImage));
    }
  }, [bookData, setValue]);

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stock: Number(data.stock),
      coverImage: imageFileName || bookData.coverImage,
    };

    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updateBookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        title: "Thành công!",
        text: "Thông tin sách đã được cập nhật.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      await refetch();
      navigate("/dashboard/manage-books"); // Quay về trang quản lý sau khi xong
    } catch (error) {
      console.log("Không cập nhật được sách.");
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể cập nhật sách. Vui lòng thử lại.",
        icon: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      // Tạo URL xem trước ảnh
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Lỗi khi tải dữ liệu sách!
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Cập nhật sách
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Chỉnh sửa thông tin chi tiết cho cuốn sách ID:{" "}
              <span className="font-mono text-indigo-600">#{id.slice(-6)}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/manage-books")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
          >
            <FiX className="text-lg" /> Hủy bỏ
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* CỘT TRÁI: THÔNG TIN CHÍNH (Chiếm 2 phần) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Thông tin chung */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBookOpen className="text-indigo-600" /> Thông tin chung
              </h3>

              <div className="space-y-4">
                {/* Tên sách */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sách
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Nhập tên sách..."
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    {...register("description")}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="Mô tả nội dung sách..."
                  ></textarea>
                </div>

                {/* Thể loại & Trending */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thể loại
                    </label>
                    <div className="relative">
                      <select
                        {...register("category")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                      >
                        <option value="">Chọn thể loại</option>
                        <option value="Sách kinh doanh">Sách kinh doanh</option>
                        <option value="Sách viễn tưởng">Sách viễn tưởng</option>
                        <option value="Sách kinh dị">Sách kinh dị</option>
                        <option value="Sách phiêu lưu">Sách phiêu lưu</option>
                        <option value="Công nghệ">Công nghệ</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Trending */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Sách nổi bật (Trending)
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("trending")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Giá & Kho */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-indigo-600" /> Giá & Tồn kho
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá cũ (VND)
                  </label>
                  <input
                    type="number"
                    {...register("oldPrice")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá mới (VND)
                  </label>
                  <input
                    type="number"
                    {...register("newPrice")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    {...register("stock")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: HÌNH ẢNH & SUBMIT (Chiếm 1 phần) */}
          <div className="space-y-6">
            {/* Card 3: Hình ảnh */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiLayers className="text-indigo-600" /> Ảnh bìa sách
              </h3>

              <div className="flex flex-col items-center">
                {/* Khu vực Preview Ảnh */}
                <div className="w-full h-64 mb-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Book Cover"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiUploadCloud className="text-4xl mx-auto mb-2 opacity-50" />
                      <span className="text-sm">Chưa có ảnh</span>
                    </div>
                  )}

                  {/* Overlay khi hover để nhắc thay ảnh */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">
                      Nhấp bên dưới để thay đổi
                    </p>
                  </div>
                </div>

                {/* Input chọn file */}
                <label className="w-full cursor-pointer">
                  <span className="block w-full py-2 px-4 text-center text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg font-semibold transition-colors">
                    Chọn ảnh mới
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imageFileName && (
                  <p className="text-xs text-gray-500 mt-2 truncate max-w-xs text-center">
                    File: {imageFileName}
                  </p>
                )}
              </div>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <FiSave /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
