import React, { useState, useEffect } from "react";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useAddBookMutation } from "../../../redux/features/books/booksApi";
import Swal from "sweetalert2";
import { HiOutlinePhotograph } from "react-icons/hi";
import { AiOutlineCheck } from "react-icons/ai";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      trending: false,
      oldPrice: "",
      newPrice: "",
      stock: "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [addBook, { isLoading, isError }] = useAddBookMutation();

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onSubmit = async (formData) => {
    const newBookData = {
      ...formData,
      coverImage: imageFileName,
    };

    try {
      await addBook(newBookData).unwrap();
      Swal.fire({
        title: "Đã thêm sách",
        text: "Sách đã được tải lên thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      setImageFile(null);
      setImageFileName("");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thêm được sách. Vui lòng thử lại.",
        icon: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  const oldPrice = watch("oldPrice");
  const newPrice = watch("newPrice");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Thêm sách mới</h1>
        <p className="text-sm text-gray-500 mt-1">
          Thêm sách vào kho và quản lý nhanh chóng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên sách <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", { required: "Tên sách bắt buộc" })}
                type="text"
                placeholder="Nhập tên sách"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                  errors.title ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                {...register("description")}
                rows="4"
                placeholder="Mô tả ngắn về cuốn sách"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SelectField
                  label="Loại sách"
                  name="category"
                  options={[
                    { value: "", label: "Chọn thể loại" },
                    { value: "business", label: "Business" },
                    { value: "fiction", label: "Fiction" },
                    { value: "horror", label: "Horror" },
                    { value: "adventure", label: "Adventure" },
                  ]}
                  register={register}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="trending"
                  type="checkbox"
                  {...register("trending")}
                  className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="trending"
                  className="ml-3 text-sm font-semibold text-gray-700"
                >
                  Trending
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá
                </label>
                <input
                  {...register("oldPrice", {
                    required: "Nhập giá gốc",
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá phải >= 0" },
                  })}
                  type="number"
                  placeholder="Giá cũ"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                    errors.oldPrice ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.oldPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.oldPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá khuyến mãi
                </label>
                <input
                  {...register("newPrice", {
                    valueAsNumber: true,
                    validate: (val) =>
                      val === "" ||
                      Number(val) <= Number(oldPrice || 0) ||
                      "Khuyến mãi không được lớn hơn giá gốc",
                  })}
                  type="number"
                  placeholder="Giá khuyến mãi"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                    errors.newPrice ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.newPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.newPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("stock", {
                    required: "Nhập số lượng",
                    valueAsNumber: true,
                    min: { value: 0, message: "Số lượng phải >= 0" },
                  })}
                  type="number"
                  placeholder="Số lượng"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                    errors.stock ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ảnh bìa
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <HiOutlinePhotograph className="text-xl text-gray-600" />
                  <span className="text-sm text-gray-700">Chọn tệp ảnh</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-sm text-gray-500">
                  {imageFileName ? (
                    <span>
                      Đã chọn:{" "}
                      <span className="font-medium text-gray-700">
                        {imageFileName}
                      </span>
                    </span>
                  ) : (
                    "Chưa có tệp được chọn"
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  isSubmitting || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600"
                }`}
              >
                {isSubmitting || isLoading ? "Đang thêm..." : "Thêm sách"}
              </button>
            </div>
          </form>
        </div>

        <aside className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex-1">
            <div className="w-full h-64 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center text-gray-400 px-4">
                  <HiOutlinePhotograph className="mx-auto text-4xl mb-2" />
                  <div className="text-sm">Preview ảnh bìa</div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Thông tin tóm tắt
            </h4>
            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Tên:</span>
                <span className="font-medium text-gray-800 truncate">
                  {watch("title") || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Thể loại:</span>
                <span className="font-medium text-gray-800">
                  {watch("category") || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Giá:</span>
                <span className="font-medium text-gray-800">
                  {watch("oldPrice") ? `$${watch("oldPrice")}` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Khuyến mãi:</span>
                <span className="font-medium text-gray-800">
                  {watch("newPrice") ? `$${watch("newPrice")}` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Số lượng:</span>
                <span className="font-medium text-gray-800">
                  {watch("stock") ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Ảnh:</span>
                <span className="font-medium text-gray-800 truncate">
                  {imageFileName || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AiOutlineCheck className="text-green-500" />
              <div>
                <div className="font-medium text-gray-800">Tips</div>
                <div className="text-xs">
                  Dùng ảnh tối thiểu 600x900 để hiển thị đẹp trên trang sản
                  phẩm.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddBook;
