const express = require("express");
const { addOrder, getOrder, updateOrder, deleteOrder, getEmptyTable, getOrders } = require("../Controller/orderController");
const router = express.Router();

router.post("/", addOrder);
router.get("/", getOrder);
router.get("/all", getOrders);
router.get("/getEmptyTable",getEmptyTable);
router.put("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);

module.exports = router;
