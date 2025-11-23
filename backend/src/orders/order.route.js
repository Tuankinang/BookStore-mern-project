const express = require("express");
const router = express.Router();
const { createAOrder, getOrderByEmail } = require("./order.controller");

//tạo đơn hàng
router.post("/", createAOrder);

//get orders by user email
router.get("/email/:email", getOrderByEmail);

module.exports = router;
