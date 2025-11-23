import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseUrl"; // Giả sử dùng chung file

//Tạo createApi
const ordersApi = createApi({
  reducerPath: "ordersApi", // Tên mới cho reducer
  tagTypes: ["Orders"], // Tag mới để quản lý cache
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: "include",
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
  }),
});

// 3. Export các hooks mới
export const { useCreateOrderMutation, useGetOrderByEmailQuery } = ordersApi;
export default ordersApi;
