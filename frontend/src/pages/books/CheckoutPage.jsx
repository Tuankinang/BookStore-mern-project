import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { FiCreditCard, FiMail, FiMapPin, FiPhone, FiTruck, FiUser } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map(item => ({
                productId: item?._id,
                quantity: item?.quantity
      })),
      totalPrice: totalPrice,
    };
    try {
      await createOrder(newOrder).unwrap();
      Swal.fire({
        title: "Thành công!",
        text: "Đơn hàng của bạn đã được đặt thành công.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tuyệt vời!",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Lỗi đặt hàng!", error);
      alert("Không thể đặt hàng ");
    }
  };
  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  if (isLoading) return <div>Đang tải....</div>;
  return (
    <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Thanh toán</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- CỘT TRÁI: THÔNG TIN & THANH TOÁN (8 phần) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Thông tin giao hàng */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                 <FiMapPin className="text-indigo-600"/> Địa chỉ giao hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Họ tên */}
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiUser/></div>
                        <input
                            type="text"
                            className="pl-10 w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Nhập họ tên"
                            {...register("name", { required: true })}
                        />
                    </div>
                 </div>

                 {/* Phone */}
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiPhone/></div>
                        <input
                            type="number"
                            className="pl-10 w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Nhập số điện thoại"
                            {...register("phone", { required: true })}
                        />
                    </div>
                 </div>

                 {/* Email (Readonly) */}
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiMail/></div>
                        <input
                            type="text"
                            className="pl-10 w-full border border-gray-300 rounded-lg h-10 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                            defaultValue={currentUser?.email}
                            disabled
                        />
                    </div>
                 </div>

                 {/* Địa chỉ chi tiết */}
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Số nhà, đường)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Ví dụ: 123 Đường Nguyễn Văn Linh"
                        {...register("address", { required: true })}
                    />
                 </div>

                 {/* Thành phố & Bang */}
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        {...register("city", { required: true })}
                    />
                 </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        {...register("state", { required: true })}
                    />
                 </div>

                 {/* Quốc gia & Zip */}
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Vietnam"
                        {...register("country", { required: true })}
                    />
                 </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã bưu điện (Zipcode)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        {...register("zipcode", { required: true })}
                    />
                 </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán (MỚI) */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FiCreditCard className="text-indigo-600"/> Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: COD */}
                    <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-indigo-600' : 'border-gray-400'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 flex items-center gap-2"><FiTruck/> Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-xs text-gray-500">Thanh toán tiền mặt cho shipper khi nhận được hàng.</p>
                        </div>
                    </div>

                    {/* Option 2: Online */}
                    <div 
                        onClick={() => setPaymentMethod('online')}
                        className={`cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all ${paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-indigo-600' : 'border-gray-400'}`}>
                             {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 flex items-center gap-2"><FiCreditCard/> Thanh toán Online</p>
                            <p className="text-xs text-gray-500">Thẻ ngân hàng, Ví điện tử (Momo, ZaloPay...)</p>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (4 phần) --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
                
                {/* List sản phẩm */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-4">
                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                                <img src={getImgUrl(item.coverImage)} alt={item.title} className="h-full w-full object-cover"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">${(item.newPrice * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Tạm tính</span>
                        <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Phí vận chuyển</span>
                        <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                        <span>Tổng cộng</span>
                        <span className="text-indigo-600">${totalPrice}</span>
                    </div>
                </div>

                {/* Điều khoản */}
                <div className="mt-6">
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        <span className="text-xs text-gray-500">
                            Tôi đồng ý với <Link className="text-indigo-600 underline">Điều khoản dịch vụ</Link> và <Link className="text-indigo-600 underline">Chính sách bảo mật</Link>.
                        </span>
                    </label>
                </div>

                {/* Nút Đặt hàng */}
                <button
                    disabled={!isChecked}
                    className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all 
                    ${isChecked 
                        ? 'bg-indigo-600 hover:bg-indigo-700 transform active:scale-95' 
                        : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {isLoading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>

            </div>
          </div>

        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
