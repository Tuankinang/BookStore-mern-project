import React, { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useAddBookMutation } from "../../../redux/features/books/booksApi";
import Swal from "sweetalert2";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageFile, setimageFile] = useState(null);
  const [addBook, { isLoading, isError }] = useAddBookMutation();
  const [imageFileName, setimageFileName] = useState("");
  const onSubmit = async (data) => {
    const newBookData = {
      ...data,
      coverImage: imageFileName,
    };
    try {
      await addBook(newBookData).unwrap();
      Swal.fire({
        title: "Đã thêm sách",
        text: "Sách đã được tải lên thành công!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      reset();
      setimageFileName("");
      setimageFile(null);
    } catch (error) {
      console.error(error);
      alert("Không thêm được sách. Vui lòng thử lại.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileName(file.name);
    }
  };
  return (
    <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm sách mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Tên sách */}
        <InputField
          label="Tên sách"
          name="title"
          placeholder="Nhập tên sách"
          register={register}
        />

        {/* Mô tả */}
        <InputField
          label="Mô tả"
          name="description"
          placeholder="Mô tả"
          type="textarea"
          register={register}
        />

        {/* Thể loại sách */}
        <SelectField
          label="Loại sách"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
        />

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register("trending")}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Trending
            </span>
          </label>
        </div>

        {/* Giá cũ */}
        <InputField
          label="Giá"
          name="oldPrice"
          type="number"
          placeholder="Giá cũ"
          register={register}
        />

        {/* Giá khuyến mãi */}
        <InputField
          label="Giá khuyến mãi"
          name="newPrice"
          type="number"
          placeholder="Giá khuyến mãi"
          register={register}
        />

        {/* SỐ LƯỢNG */}
        <InputField
          label="Số lượng"
          name="stock"
          type="number"
          placeholder="Nhập số lượng sách"
          register={register}
        />

        {/* Hình ảnh */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {imageFileName && (
            <p className="text-sm text-gray-500">Selected: {imageFileName}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-md"
        >
          {isLoading ? (
            <span className="">Đang thêm.. </span>
          ) : (
            <span>Thêm sách</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
