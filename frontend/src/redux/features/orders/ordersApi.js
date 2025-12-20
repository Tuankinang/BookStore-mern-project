import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseUrl";

//Tạo createApi
const ordersApi = createApi({
  reducerPath: "ordersApi",
  tagTypes: ["Orders"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Tạo đơn hàng
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),

    // 2. Lấy đơn hàng theo Email (User xem lịch sử mua)
    getOrderByEmail: builder.query({
      query: (email) => `/email/${email}`,
      providesTags: ["Orders"],
    }),

    //3.  Lấy TẤT CẢ đơn hàng (Admin)
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
      invalidatesTags: ["Orders"],
    }),

    // 5. Xóa đơn hàng (User hủy)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
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

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;
export default ordersApi;
