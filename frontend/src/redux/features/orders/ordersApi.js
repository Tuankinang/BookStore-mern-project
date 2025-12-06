import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseUrl"; // Giả sử dùng chung file

//Tạo createApi
const ordersApi = createApi({
  reducerPath: "ordersApi", // Tên mới cho reducer
  tagTypes: ["Orders"], // Tag mới để quản lý cache
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); // Lấy token từ bộ nhớ
      if (token) {
        headers.set('authorization', `Bearer ${token}`); // Gắn vào header gửi đi
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Lấy tất cả orders (dựa trên GET /)
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrderByEmail: builder.query({
      query: (email) => {
        return {
          url: `/email/${email}`,
        };
      },
      providesTags: ["Orders"],
    }),
    // Lấy TẤT CẢ đơn hàng (Admin) 
    getAllOrders: builder.query({
      query: () => "/", 
      providesTags: ["Orders"],
    }),

    // 4. Cập nhật trạng thái đơn hàng (Admin) 
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"], // Cập nhật xong tự động fetch lại list
    }),

    // 5. Xóa đơn hàng (User hủy)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], // Tự động load lại danh sách sau khi xóa
    }),

    // 6. Sửa thông tin đơn hàng
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

// 3. Export các hooks mới
export const { useCreateOrderMutation, useGetOrderByEmailQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation, useUpdateOrderMutation } = ordersApi;
export default ordersApi;
