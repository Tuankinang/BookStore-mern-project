import React, { useEffect } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import { useState } from "react";

const UpdateBook = () => {
  const { id } = useParams();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);
  // console.log(bookData)
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [imageFileName, setimageFileName] = useState("");
  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData?.category);
      setValue("trending", bookData.trending);
      setValue("oldPrice", bookData.oldPrice);
      setValue("newPrice", bookData.newPrice);
      setValue("coverImage", bookData.coverImage);
      setValue("stock", bookData.stock);
      setimageFileName(bookData.coverImage);
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
        title: "Đã cập nhật sách",
        text: "Sách của bạn đã được cập nhật thành công!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      await refetch();
    } catch (error) {
      console.log("Không cập nhật được sách.");
      alert("Không cập nhật được sách.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFileName(file.name);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Lỗi khi tìm dữ liệu sách</div>;
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cập nhật sách</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Tên sách"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Mô tả"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Thể loại"
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

        <InputField
          label="Giá cũ"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="Giá khuyến mãi"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <InputField
          label="Số lượng tồn kho"
          name="stock"
          type="number"
          placeholder="Nhập số lượng"
          register={register}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hình ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {imageFileName && (
            <p className="text-sm text-gray-500">Đang chọn: {imageFileName}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Cập nhật sách
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
