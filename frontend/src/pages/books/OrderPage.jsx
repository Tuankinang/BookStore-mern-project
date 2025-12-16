import React from "react";
import { useDeleteOrderMutation, useGetOrderByEmailQuery, useUpdateOrderMutation } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";
import Swal from 'sweetalert2'
import { formatPrice } from "../../utils/formatPrice";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);

  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  // --- HÀM XỬ LÝ NÚT BẤM ---
  const handleOrderAction = async (order) => {
    // TRƯỜNG HỢP 1: Đơn đã giao hoặc đã hủy -> Không cho thao tác
    if (order.status === 'completed' || order.status === 'canceled') {
        Swal.fire({
            title: 'Không thể thao tác!',
            text: `Đơn hàng này đã ${order.status === 'completed' ? 'được giao' : 'bị hủy'}, bạn không thể chỉnh sửa nữa.`,
            icon: 'info',
            confirmButtonText: 'Đã hiểu'
        });
        return;
    }

    // TRƯỜNG HỢP 2: Đơn đang chờ -> Cho chọn Hủy hoặc Sửa
    const { isConfirmed, isDenied } = await Swal.fire({
      title: 'Thao tác đơn hàng',
      text: "Bạn muốn làm gì với đơn hàng này?",
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Hủy Đơn Hàng',
      denyButtonText: 'Sửa Địa Chỉ',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#d33', 
      denyButtonColor: '#3085d6',
    });

    // --- LỰA CHỌN 1: HỦY ĐƠN ---
    if (isConfirmed) {
      try {
        await deleteOrder(order._id).unwrap();
        Swal.fire('Đã hủy!', 'Đơn hàng của bạn đã bị hủy.', 'success');
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể hủy đơn hàng.', 'error');
      }
    } 
    
    // --- LỰA CHỌN 2: SỬA ĐỊA CHỈ (Popup nhập liệu) ---
    else if (isDenied) {
      const { value: formValues } = await Swal.fire({
        title: 'Cập nhật thông tin nhận hàng',
        html:
          `<label class="block text-left text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>` +
          `<input id="swal-phone" class="swal2-input m-0 mb-3 w-full" placeholder="Số điện thoại" value="${order.phone}">` +
          
          `<label class="block text-left text-sm font-medium text-gray-700 mb-1">Thành phố</label>` +
          `<input id="swal-city" class="swal2-input m-0 mb-3 w-full" placeholder="Thành phố" value="${order.address.city}">` +
          
          `<label class="block text-left text-sm font-medium text-gray-700 mb-1">Quốc gia</label>` +
          `<input id="swal-country" class="swal2-input m-0 w-full" placeholder="Quốc gia" value="${order.address.country}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        preConfirm: () => {
          return {
            phone: document.getElementById('swal-phone').value,
            city: document.getElementById('swal-city').value,
            country: document.getElementById('swal-country').value,
          }
        }
      });

      if (formValues) {
        try {
          await updateOrder({ 
            id: order._id, 
            address: { 
                city: formValues.city, 
                country: formValues.country,
                state: order.address.state,
                zipcode: order.address.zipcode 
            },
            phone: formValues.phone
          }).unwrap();
          Swal.fire('Thành công!', 'Thông tin đã được cập nhật.', 'success');
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể cập nhật thông tin.', 'error');
        }
      }
    }
  };

  if (isLoading) return <div className="text-center py-10">Đang tải dữ liệu đơn hàng...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Lỗi khi lấy dữ liệu đơn hàng!</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Lịch sử đơn hàng của bạn</h2>

      {orders.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào!</p>
          <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">Quay lại mua sắm</a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              {/* --- Header của đơn hàng: Mã đơn, Ngày đặt, Trạng thái --- */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                     <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        #{index + 1}
                     </span>
                     <h3 className="font-bold text-lg text-gray-800">Mã đơn: <span className="text-gray-600">#{order._id}</span></h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ngày đặt: {new Date(order?.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                
                {/* Badge trạng thái */}
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'pending' ? '⏳ Đang chờ xác nhận' : 
                     order.status === 'completed' ? '✅ Đã giao hàng' : '❌ Đã hủy'}
                  </span>                 
                </div>
              </div>

              {/* --- Nội dung chi tiết --- */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Cột 1: Thông tin người nhận */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-l-4 border-blue-500 pl-2">Thông tin giao hàng</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">Người nhận:</span> {order.name}</li>
                    <li><span className="font-medium">Email:</span> {order.email}</li>
                    <li><span className="font-medium">SĐT:</span> {order.phone}</li>
                    <li>
                      <span className="font-medium">Địa chỉ:</span> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                    </li>
                  </ul>
                </div>

                {/* Cột 2: Thông tin sản phẩm & Giá */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-l-4 border-green-500 pl-2">Chi tiết sản phẩm</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <ul className="space-y-2 text-gray-600 mb-3">
                      {order.productIds.map((item) => (
                        <li key={item?._id} className="flex items-center gap-2 text-sm">
                          {/* Kiểm tra xem sách có tồn tại không (phòng trường hợp sách gốc bị xóa) */}
                          {item.productId ? (
                            <>
                              <img 
                                src={`${getImgUrl(item.productId.coverImage)}`} 
                                alt={item.productId.title} 
                                className="w-12 h-16 object-cover rounded border"
                              /> 
                              
                              <div className="flex flex-col flex-1">
                                 <span className="font-medium text-gray-800 line-clamp-1">{item.productId.title}</span>
                                 <span className="text-xs text-gray-500">Giá: {formatPrice(item.productId.newPrice)}</span>
                                 <span className="text-xs font-bold text-indigo-600">Số lượng: x{item.quantity}</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-red-400 italic text-xs">Sản phẩm không tồn tại (ID: {item.productId})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-2 flex justify-between items-center">
                       <span className="font-bold text-gray-800">Tổng tiền:</span>
                       <span className="font-bold text-xl text-red-600">{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto border-t pt-4">
                <button 
                  onClick={() => handleOrderAction(order)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors border
                    ${order.status === 'pending' 
                        ? 'bg-white text-red-600 border-red-600 hover:bg-red-50' 
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}
                  `}
                >
                  {order.status === 'pending' ? 'Hủy / Sửa Đơn Hàng' : 'Không thể thao tác'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;