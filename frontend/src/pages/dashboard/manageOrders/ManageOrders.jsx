import React, { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/features/orders/ordersApi';
import { getImgUrl } from '../../../utils/getImgUrl';

const ManageOrders = () => {
    const { data: orders, isLoading, isError } = useGetAllOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateOrderStatus({ id, status: newStatus }).unwrap();
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Cập nhật thất bại.");
        }
    };

    if (isLoading) return <div>Đang tải đơn hàng...</div>;
    if (isError) return <div>Có lỗi xảy ra khi lấy dữ liệu!</div>;

    return (
        <section className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn Hàng</h2>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        # Mã đơn (Chi tiết)
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                                        
                                        {/* 1. MÃ ĐƠN HÀNG - Bấm vào đây để xem chi tiết */}
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button 
                                                onClick={() => handleShowDetail(order)}
                                                className="text-indigo-600 hover:text-indigo-900 font-bold underline"
                                                title="Xem chi tiết đơn hàng này"
                                            >
                                                #{order._id?.substring(20, 24)}
                                            </button>
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{order.name}</p>
                                            <p className="text-gray-400 text-xs">{order.email}</p>
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-semibold">
                                            ${order.totalPrice}
                                        </td>

                                        {/* Trạng thái (Badge) */}
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                                                ${order.status === 'completed' ? 'text-green-900 bg-green-200' : 
                                                  order.status === 'pending' ? 'text-yellow-900 bg-yellow-200' : 
                                                  'text-red-900 bg-red-200'}`}>
                                                {order.status === 'pending' && "Chờ xử lý"}
                                                {order.status === 'completed' && "Đã giao"}
                                                {order.status === 'canceled' && "Đã hủy"}
                                            </span>
                                        </td>

                                        {/* 2. HÀNH ĐỘNG - Logic ẩn hiện nút */}
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            {order.status === 'pending' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(order._id, "completed")}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition shadow-sm"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(order._id, "canceled")}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition shadow-sm"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">
                                                    Đã hoàn tất
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                Chi tiết đơn hàng <span className="text-indigo-600">#{selectedOrder._id}</span>
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Thông tin người nhận */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Người nhận</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Số điện thoại</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Địa chỉ</p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedOrder.address.city}, {selectedOrder.address.country}
                                    </p>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Giá</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">SL</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {selectedOrder.productIds.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-3">
                                                    <div className="w-10 h-12 flex-shrink-0 overflow-hidden rounded border">
                                                        {item.productId ? (
                                                            <img 
                                                                src={getImgUrl(item.productId.coverImage)} 
                                                                alt="cover" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200"></div>
                                                        )}
                                                    </div>
                                                    <span className="line-clamp-1">{item.productId ? item.productId.title : "Sản phẩm đã xóa"}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 text-right">
                                                    ${item.productId?.newPrice}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                                                    ${((item.productId?.newPrice || 0) * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-bold text-gray-700">Tổng thanh toán</span>
                                <span className="font-bold text-2xl text-indigo-600">${selectedOrder.totalPrice}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                            <button onClick={closeModal} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 font-medium transition">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ManageOrders;