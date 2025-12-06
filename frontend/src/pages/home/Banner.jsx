import React from "react";
import bannerImg from "../../assets/banner.png";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12">
      <div className="md:w-1/2 w-full flex items-center md:justify-end">
        <img src={bannerImg} alt="" />
      </div>
      <div className="md:w-1/2 w-full">
        <h1 className="md:text-5xl text-2xl font-medium mb-7">
          Bản phát hành mới trong tuần này
        </h1>
        <p className="mb-10">
          Đã đến lúc cập nhật danh sách đọc của bạn với những tác phẩm mới nhất và tuyệt vời nhất trong thế giới văn học. Từ những câu chuyện ly kỳ nghẹt thở đến những hồi ký lôi cuốn, những tác phẩm mới ra mắt tuần này sẽ mang đến điều gì đó cho tất cả mọi người.
        </p>
        <button className="btn-primary">Đặt mua</button>
      </div>
    </div>
  );
};

export default Banner;
