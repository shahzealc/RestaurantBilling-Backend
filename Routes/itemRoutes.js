const express = require("express");
const { addItem, getItems, getSearchedItems, updateItem, deleteItem, getCategory, getCategoryItem } = require("../Controller/itemController");
const { upload } = require("../helpers/uploadImage");
const router = express.Router();

router.post("/", upload.single('itemImage'), addItem);
router.get("/", getItems);
router.get("/search", getSearchedItems);
router.get("/getCategory", getCategory);
router.get("/getCategoryItem", getCategoryItem);
router.patch("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
