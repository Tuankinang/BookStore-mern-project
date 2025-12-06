import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCart: (state, action) => {
        state.cartItems = action.payload;
    },
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      const quantityToAdd = action.payload.quantity || 1;
      const productStock = action.payload.stock || 0; // Lấy tồn kho của sách

      if (!existingItem) {
        state.cartItems.push({ 
            ...action.payload, 
            quantity: quantityToAdd 
        });
        
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đã thêm vào giỏ hàng!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        existingItem.quantity += quantityToAdd; 
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đã cập nhật số lượng!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    updateQuantity: (state, action) => {
        const { type, _id, quantity } = action.payload; // type: 'increment' hoặc 'decrement'
        const item = state.cartItems.find((item) => item._id === _id);

        if (item) {
            if (type === 'increment') {
                item.quantity += 1;
            } else if (type === 'decrement') {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                }
            } else if (type === 'set') { // Xử lý nhập số trực tiếp
                if (quantity >= 1) {
                    item.quantity = quantity;
                }
            }
        }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, setCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
